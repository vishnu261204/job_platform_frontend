import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem('talentyra_auth');
    if (stored) {
      const { token } = JSON.parse(stored);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error(`[API Error] ${err.config?.url}:`, err.response?.status, err.message);
    return Promise.reject(err);
  }
);

const FALLBACK_SOURCES = [
  { name: 'Remotive', url: 'https://remotive.com/api/remote-jobs' },
  { name: 'CareerNest', url: 'https://careernest.cloud/api/feed?limit=50' },
  { name: 'Jobicy', url: 'https://jobicy.com/api/v2/remote-jobs?count=50' },
  { name: 'RemoteJobsOrg', url: 'https://remotejobs.org/api/v1/jobs?limit=50' },
];

function stripHtml(html) {
  return (html || '').replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').replace(/\s+/g, ' ').trim();
}

function mapJobType(type) {
  if (!type) return 'full-time';
  const map = { full_time: 'full-time', part_time: 'part-time', contract: 'contract', freelance: 'freelance' };
  return map[type.toLowerCase()] || 'full-time';
}

function mapJobicyType(type) {
  if (!type) return 'full-time';
  const t = type.toLowerCase();
  if (t.includes('part')) return 'part-time';
  if (t.includes('contract')) return 'contract';
  if (t.includes('intern')) return 'internship';
  if (t.includes('full')) return 'full-time';
  return 'full-time';
}

const normalizeRemotive = (j) => ({
  _id: `rem-${j.id}`, title: j.title, company: j.company_name, location: j.candidate_required_location || 'Remote',
  type: mapJobType(j.job_type), description: stripHtml(j.description), applyUrl: j.url,
  source: 'Remotive', salary: j.salary || null, tags: j.tags || [],
  postedAt: j.publication_date ? new Date(j.publication_date).toISOString() : new Date().toISOString()
});

const normalizeCareerNest = (j) => ({
  _id: `cn-${j.id}`, title: j.title, company: j.company, location: j.location || 'Remote',
  type: (j.job_type || 'full-time').toLowerCase(), description: stripHtml(j.description),
  applyUrl: j.apply_url || j.job_url || '', source: 'CareerNest',
  salary: j.salary ? `${j.salary.currency || '$'}${j.salary.min || ''} - ${j.salary.currency || '$'}${j.salary.max || ''}` : null,
  tags: j.tags || [], postedAt: j.posted_at ? new Date(j.posted_at).toISOString() : new Date().toISOString()
});

const normalizeJobicy = (j) => ({
  _id: `jcy-${j.id}`, title: j.jobTitle, company: j.companyName, location: j.jobGeo || 'Anywhere',
  type: mapJobicyType(j.jobType), description: stripHtml(j.jobDescription), applyUrl: j.url || '',
  source: 'Jobicy', salary: j.annualSalaryMin || j.annualSalaryMax ? `$${j.annualSalaryMin || '?'} - $${j.annualSalaryMax || '?'}` : null,
  tags: [j.jobIndustry, j.jobLevel].filter(Boolean),
  postedAt: j.pubDate ? new Date(j.pubDate).toISOString() : new Date().toISOString()
});

const normalizeRemoteJobsOrg = (j) => ({
  _id: `rjo-${j.id}`, title: j.title, company: j.company?.name || 'Unknown', location: j.location || 'Remote',
  type: (j.type || 'full-time').toLowerCase(), description: stripHtml(j.description),
  applyUrl: j.apply_url || j.url || '', source: 'RemoteJobsOrg', salary: j.salary_text || null,
  tags: [], postedAt: j.posted_at ? new Date(j.posted_at).toISOString() : new Date().toISOString()
});

const fetchFallbackJobs = async () => {
  const results = await Promise.allSettled(
    FALLBACK_SOURCES.map(s => axios.get(s.url, { timeout: 8000 }).then(r => ({ name: s.name, data: r.data })))
  );
  let jobs = [];
  for (const r of results) {
    if (r.status !== 'fulfilled' || !r.value.data) continue;
    const { name, data } = r.value;
    try {
      switch (name) {
        case 'Remotive': if (data.jobs) jobs = jobs.concat(data.jobs.map(normalizeRemotive)); break;
        case 'CareerNest': if (data.jobs) jobs = jobs.concat(data.jobs.map(normalizeCareerNest)); break;
        case 'Jobicy': if (data.jobs) jobs = jobs.concat(data.jobs.map(normalizeJobicy)); break;
        case 'RemoteJobsOrg': if (data.data) jobs = jobs.concat(data.data.map(normalizeRemoteJobsOrg)); break;
      }
    } catch {}
  }
  return jobs;
};

const filterAndPaginate = (jobs, params) => {
  const { search, location, type } = params;
  let filtered = jobs;
  if (search) { const q = search.toLowerCase(); filtered = filtered.filter(j => (j.title||'').toLowerCase().includes(q) || (j.company||'').toLowerCase().includes(q)); }
  if (location) { const loc = location.toLowerCase(); filtered = filtered.filter(j => (j.location||'').toLowerCase().includes(loc)); }
  if (type) { filtered = filtered.filter(j => j.type === type || (type === 'remote' && (j.location||'').toLowerCase() === 'remote')); }
  const page = parseInt(params.page) || 1;
  const limit = parseInt(params.limit) || 12;
  const total = filtered.length;
  const start = (page - 1) * limit;
  return {
    success: true,
    data: filtered.slice(start, start + limit),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  };
};

export const fetchJobs = async (params = {}) => {
  try {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.location) query.set('location', params.location);
    if (params.type) query.set('type', params.type);
    if (params.page) query.set('page', params.page);
    if (params.limit) query.set('limit', params.limit);
    const res = await api.get(`/jobs?${query.toString()}`);
    return res.data;
  } catch {
    try {
      const fallback = await fetchFallbackJobs();
      if (fallback.length > 0) return filterAndPaginate(fallback, params);
    } catch {}
    return dummyJobs(params);
  }
};

export const fetchJobById = async (id) => {
  try {
    const res = await api.get(`/jobs/${id}`);
    return res.data;
  } catch {
    try {
      const fallback = await fetchFallbackJobs();
      const job = fallback.find(j => j._id === id);
      if (job) return { success: true, data: job };
    } catch {}
    const all = dummyJobs({});
    const job = all.data?.find(j => j._id === id);
    return job ? { success: true, data: job } : { success: false, message: 'Not found' };
  }
};

const companies = [
  { name: 'Stripe', logo: 'S', color: '#635bff' },
  { name: 'Linear', logo: 'L', color: '#5e6ad2' },
  { name: 'Vercel', logo: 'V', color: '#000' },
  { name: 'Figma', logo: 'F', color: '#1e1e1e' },
  { name: 'Notion', logo: 'N', color: '#000' },
  { name: 'Supabase', logo: 'S', color: '#3ecf8e' },
  { name: 'Railway', logo: 'R', color: '#0b0d0e' },
  { name: 'Cal.com', logo: 'C', color: '#292929' },
];

const jobTitles = [
  'Senior Frontend Engineer', 'Full Stack Developer', 'Product Designer',
  'Backend Engineer', 'DevOps Engineer', 'Data Scientist',
  'React Developer', 'Software Architect', 'iOS Engineer',
  'ML Engineer', 'Cloud Engineer', 'UX Researcher',
];

const locations = ['Remote', 'San Francisco', 'New York', 'London', 'Berlin', 'Singapore', 'Austin', 'Toronto'];
const types = ['full-time', 'part-time', 'contract', 'internship', 'remote'];
const sources = ['Direct', 'Remotive', 'Arbeitnow', 'Jobicy', 'CareerNest'];

function random(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomBetween(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

const dummyJobs = (params) => {
  const items = Array.from({ length: 24 }, (_, i) => {
    const company = random(companies);
    const postedAgo = randomBetween(0, 20);
    const d = new Date();
    d.setDate(d.getDate() - postedAgo);
    return {
      _id: `job_${i + 1}`,
      title: random(jobTitles),
      company: company.name,
      companyLogo: company.logo,
      companyColor: company.color,
      location: random(locations),
      type: random(types),
      description: `We are looking for a talented ${random(jobTitles).toLowerCase()} to join our team at ${company.name}. You will work on cutting-edge products that serve millions of users worldwide.`,
      applyUrl: 'https://example.com/apply',
      source: random(sources),
      salary: `$${randomBetween(80, 220)}k`,
      postedAt: d.toISOString(),
      createdAt: d.toISOString(),
      tags: [random(types), random(['React', 'Node.js', 'Python', 'TypeScript', 'Go', 'Rust', 'AWS', 'Docker', 'Kubernetes'])],
    };
  });

  let filtered = items;
  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(j => j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q));
  }
  if (params.type) {
    filtered = filtered.filter(j => j.type === params.type || (params.type === 'remote' && j.location.toLowerCase() === 'remote'));
  }
  if (params.location) {
    filtered = filtered.filter(j => j.location.toLowerCase().includes(params.location.toLowerCase()));
  }

  const page = parseInt(params.page) || 1;
  const limit = parseInt(params.limit) || 12;
  const start = (page - 1) * limit;
  const paged = filtered.slice(start, start + limit);

  return {
    success: true,
    data: paged,
    pagination: { page, limit, total: filtered.length, totalPages: Math.ceil(filtered.length / limit) },
  };
};

export default api;
