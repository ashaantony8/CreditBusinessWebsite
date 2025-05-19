import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';

const PaginationFiledAgent = () => {
  return (
    <>
      <nav
        className="mt-6 flex items-center justify-between py-6 font-light"
        aria-label="Pagination"
      >
        <div className="flex flex-1 justify-between">
          <a
            className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-light text-gray-700 hover:bg-gray-50"
            rel="prev"
            href="/"
          >
            <SlArrowLeft />
            <a className="ml-1 max-sm:hidden">{'Next'}</a>
          </a>
          <div className="flex items-center px-4">
            <a
              href="#"
              className="flex h-10 w-10 items-center justify-center border border-blue-800 bg-blue-200 text-sm font-light text-gray-800 hover:text-white"
            >
              {'1'}
            </a>
            <a
              href="#"
              className="flex h-10 w-10 items-center justify-center text-sm font-light text-gray-800 hover:bg-blue-600 hover:text-white"
            >
              {'2'}
            </a>
            <a
              href="#"
              className="flex h-10 w-10 items-center justify-center text-sm font-light text-gray-800 hover:bg-blue-600 hover:text-white"
            >
              {'3'}
            </a>
            <a
              href="#"
              className="flex h-10 w-10 items-center justify-center text-sm font-light text-gray-800 hover:bg-blue-600 hover:text-white"
            >
              {'4'}
            </a>
            <a
              href="#"
              className="flex h-10 w-10 items-center justify-center text-sm font-light text-gray-800 hover:bg-blue-600 hover:text-white"
            >
              {'5'}
            </a>
          </div>
          <a
            className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-light text-gray-700 hover:bg-gray-50"
            rel="Next"
            href="/"
          >
            <a className="mr-1 max-sm:hidden">{'Previous'}</a>
            <SlArrowRight />
          </a>
        </div>
      </nav>
    </>
  );
};

export default PaginationFiledAgent;
