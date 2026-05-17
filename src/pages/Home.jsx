import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { Sparkles, Shield, Zap, Globe } from 'lucide-react';
import { fetchJobs } from '../services/api';
import SEO from '../components/SEO';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import JobCard from '../components/JobCard';
import { JobGridSkeleton } from '../components/Loader';
import Footer from '../components/Footer';

const FEATURES = [
  { icon: Zap, title: 'AI-Powered Matching', desc: 'Smart algorithms find the best roles for your skills.' },
  { icon: Shield, title: 'Trusted Companies', desc: 'Vetted positions from top-tier organizations worldwide.' },
  { icon: Globe, title: 'Remote & Global', desc: 'Work from anywhere with opportunities across the globe.' },
];

const Home = () => {
  const [filters, setFilters] = useState({ search: '', location: '', type: '', page: 1, limit: 12 });

  const { data, isLoading, error } = useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => fetchJobs(filters),
    placeholderData: keepPreviousData,
  });

  const jobs = data?.data || [];
  const pagination = data?.pagination;

  useEffect(() => {
    if (pagination && filters.page > pagination.totalPages) {
      setFilters(prev => ({ ...prev, page: 1 }));
    }
  }, [pagination?.totalPages]);

  const handleSearch = ({ search, location }) => {
    setFilters(prev => ({ ...prev, search, location, page: 1 }));
  };

  const handleTypeChange = (type) => {
    setFilters(prev => ({ ...prev, type, page: 1 }));
  };

  const clearFilters = () => {
    setFilters(prev => ({ ...prev, type: '', page: 1 }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#08080f]">
      <SEO />
      <Navbar onSearch={(s) => handleSearch({ ...filters, search: s })} searchValue={filters.search} />

      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur rounded-full text-white/80 text-sm mb-6 border border-white/10">
              <Sparkles className="w-4 h-4" />
              <span>1,000+ jobs added this week</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 text-balance">
              Find Work That <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-400">Matters</span>
            </h1>
            <p className="text-lg lg:text-xl text-white/70 mb-10 max-w-2xl mx-auto">
              Discover roles at companies that align with your values, skills, and career goals.
            </p>
            <SearchBar onSearch={handleSearch} />
          </motion.div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            {FEATURES.map((f, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/50">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{f.desc}</p>
              </div>
            ))}
          </motion.div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {filters.search || filters.type ? 'Search Results' : 'Latest Opportunities'}
              </h2>
              {pagination && (
                <p className="text-sm text-gray-500 mt-1">{pagination.total} jobs available</p>
              )}
            </div>
            <Filters
              activeType={filters.type}
              onTypeChange={handleTypeChange}
              onClear={clearFilters}
            />
          </div>

          {isLoading ? (
            <JobGridSkeleton count={6} />
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-gray-500 mb-4">Failed to load jobs</p>
              <button onClick={() => window.location.reload()} className="text-indigo-600 hover:underline">Try again</button>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No jobs found</h3>
              <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {jobs.map((job, i) => (
                  <JobCard key={job._id} job={job} index={i} />
                ))}
              </div>

              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-12">
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                    disabled={filters.page <= 1}
                    className="px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 disabled:opacity-50"
                  >
                    Prev
                  </button>

                  {(() => {
                    const total = pagination.totalPages;
                    const current = filters.page;
                    const range = [];
                    let start = Math.max(1, current - 2);
                    let end = Math.min(total, current + 2);
                    if (end - start < 4) {
                      if (start === 1) end = Math.min(total, start + 4);
                      else start = Math.max(1, end - 4);
                    }
                    for (let i = start; i <= end; i++) range.push(i);
                    return range.map(p => (
                      <button
                        key={p}
                        onClick={() => setFilters(prev => ({ ...prev, page: p }))}
                        className={`w-10 h-10 rounded-xl font-medium text-sm transition-all ${
                          filters.page === p
                            ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                        }`}
                      >
                        {p}
                      </button>
                    ));
                  })()}

                  <button
                    onClick={() => setFilters(prev => ({ ...prev, page: Math.min(prev.page + 1, pagination.totalPages) }))}
                    disabled={filters.page >= pagination.totalPages}
                    className="px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
