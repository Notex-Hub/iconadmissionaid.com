import PropTypes from "prop-types";

export default function Pagination({ page, totalPages, setPage }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        disabled={page === 1}
        className={`px-3 py-1 rounded-md ${page === 1 ? "bg-gray-100 text-gray-400" : "bg-white shadow-sm"}`}
      >
        Prev
      </button>

      <div className="hidden sm:flex items-center gap-1">
        {Array.from({ length: totalPages }).map((_, i) => {
          const n = i + 1;
          const isActive = n === page;
          return (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`px-3 py-1 rounded-md ${isActive ? "bg-green-600 text-white" : "bg-white shadow-sm"}`}
            >
              {n}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        disabled={page === totalPages}
        className={`px-3 py-1 rounded-md ${page === totalPages ? "bg-gray-100 text-gray-400" : "bg-white shadow-sm"}`}
      >
        Next
      </button>
    </div>
  );
}

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
};
