import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'talentyra_saved';

const useSavedJobs = () => {
  const [savedIds, setSavedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds));
  }, [savedIds]);

  const toggleSave = useCallback((jobId) => {
    setSavedIds(prev => prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]);
  }, []);

  const isSaved = useCallback((jobId) => savedIds.includes(jobId), [savedIds]);

  return { savedIds, toggleSave, isSaved };
};

export default useSavedJobs;
