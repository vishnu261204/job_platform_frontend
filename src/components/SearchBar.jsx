import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, X, MapPin } from 'lucide-react';

const SearchBar = ({ onSearch, initialSearch = '', initialLocation = '' }) => {
  const [keyword, setKeyword] = useState(initialSearch);
  const [location, setLocation] = useState(initialLocation);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch({ search: keyword, location });
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [keyword, location]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg shadow-gray-200/50 dark:shadow-black/20 border border-gray-100 dark:border-gray-700 p-2 flex flex-col sm:flex-row gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Job title, keyword, or company"
            className="w-full pl-12 pr-4 py-3 bg-transparent text-sm outline-none text-gray-900 dark:text-white placeholder:text-gray-400"
          />
          {keyword && (
            <button onClick={() => setKeyword('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
        <div className="w-px bg-gray-100 dark:bg-gray-700 hidden sm:block" />
        <div className="flex-1 relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location (Remote, City…)"
            className="w-full pl-12 pr-4 py-3 bg-transparent text-sm outline-none text-gray-900 dark:text-white placeholder:text-gray-400"
          />
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all active:scale-[0.98]">
          <Search className="w-4 h-4 sm:hidden" />
          <span className="hidden sm:inline">Search Jobs</span>
        </button>
      </div>
    </motion.div>
  );
};

export default SearchBar;
