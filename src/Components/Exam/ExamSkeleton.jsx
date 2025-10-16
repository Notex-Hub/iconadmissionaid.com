
const ExamSkeleton = () => {
  return (
    <div className="animate-pulse bg-white rounded-2xl shadow-sm overflow-hidden min-w-0 flex flex-col">
      <div className="w-full h-44 bg-gray-200" />
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="mt-4 flex gap-3">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
};

export default ExamSkeleton;
