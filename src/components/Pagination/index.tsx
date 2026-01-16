import { useMemo } from 'react';

type PaginationSize = 'sm' | 'md';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  size?: PaginationSize;
  previousLabel?: string;
  nextLabel?: string;
  maxVisiblePages?: number;
  className?: string;
}

const sizeClasses: Record<PaginationSize, { button: string; pageButton: string }> = {
  sm: {
    button: 'px-3 h-9',
    pageButton: 'w-9 h-9',
  },
  md: {
    button: 'px-3 h-10',
    pageButton: 'w-10 h-10',
  },
};

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  size = 'md',
  previousLabel = 'Previous',
  nextLabel = 'Next',
  maxVisiblePages = 5,
  className = '',
}: PaginationProps) => {
  const baseClasses = 'flex items-center justify-center border border-gray-300 font-cera-medium text-sm focus:outline-none transition-colors';
  const defaultClasses = 'text-gray-600 bg-white hover:bg-gray-100 hover:text-gray-800';
  const activeClasses = 'text-white bg-green-50 hover:bg-green-100 border-green-50';
  const disabledClasses = 'opacity-50 cursor-not-allowed pointer-events-none';

  const pages = useMemo(() => {
    const items: (number | 'ellipsis')[] = [];

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      const halfVisible = Math.floor(maxVisiblePages / 2);
      let startPage = Math.max(1, currentPage - halfVisible);
      let endPage = Math.min(totalPages, currentPage + halfVisible);

      if (currentPage <= halfVisible) {
        endPage = maxVisiblePages;
      } else if (currentPage >= totalPages - halfVisible) {
        startPage = totalPages - maxVisiblePages + 1;
      }

      if (startPage > 1) {
        items.push(1);
        if (startPage > 2) {
          items.push('ellipsis');
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        if (!items.includes(i)) {
          items.push(i);
        }
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          items.push('ellipsis');
        }
        items.push(totalPages);
      }
    }

    return items;
  }, [currentPage, totalPages, maxVisiblePages]);

  if (totalPages <= 1) {
    return null;
  }

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <nav aria-label="Pagination" className={className}>
      <ul className="flex -space-x-px text-sm">
        {/* Previous Button */}
        <li>
          <button
            type="button"
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={currentPage === 1}
            className={`${baseClasses} ${defaultClasses} ${sizeClasses[size].button} rounded-l-lg ${currentPage === 1 ? disabledClasses : ''}`}
            aria-label="Go to previous page"
          >
            {previousLabel}
          </button>
        </li>

        {/* Page Numbers */}
        {pages.map((page, index) => (
          <li key={`page-${index}`}>
            {page === 'ellipsis' ? (
              <span
                className={`${baseClasses} ${defaultClasses} ${sizeClasses[size].pageButton}`}
                aria-hidden="true"
              >
                ...
              </span>
            ) : (
              <button
                type="button"
                onClick={() => handlePageClick(page)}
                aria-current={page === currentPage ? 'page' : undefined}
                className={`${baseClasses} ${page === currentPage ? activeClasses : defaultClasses} ${sizeClasses[size].pageButton}`}
              >
                {page}
              </button>
            )}
          </li>
        ))}

        {/* Next Button */}
        <li>
          <button
            type="button"
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`${baseClasses} ${defaultClasses} ${sizeClasses[size].button} rounded-r-lg ${currentPage === totalPages ? disabledClasses : ''}`}
            aria-label="Go to next page"
          >
            {nextLabel}
          </button>
        </li>
      </ul>
    </nav>
  );
};
