const FullScreenLoader = () => {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-primary animate-spin"></div>
          <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-secondary opacity-60 animate-ping"></div>
        </div>
        <h2 className="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
          Loading
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Please wait while we prepare your experience
        </p>
      </div>
    </div>
  );
};

export default FullScreenLoader;
