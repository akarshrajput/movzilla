export default function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex justify-center my-8 gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded bg-neutral-700 disabled:opacity-50"
      >
        Prev
      </button>
      <span className="px-3 py-1">
        {currentPage} / {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded bg-neutral-700 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
