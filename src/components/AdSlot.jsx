const AdSlot = ({ format = 'banner', className = '' }) => {
  const styles = {
    banner: 'w-full h-24',
    rectangle: 'w-full h-64',
    sidebar: 'w-full h-72',
    native: 'w-full h-20',
  };

  return (
    <div
      className={`bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 text-xs font-medium ${styles[format]} ${className}`}
    >
      <span>Ad Space</span>
    </div>
  );
};

export default AdSlot;
