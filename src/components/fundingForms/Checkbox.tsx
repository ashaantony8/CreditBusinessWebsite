export const checkdata = [
  {
    label:
      'hereby agree to authorize Representative name to collect the data and submit the application.'
  },

  {
    label:
      'I also Agree that there is no pending. threatened or recently field CCJ claims against me or my partners or guarantors. Iam also in no intention of selling the business/transferring my shares in the next 12 months. I have never been filed with a Bankruptcy or involuntary Arrangement by previous credits..'
  }
];

const LoanCheck = () => {
  return (
    <>
      {checkdata.map(item => (
        <div className="my-4 flex items-center pl-4">
          <input
            id="link-checkbox"
            type="checkbox"
            value=""
            className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
          />
          <label className="ms-2 text-[9.7px] font-medium text-gray-300">
            {item.label}
          </label>
        </div>
      ))}
    </>
  );
};

export default LoanCheck;
