import { motion } from 'framer-motion';

export const Spinner = ({ size = 'md' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' };
  return (
    <motion.div
      className={`${sizes[size]} rounded-full border-2 border-gray-200 border-t-indigo-500`}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
    />
  );
};

export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center">
      <Spinner size="lg" />
      <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm font-medium">Loading…</p>
    </div>
  </div>
);

export const JobSkeleton = () => (
  <div className="bg-white dark:bg-gray-800/80 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/50 animate-pulse">
    <div className="flex items-start gap-4 mb-4">
      <div className="w-12 h-12 rounded-xl skeleton" />
      <div className="flex-1 space-y-2">
        <div className="h-5 w-3/4 skeleton rounded-lg" />
        <div className="h-4 w-1/3 skeleton rounded-lg" />
      </div>
      <div className="w-8 h-8 rounded-full skeleton" />
    </div>
    <div className="flex gap-2 mb-4">
      <div className="h-6 w-20 skeleton rounded-full" />
      <div className="h-6 w-24 skeleton rounded-full" />
      <div className="h-6 w-16 skeleton rounded-full" />
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-3 w-full skeleton rounded" />
      <div className="h-3 w-5/6 skeleton rounded" />
    </div>
    <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700">
      <div className="h-4 w-24 skeleton rounded" />
      <div className="h-9 w-28 skeleton rounded-lg" />
    </div>
  </div>
);

export const JobGridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
    {Array.from({ length: count }).map((_, i) => <JobSkeleton key={i} />)}
  </div>
);

export const AuthSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md animate-pulse">
      <div className="h-8 w-48 skeleton rounded-lg mx-auto mb-8" />
      <div className="space-y-4">
        <div className="h-12 skeleton rounded-xl" />
        <div className="h-12 skeleton rounded-xl" />
        <div className="h-12 skeleton rounded-xl" />
      </div>
      <div className="h-12 skeleton rounded-xl mt-6" />
    </div>
  </div>
);
