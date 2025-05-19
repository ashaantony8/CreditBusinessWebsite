const InstantPayPending = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md overflow-hidden rounded-lg bg-white p-6 shadow-md">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg
                className="h-6 w-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2l4-4m6 2a9 9 0 11-18 0a9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          <h2 className="mb-4 text-2xl font-semibold text-gray-700">
            {'Payment Pending'}
          </h2>
          <p className="mb-6 text-gray-600">
            {
              'Your payment is currently processing. We will notify you once it is'
            }
            {'completed.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InstantPayPending;
