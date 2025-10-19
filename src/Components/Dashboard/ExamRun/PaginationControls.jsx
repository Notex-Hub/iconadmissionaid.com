/* eslint-disable react/prop-types */
export const PaginationControls = ({ page, totalPages, setPage }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
          className={`px-4 py-2 rounded-md ${page <= 1 ? "bg-gray-200 text-gray-400" : "bg-white shadow"} `}
        >
          Prev
        </button>

        <div className="flex items-center gap-1 overflow-x-auto">
          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`px-3 py-1 rounded-md ${pageNum === page ? "bg-[#c21010] text-white" : "bg-white text-gray-700 shadow-sm"}`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
          className={`px-4 py-2 rounded-md ${page >= totalPages ? "bg-gray-200 text-gray-400" : "bg-white shadow"} `}
        >
          Next
        </button>
      </div>
    </div>
  );
};
