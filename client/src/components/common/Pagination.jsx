export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const maxVisiblePages = 5;
  const halfVisible = Math.floor(maxVisiblePages / 2);

  let startPage = Math.max(1, currentPage - halfVisible);
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  return (
    <div className="flex justify-center items-center space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded bg-gray-300 text-gray-700 disabled:opacity-50 hover:bg-gray-400"
      >
        Prev
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-1 rounded bg-gray-300 text-gray-700 hover:bg-gray-400"
          >
            1
          </button>
          {startPage > 2 && <span>...</span>}
        </>
      )}

      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded ${
            currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
          }`}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span>...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-1 rounded bg-gray-300 text-gray-700 hover:bg-gray-400"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded bg-gray-300 text-gray-700 disabled:opacity-50 hover:bg-gray-400"
      >
        Next
      </button>
    </div>
  );
}
