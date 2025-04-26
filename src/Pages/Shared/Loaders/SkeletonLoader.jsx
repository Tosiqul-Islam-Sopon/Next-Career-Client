export default function SkeletonLoader() {
  return (
    <div className="max-w-3xl mx-auto p-6 mt-8">
      <div className="animate-pulse">
        {/* Header with profile image and name */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-24 w-24 bg-emerald-200 rounded-full mb-4"></div>
          <div className="h-6 w-48 bg-emerald-200 rounded mb-2"></div>
          <div className="h-4 w-64 bg-emerald-100 rounded"></div>
        </div>

        {/* Content sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="h-5 w-32 bg-emerald-200 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 w-full bg-emerald-100 rounded"></div>
              <div className="h-4 w-5/6 bg-emerald-100 rounded"></div>
              <div className="h-4 w-4/6 bg-emerald-100 rounded"></div>
            </div>
          </div>

          <div>
            <div className="h-5 w-32 bg-emerald-200 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 w-full bg-emerald-100 rounded"></div>
              <div className="h-4 w-5/6 bg-emerald-100 rounded"></div>
              <div className="h-4 w-4/6 bg-emerald-100 rounded"></div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="h-5 w-32 bg-emerald-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 w-full bg-emerald-100 rounded"></div>
            <div className="h-4 w-5/6 bg-emerald-100 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
