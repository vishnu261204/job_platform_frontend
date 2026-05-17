import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, MapPin, Clock, Briefcase, ExternalLink, Heart, Share2 } from 'lucide-react';
import { fetchJobById } from '../services/api';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';
import useSavedJobs from '../hooks/useSavedJobs';
import useRecentlyViewed from '../hooks/useRecentlyViewed';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useEffect } from 'react';

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { isSaved, toggleSave } = useSavedJobs();
  const { addRecent } = useRecentlyViewed();

  const { data, isLoading } = useQuery({
    queryKey: ['job', id],
    queryFn: () => fetchJobById(id),
  });

  const job = data?.data;

  useEffect(() => {
    if (job?._id) addRecent(job._id);
  }, [job?._id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#08080f]">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-6 w-24 skeleton rounded-lg" />
            <div className="h-10 w-3/4 skeleton rounded-xl" />
            <div className="h-6 w-1/3 skeleton rounded-lg" />
            <div className="flex gap-3"><div className="h-6 w-20 skeleton rounded-full" /><div className="h-6 w-24 skeleton rounded-full" /></div>
            <div className="space-y-3"><div className="h-4 w-full skeleton rounded" /><div className="h-4 w-5/6 skeleton rounded" /><div className="h-4 w-4/6 skeleton rounded" /></div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#08080f]">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Job not found</h2>
          <Link to="/" className="text-indigo-600 hover:underline flex items-center justify-center gap-2 mt-4">
            <ArrowLeft className="w-4 h-4" /> Back to jobs
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const saved = isSaved(job._id);
  const daysAgo = Math.floor((Date.now() - new Date(job.postedAt).getTime()) / (1000 * 60 * 60 * 24));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description?.replace(/<[^>]*>/g, '').slice(0, 500),
    datePosted: job.postedAt,
    employmentType: job.type === 'remote' ? 'REMOTE' : job.type?.toUpperCase().replace('-', '_') || 'FULL_TIME',
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company,
      logo: job.companyLogo || undefined,
    },
    jobLocation: {
      '@type': 'Place',
      address: { '@type': 'PostalAddress', addressLocality: job.location },
    },
    ...(job.salary ? {
      baseSalary: {
        '@type': 'MonetaryAmount',
        currency: 'USD',
        value: { '@type': 'QuantitativeValue', value: parseInt(job.salary.replace(/[^0-9]/g, '')), unitText: 'YEAR' },
      },
    } : {}),
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#08080f]">
      <SEO
        title={`${job.title} at ${job.company}`}
        description={`Apply for ${job.title} at ${job.company}. ${job.location} - ${job.type}.`}
        url={`https://talentyra.com/jobs/${job._id}`}
        type="article"
        jsonLd={jsonLd}
      />
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to jobs
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700/50"
            >
              <div className="flex items-start gap-5 mb-6">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg flex-shrink-0"
                  style={{ background: job.companyColor || 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                >
                  {job.companyLogo || job.company[0]}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">{job.title}</h1>
                  <p className="text-lg text-gray-500 font-medium">{job.company}</p>
                  <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location}</span>
                    <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {job.type}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {daysAgo === 0 ? 'Today' : `${daysAgo} days ago`}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-xs font-medium rounded-full border border-indigo-200 dark:border-indigo-800">{job.type}</span>
                {job.salary && (
                  <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 text-xs font-medium rounded-full border border-emerald-200 dark:border-emerald-800">{job.salary}</span>
                )}
                {job.tags?.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-xs font-medium rounded-full border border-gray-200 dark:border-gray-700">{tag}</span>
                ))}
                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs font-medium rounded-full border border-blue-200 dark:border-blue-800">{job.source}</span>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={job.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
                >
                  Apply Now <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => toggleSave(job._id)}
                  className={`p-3 rounded-xl border transition-all ${
                    saved
                      ? 'bg-red-50 border-red-200 text-red-500 dark:bg-red-900/20 dark:border-red-800'
                      : 'border-gray-200 dark:border-gray-700 text-gray-400 hover:text-red-500 hover:border-red-200 dark:hover:border-red-800'
                  }`}
                  aria-label={saved ? 'Remove from saved' : 'Save job'}
                >
                  <Heart className="w-5 h-5" fill={saved ? 'currentColor' : 'none'} />
                </button>
                <button className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-indigo-500 hover:border-indigo-200 transition-all">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700/50"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">About the Role</h2>
              <div
                className="prose prose-sm max-w-none text-gray-600 dark:text-gray-300 leading-relaxed job-description"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/50 sticky top-28"
            >
              <a
                href={job.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 mb-4"
              >
                Apply Now <ExternalLink className="w-4 h-4" />
              </a>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">Company</p>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-md"
                      style={{ background: job.companyColor || '#6366f1' }}
                    >
                      {job.companyLogo || job.company[0]}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{job.company}</span>
                  </div>
                </div>
                <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Location</span>
                    <span className="font-medium text-gray-900 dark:text-white">{job.location}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Type</span>
                    <span className="font-medium text-gray-900 dark:text-white capitalize">{job.type}</span>
                  </div>
                  {job.salary && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Salary</span>
                      <span className="font-medium text-emerald-600">{job.salary}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Posted</span>
                    <span className="font-medium text-gray-900 dark:text-white">{daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JobDetails;
