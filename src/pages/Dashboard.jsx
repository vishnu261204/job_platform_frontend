import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Briefcase, TrendingUp, ArrowRight, Bell, Bookmark, Search } from 'lucide-react';
import { fetchJobs } from '../services/api';
import SEO from '../components/SEO';
import JobCard from '../components/JobCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { JobGridSkeleton } from '../components/Loader';

const Dashboard = () => {
  const { user } = useAuth();

  const { data: jobsData, isLoading } = useQuery({
    queryKey: ['dashboard-jobs'],
    queryFn: () => fetchJobs({ limit: 6 }),
  });

  const savedIds = (() => {
    try { return JSON.parse(localStorage.getItem('talentyra_saved') || '[]'); } catch { return []; }
  })();

  const savedJobs = jobsData?.data?.filter(j => savedIds.includes(j._id)) || [];
  const jobCount = jobsData?.pagination?.total || 0;

  const stats = [
    { icon: Briefcase, label: 'Jobs Available', value: jobCount, color: 'from-blue-500 to-cyan-500' },
    { icon: Bookmark, label: 'Saved Jobs', value: savedJobs.length, color: 'from-purple-500 to-pink-500' },
    { icon: TrendingUp, label: 'Applications', value: '—', color: 'from-emerald-500 to-teal-500' },
    { icon: Bell, label: 'Alerts', value: 2, color: 'from-amber-500 to-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#08080f]">
      <SEO title="Dashboard" description="Your personalized job search dashboard on Talentyra." />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name?.split(' ')[0] || 'there'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Here's your job search overview</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/50"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-lg`}>
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recommended Jobs</h2>
              <Link to="/" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {isLoading ? (
              <JobGridSkeleton count={3} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobsData?.data?.slice(0, 4).map((job, i) => (
                  <JobCard key={job._id} job={job} index={i} />
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                <Heart className="w-5 h-5 inline-block mr-2 text-red-500" />
                Saved Jobs
              </h2>
            </div>

            {savedJobs.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-8 text-center">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-7 h-7 text-gray-300 dark:text-gray-600" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">No saved jobs yet</h3>
                <p className="text-sm text-gray-500 mb-4">Save jobs you're interested in</p>
                <Link to="/"
                  className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                  <Search className="w-4 h-4" /> Browse jobs
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {savedJobs.slice(0, 5).map((job, i) => (
                  <JobCard key={job._id} job={job} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
