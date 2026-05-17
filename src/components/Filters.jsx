import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const JOB_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'remote', label: 'Remote' },
  { value: 'full-time', label: 'Full-Time' },
  { value: 'part-time', label: 'Part-Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
];

const QUICK_FILTERS = [
  { label: 'Remote', type: 'remote' },
  { label: 'Full-Time', type: 'full-time' },
  { label: 'Recent', type: 'recent' },
  { label: 'High Salary', type: 'salary' },
];

const Filters = ({ activeType, onTypeChange, onClear }) => {
  const hasActive = activeType && activeType !== '';

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {JOB_TYPES.map((t) => (
          <motion.button
            key={t.value}
            whileTap={{ scale: 0.95 }}
            onClick={() => onTypeChange(t.value)}
            className={`px-4 py-2 text-sm font-medium rounded-xl border transition-all ${
              activeType === t.value
                ? 'bg-indigo-500 text-white border-indigo-500 shadow-md shadow-indigo-500/20'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400'
            }`}
          >
            {t.label}
          </motion.button>
        ))}
        {hasActive && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onClear}
            className="px-3 py-2 text-sm text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Clear
          </motion.button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-gray-400 font-medium uppercase tracking-wider mr-1">Quick:</span>
        {QUICK_FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => onTypeChange(f.type === activeType ? '' : f.type)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              activeType === f.type
                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
                : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Filters;
