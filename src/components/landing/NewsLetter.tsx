import React, { useEffect, useState } from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import { MdOutlineEmail } from 'react-icons/md';

import news from '../../assets/images/NewsLetter.png';
const NewsLetter: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [hasClosedModal, setHasClosedModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const middleOfPage = document.documentElement.scrollHeight / 1.3;

      if (scrollPosition >= middleOfPage && !hasClosedModal) {
        setShowModal(true);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasClosedModal]);

  const closeModal = () => {
    setShowModal(false);
    setHasClosedModal(true);
  };

  return (
    <div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:h-screen sm:align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div
              className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <button
                onClick={closeModal}
                type="button"
                className="ml-auto flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-400"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
              <div>
                <div className="mx-auto flex items-center justify-center">
                  <img src={news} />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3
                    className="font-Playfair text-[32px] font-semibold leading-6 text-[#02002E]"
                    id="modal-headline"
                  >
                    {'Subscribe Newsletter'}
                  </h3>
                  <div className="mt-2 py-4">
                    <p className="text-sm font-light text-[#555555]">
                      {'Lorem Ipsum is simply dummy text of the printing and'}
                      {
                        "typesetting industry. Lorem Ipsum has been the industry's"
                      }
                    </p>
                  </div>
                </div>
              </div>
              <div className="my-5 px-2 pb-4 sm:my-6">
                <div className="flex items-center justify-center sm:justify-start">
                  <div className="relative w-full">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                      <MdOutlineEmail className="h-5 w-5 text-gray-400" />
                    </span>
                    <input
                      className="text-md w-full appearance-none border-b-2 py-1 pl-8 pr-2 focus:border-b-gray-400 focus:outline-none focus:ring-gray-400"
                      type="search"
                      name="q"
                      placeholder="Email"
                    />
                  </div>

                  <button
                    type="submit"
                    className="ml-2 flex items-center bg-color-text-secondary px-8 py-1.5 text-white hover:bg-blue-800"
                    value="Search"
                    color="blue"
                  >
                    {'SUBMIT'}
                    <IoIosArrowForward className="ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsLetter;
