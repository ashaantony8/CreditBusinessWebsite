const InstantPayFailed = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md overflow-hidden rounded-lg bg-white p-6 shadow-md">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg
                className="h-6 w-6 text-red-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
          <h2 className="mb-4 text-2xl font-semibold text-gray-700">
            {'Payment Failed'}
          </h2>
          <p className="mb-6 text-gray-600">
            {'Your payment could not be processed. Please try again.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InstantPayFailed;
