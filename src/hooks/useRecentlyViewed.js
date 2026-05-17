import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'talentyra_recent';

const useRecentlyViewed = () => {
  const [recentIds, setRecentIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentIds));
  }, [recentIds]);

  const addRecent = useCallback((jobId) => {
    setRecentIds(prev => [jobId, ...prev.filter(id => id !== jobId)].slice(0, 10));
  }, []);

  return { recentIds, addRecent };
};

export default useRecentlyViewed;
