const GoCardlessStatementCard = ({
  isGocardless,
  data,
  onCategorySelect,
  options,
  isDebit
}) => {
  return (
    <div
      className={`rounded border ${data?.category && data?.category !== '' ? 'border-blue-500' : 'border-gray-200'} mx-4 mb-8`}
    >
      <div className="flex items-center justify-between border border-b-gray-200 p-2">
        <div className="flex items-center gap-2">
          <p className="text-[#929292]">{'SL NO:'}</p>
          <p className="text-black">{data?.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-[#929292]">{'Category:'}</p>
          <select
            value={data.category}
            onChange={e => {
              data.category = e.target.value;
              onCategorySelect(data, isDebit ? 'debit' : 'credit');
            }}
            style={{ background: data.category ? '#EDF3FF' : 'white' }}
            className="text-[12px] text-[#929292] focus:outline-none"
          >
            <option value="">{'select a category'}</option>
            {options.map(i => (
              <option value={i.key}>{i.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="p-2">
        <div className="flex items-center justify-between">
          <div className="mb-2">
            <p className="text-[#929292]">{'REMITTANCE INFO:'}</p>
            {isGocardless ? (
              <p className="text-black">
                {data?.remittanceInformationUnstructured}
              </p>
            ) : (
              <input
                type="text"
                className="border"
                value={data?.remittanceInformationUnstructured}
                onChange={e => {
                  data.remittanceInformationUnstructured = e.target.value;
                  onCategorySelect(data, isDebit ? 'debit' : 'credit');
                }}
              />
            )}
          </div>
          {isGocardless && (
            <div className="mb-2">
              <p className="text-[#929292]">{'TRANSACTION DATE:'}</p>
              <p
                className="text-right"
                style={{ color: isDebit ? 'tomato' : '#22CB53' }}
              >
                {data?.bookingDate}
              </p>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          {isGocardless && (
            <div className="mb-2">
              <p className="text-[#929292]">{'BANK CODE:'}</p>
              <p className="text-black">{data?.bankTransactionCode}</p>
            </div>
          )}
          <div className="mb-2">
            <p className="text-[#929292]">{'AMOUNT:'}</p>
            <p
              className="text-right"
              style={{ color: isDebit ? 'tomato' : '#22CB53' }}
            >
              {isGocardless ? (
                data?.transactionAmount.amount
              ) : (
                <input
                  type="number"
                  className="border"
                  value={data?.transactionAmount.amount}
                  onChange={e => {
                    data.transactionAmount.amount = e.target.value;
                    onCategorySelect(data, isDebit ? 'debit' : 'credit');
                  }}
                />
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoCardlessStatementCard;
