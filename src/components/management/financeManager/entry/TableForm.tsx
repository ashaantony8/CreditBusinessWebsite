import { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';

import { loanFormCommonStyleConstant } from '../../../../utils/constants';
import { TableFormProps } from '../../../../utils/types';
import DropdownController from '../../../commonInputs/Dropdown';
import GLSelectModal from './GLSelectModal';

const TableForm: React.FC<TableFormProps> = ({
  control,
  watchRows,
  fields,
  getValues,
  update,
  isDetailsView,
  errors,
  setIsSubmitDisabled,
  clearErrors
}) => {
  const [totalDebitedAmount, setTotalDebitedAmount] = useState(0);
  const [totalCreditedAmount, setTotalCreditedAmount] = useState(0);
  const [selectedCell, setSelectedCell] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [firstNarrativeFilled, setFirstNarrativeFilled] = useState(false);
  // const [_, setSelectedRowIndex] = useState(null);

  const handleGLClick = (type, index) => {
    if (isDetailsView) return;
    console.log(`GL/${type} clicked for row ${index}`);
    setSelectedCell({ type: type, index: index });
    // setSelectedRowIndex(index);
  };

  useEffect(() => {
    const totDeb = calculateTotalAmount(watchRows, 'debit');
    const totCred = calculateTotalAmount(watchRows, 'credit');
    setTotalDebitedAmount(totDeb);
    setTotalCreditedAmount(totCred);
  }, [
    watchRows?.map(field => field.amount).join(','),
    watchRows?.map(field => field.transition_type).join()
  ]);

  useEffect(() => {
    if (selectedCell) setShowModal(true);
  }, [selectedCell]);

  const applyNarationToAllRows = () => {
    const narratives = watchRows?.map(field => field.narrative);
    const firstNonEmptyNarrativeIndex = narratives?.findIndex(
      narrative => narrative !== '' && narrative !== null
    );

    if (!firstNarrativeFilled && firstNonEmptyNarrativeIndex !== -1) {
      const firstNarrative = narratives[firstNonEmptyNarrativeIndex];
      setFirstNarrativeFilled(true);
      fields.forEach((field, index) => {
        if (
          index !== firstNonEmptyNarrativeIndex &&
          !watchRows[index].narrative
        ) {
          console.log(field, 'field');
          watchRows?.forEach((element, i) => {
            update(i, { ...element, narrative: firstNarrative });
          });
        }
      });
      watchRows?.forEach((_, index) => {
        clearErrors(`rows[${index}].narrative`);
      });
    }
  };

  const calculateTotalAmount = (arr, type) =>
    Math.ceil(
      arr?.reduce((total, row) => {
        const amount = parseFloat(row.amount); // Use parseFloat for fractional amounts
        return row.transition_type === type && !isNaN(amount)
          ? total + amount
          : total;
      }, 0) * 100 // Multiply by 100 to round up at two decimal places
    ) / 100 || 0;

  const [loanIdsFromModal, setLoanIdsFromModal] = useState<
    { loanNumber: string; id: string }[]
  >([]);

  const handleLoanIdsReceived = fetchedBpIds => {
    setLoanIdsFromModal(
      fetchedBpIds
        .map(bp => ({
          loanNumber: bp.bpLoanNumber || null,
          id: bp.loanId || null
        }))
        .filter(id => id !== null)
    );
  };

  useEffect(() => {
    if (!isDetailsView) {
      const isDisabled =
        totalCreditedAmount !== totalDebitedAmount ||
        totalCreditedAmount === 0 ||
        totalDebitedAmount === 0;
      setIsSubmitDisabled(isDisabled);
    }
  }, [totalCreditedAmount, totalDebitedAmount]);

  useEffect(() => {
    if (isDetailsView) {
      setLoanIdsFromModal([
        { loanNumber: '123', id: 'ccc78800-8199-4de8-b211-93658905204d' }
      ]);
    }
  }, [isDetailsView]);

  return (
    <>
      <div className="pt-4">
        <div>
          <div className="overflow-auto" style={{ height: '65vh' }}>
            <table className="relative min-w-full table-auto border-collapse border border-gray-200">
              <thead className="sticky top-0 z-10 bg-gray-100">
                <tr>
                  <th className="w-[5%] border border-gray-300 px-4 py-2">
                    {'Sl No'}
                  </th>
                  <th className="w-[8%] border border-gray-300 px-4 py-2">
                    {'GL/BP Acct'}
                  </th>
                  <th className="w-[8%] border border-gray-300 px-4 py-2">
                    {'Account Name'}
                  </th>
                  <th className="w-[200px] border border-gray-300 px-4 py-2">
                    {'Loan Number'}
                  </th>
                  <th className="w-[200px] border border-gray-300 px-4 py-2">
                    {'Credited to'}
                  </th>
                  <th className="w-[200px] border border-gray-300 px-4 py-2">
                    {'Type'}
                  </th>
                  <th className="w-[200px] border border-gray-300 px-4 py-2">
                    {'Amount'}
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    {'Narrative'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {fields.map((item, index) => (
                  <tr key={item.id}>
                    <td className="w-[5%] border border-gray-300 px-4 py-2 text-center">
                      {index + 1}
                    </td>
                    <td
                      className={`w-[8%] border border-gray-300 px-4 py-2 text-center ${!isDetailsView ? 'cursor-pointer' : ''}`}
                      onClick={
                        !isDetailsView
                          ? () => handleGLClick('debit', index)
                          : undefined
                      }
                    >
                      {item.partner_code}
                      {errors?.rows?.[index] && (
                        <div className="text-red-500">
                          {errors.rows[index].message}
                        </div>
                      )}
                    </td>
                    <td className="w-[14%] border border-gray-300 px-4 py-2 text-center">
                      {item.partner_name}
                    </td>
                    <td
                      className={`w-[14%] border border-gray-300 p-0 text-center ${!isDetailsView && getValues(`rows.${index}.isCustomer`) ? 'cursor-pointer' : ''}`}
                    >
                      {getValues(`rows.${index}.isCustomer`) && (
                        <div className="relative rounded-lg bg-white">
                          <Controller
                            name={`rows.${index}.loanId`}
                            control={control}
                            render={({ field }) => (
                              <div className="relative bg-inherit">
                                <select
                                  {...field}
                                  id={`rows.${index}.loanId`}
                                  className="h-12 w-full border-none focus:outline-none"
                                  onChange={e => field.onChange(e.target.value)}
                                  style={{ paddingLeft: '2rem' }}
                                  disabled={isDetailsView}
                                >
                                  <option key={`rows.${index}.loanId`}>
                                    {'Select'}
                                  </option>
                                  {loanIdsFromModal?.map(item => (
                                    <option
                                      key={item.loanNumber}
                                      value={item.id}
                                    >
                                      {item.loanNumber}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}
                          />
                        </div>
                      )}
                    </td>
                    <td
                      className={`w-[14%] border border-gray-300 p-0 text-center ${!isDetailsView && getValues(`rows.${index}.isCustomer`) ? 'cursor-pointer' : ''}`}
                    >
                      {getValues(`rows.${index}.isCustomer`) && (
                        <DropdownController
                          metaData={{
                            fieldClass: `focus:outline-none w-full h-12 border-none`,
                            labelClass:
                              loanFormCommonStyleConstant.dropdown.labelClass,
                            isRequired: true,
                            name: `rows.${index}.loan_entry_type`,
                            type: 'dropdown',
                            options: ['Interest', 'Principle', 'Fine'],
                            hideLabel: true,
                            isDisabled:
                              isDetailsView ||
                              !getValues(`rows.${index}.isCustomer`)
                          }}
                        />
                      )}
                    </td>
                    <td
                      className={`relative h-full w-[14%] border border-gray-300 p-0 ${!isDetailsView && getValues(`rows.${index}.isCustomer`) ? 'cursor-pointer' : ''}`}
                    >
                      <DropdownController
                        metaData={{
                          fieldClass: `focus:outline-none w-full h-12 border-none`,
                          labelClass:
                            loanFormCommonStyleConstant.dropdown.labelClass,
                          isRequired: true,
                          name: `rows.${index}.transition_type`,
                          type: 'dropdown',
                          options: ['debit', 'credit'],
                          hideLabel: true,
                          isDisabled:
                            isDetailsView ||
                            !getValues(`rows.${index}.partner_code`)
                        }}
                      />
                    </td>
                    <td className="h-full w-[14%] border border-gray-300 p-0">
                      <Controller
                        name={`rows.${index}.amount`}
                        control={control}
                        defaultValue={item.amount}
                        render={({ field, fieldState }) => (
                          <div>
                            <input
                              disabled={
                                isDetailsView ||
                                !getValues(`rows.${index}.transition_type`)
                              }
                              type="number"
                              {...field}
                              className="no-spinner h-12 w-full appearance-none border-none p-2 focus:outline-none"
                              min="0"
                              step="0.01"
                            />
                            {fieldState.error && (
                              <span className="text-sm text-red-500">
                                {fieldState.error.message}
                              </span>
                            )}
                          </div>
                        )}
                      />
                    </td>
                    <td className="h-full border border-gray-300 p-0">
                      <Controller
                        name={`rows.${index}.narrative`}
                        control={control}
                        defaultValue={item.narrative}
                        render={({ field, fieldState }) => (
                          <div>
                            <input
                              disabled={isDetailsView}
                              type="text"
                              {...field}
                              className="h-12 w-full appearance-none border-none p-2 focus:outline-none"
                              onKeyPress={event => {
                                if (event.key === 'Enter') {
                                  // Code to execute on Enter key press
                                  applyNarationToAllRows();
                                }
                              }}
                            />
                            {fieldState.error && (
                              <span className="text-sm text-red-500">
                                {fieldState.error.message}
                              </span>
                            )}
                          </div>
                        )}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td
                    colSpan={6}
                    className="border border-gray-300 px-4 py-2 text-right font-bold"
                  >
                    {'Total Debit'}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-right font-bold">
                    {totalDebitedAmount}
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan={6}
                    className="border border-gray-300 px-4 py-2 text-right font-bold"
                  >
                    {'Total Credit'}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-right font-bold">
                    {totalCreditedAmount}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {showModal && (
          <GLSelectModal
            update={update}
            getValues={getValues}
            selectedCell={selectedCell}
            close={() => {
              setShowModal(false);
              setSelectedCell(null);
            }}
            onLoanIdsReceived={handleLoanIdsReceived}
            clearErrors={clearErrors}
          />
        )}
      </div>
    </>
  );
};

export default TableForm;
