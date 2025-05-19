import { useEffect, useState } from 'react';
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';

const Pagination = ({
  currentPage,
  totalPages,
  goToNextPage,
  goToPrevPage,
  goToPage
}) => {
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage, endPage;

    if (totalPages <= maxPagesToShow) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (selectedPage <= Math.ceil(maxPagesToShow / 2)) {
        startPage = 1;
        endPage = maxPagesToShow;
      } else if (selectedPage + Math.floor(maxPagesToShow / 2) >= totalPages) {
        startPage = totalPages - maxPagesToShow + 1;
        endPage = totalPages;
      } else {
        startPage = selectedPage - Math.floor(maxPagesToShow / 2);
        endPage = selectedPage + Math.ceil(maxPagesToShow / 2) - 1;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`h-10 w-10 font-light text-gray-800 ${
            selectedPage === i
              ? 'bg-blue-200 text-white'
              : 'hover:bg-blue-100 hover:text-white'
          } flex items-center justify-center text-sm`}
          onClick={() => {
            setSelectedPage(i);
            goToPage(i);
          }}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  const [selectedPage, setSelectedPage] = useState(1);

  useEffect(() => {
    setSelectedPage(currentPage || 1);
  }, [currentPage]);

  return (
    <nav
      className="sticky top-[100vh] flex items-center justify-between bg-white px-4 font-light"
      aria-label="Pagination"
    >
      <div className="flex flex-1 justify-between">
        <button
          className={`relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-light text-gray-700 ${
            selectedPage === 1 ? 'cursor-not-allowed' : 'cursor-pointer'
          }`}
          onClick={() => {
            if (selectedPage > 1) {
              setSelectedPage(selectedPage - 1);
              goToPrevPage(selectedPage - 1);
            }
          }}
          disabled={selectedPage === 1}
        >
          <SlArrowLeft />
          <span className="ml-1">{'Previous'}</span>
        </button>
        <div className="flex items-center px-4">{renderPageNumbers()}</div>
        <button
          className={`relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-light text-gray-700 ${
            selectedPage === totalPages
              ? 'cursor-not-allowed'
              : 'cursor-pointer'
          }`}
          onClick={() => {
            if (selectedPage < totalPages) {
              setSelectedPage(selectedPage + 1);
              goToNextPage(selectedPage + 1);
            }
          }}
          disabled={selectedPage === totalPages}
        >
          <span className="mr-1">{'Next'}</span>
          <SlArrowRight />
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
