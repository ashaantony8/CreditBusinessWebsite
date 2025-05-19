import dayjs from 'dayjs';

import { fieldClass, labelClass } from '../../../utils/constants';
import { failedMandatesTablehead } from '../../../utils/data';
import DateController from '../../commonInputs/Date';
import InputController from '../../commonInputs/Input';

const FailedMandatesTableView = ({
  //   sortOrder = 'asc',
  list
}) => {
  return (
    <table className="min-w-full divide-y divide-gray-200 overflow-x-auto border max-md:hidden">
      <thead className="bg-[#D3D3D3]">
        <tr>
          {failedMandatesTablehead.map(({ name }, index) => (
            <th
              key={index}
              className="cursor-pointer px-6 py-4 text-left text-[12px] font-semibold uppercase text-[#000000]"
              // onClick={() => handleSortColumn(key)}
            >
              {name}
              {/* {key === 'id' && (sortOrder === 'asc' ? '▲' : '▼')} */}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {list?.length > 0 ? (
          list.map(({ date, amount, status, loan_number }, index) => (
            <tr
              key={index}
              className="text-[12px] font-medium text-[#000000] hover:bg-gray-200 max-sm:text-[10px]"
            >
              <td className="whitespace-nowrap px-6 py-4">{index + 1}</td>

              <td className="whitespace-nowrap px-6 py-4">{loan_number}</td>
              <td className="whitespace-nowrap px-6 py-4">
                {dayjs(date).format('DD-MM-YY')}
              </td>
              <td className="whitespace-nowrap px-6 py-4">{amount}</td>
              <td className="whitespace-nowrap px-6 py-4">{status}</td>
              <td className="whitespace-nowrap px-6 py-4">
                <DateController
                  metaData={{
                    fieldClass: fieldClass,
                    labelClass: labelClass,
                    placeholder: 'Received date',
                    isRequired: true,
                    name: `failed_mandates[${index}].${'received_date'}`,
                    type: 'date',
                    min: new Date()
                  }}
                />
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <InputController
                  metaData={{
                    fieldClass,
                    labelClass,
                    placeholder: 'Received Amount',
                    isRequired: true,
                    name: `failed_mandates[${index}].${'received_amount'}`,
                    type: 'number'
                  }}
                />
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={failedMandatesTablehead.length}
              className="px-6 py-4 text-center"
            >
              {'No data available'}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default FailedMandatesTableView;
