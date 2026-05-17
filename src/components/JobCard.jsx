import { memo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Heart, ExternalLink, Sparkles } from 'lucide-react';
import useSavedJobs from '../hooks/useSavedJobs';

const JobCard = memo(({ job, index = 0 }) => {
  const { isSaved, toggleSave } = useSavedJobs();
  const saved = isSaved(job._id);

  const daysAgo = Math.floor((Date.now() - new Date(job.postedAt).getTime()) / (1000 * 60 * 60 * 24));
  const isNew = daysAgo <= 3;

  const typeColors = {
    remote: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    'full-time': 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    'part-time': 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    contract: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    internship: 'bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300 border-pink-200 dark:border-pink-800',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link to={`/jobs/${job._id}`} className="block group">
        <div className="relative bg-white dark:bg-gray-800/90 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/50 card-hover cursor-pointer">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/3 group-hover:to-purple-500/3 transition-all duration-500 pointer-events-none" />

          <div className="relative">
            <div className="flex items-start gap-4 mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0"
                style={{ background: job.companyColor || 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
              >
                {job.companyLogo || job.company[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {isNew && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-[11px] font-semibold rounded-full border border-indigo-200 dark:border-indigo-800">
                      <Sparkles className="w-3 h-3" /> New
                    </span>
                  )}
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                  {job.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{job.company}</p>
              </div>
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleSave(job._id); }}
                className={`p-2 rounded-xl transition-all ${
                  saved
                    ? 'text-red-500 bg-red-50 dark:bg-red-900/20 scale-110'
                    : 'text-gray-300 dark:text-gray-600 hover:text-gray-400 dark:hover:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
                aria-label={saved ? 'Remove from saved' : 'Save job'}
              >
                <Heart className="w-5 h-5" fill={saved ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`text-xs font-medium px-3 py-1 rounded-full border ${typeColors[job.type] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                {job.type}
              </span>
              {job.salary && (
                <span className="text-xs font-medium px-3 py-1 rounded-full border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                  {job.salary}
                </span>
              )}
              {job.tags?.slice(0, 2).map((tag, i) => (
                <span key={i} className="text-xs px-3 py-1 rounded-full bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700">
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">
              {job.description?.replace(/<[^>]*>/g, '').slice(0, 150)}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700/50">
              <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}</span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                View Details <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

JobCard.displayName = 'JobCard';

export default JobCard;
