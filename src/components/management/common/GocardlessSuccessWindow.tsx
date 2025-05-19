const GocardlessSuccessWindow = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md overflow-hidden rounded-lg bg-white p-6 shadow-md">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <svg
              className="mx-auto mb-4 h-16 w-16 text-green-500"
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
          <h2 className="mb-4 text-2xl font-semibold text-gray-700">
            {'Success!'}
          </h2>
          <p className="mb-6 text-gray-600">
            {
              'Your bank account fetching consent has been granted successfully.'
            }
          </p>
          <p className="mb-4 text-gray-600">
            {'Please return to the login page to continue with your account'}
            {'confirmation.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GocardlessSuccessWindow;
