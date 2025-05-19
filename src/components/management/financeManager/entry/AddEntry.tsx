import { yupResolver } from '@hookform/resolvers/yup';
import { FC, useEffect, useState } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { AiOutlineClose } from 'react-icons/ai';
import { BiArrowBack } from 'react-icons/bi';
import { IoMdClose } from 'react-icons/io';
import { PiFilesLight } from 'react-icons/pi';
import { useParams } from 'react-router-dom';

import {
  bulkUploadEntryPostApi,
  entryTypeGetApi,
  financeEntryApi
} from '../../../../api/financeManagerServices';
import { financeEntryDetailApi } from '../../../../api/loanServices';
import { loanFormCommonStyleConstant } from '../../../../utils/constants';
import { formatDate } from '../../../../utils/helpers';
import { NotificationType } from '../../../../utils/hooks/toastify/enums';
import useToast from '../../../../utils/hooks/toastify/useToast';
import { EntrySchema } from '../../../../utils/Schema';
import { AddEntryProps } from '../../../../utils/types';
import DateController from '../../../commonInputs/Date';
import DropdownController from '../../../commonInputs/Dropdown';
import Loader from '../../../Loader';
import TableForm from './TableForm';

export const AddEntry: FC<AddEntryProps> = ({
  setShowLedger,
  selectedEntry
}) => {
  const { entry_id: paramEntryId } = useParams();
  const entry_id = selectedEntry ? selectedEntry : paramEntryId;
  const methods = useForm({
    resolver: yupResolver(EntrySchema),
    defaultValues: {
      rows: Array.from({ length: 2 }, () => ({
        gl_code: null,
        bp_code: null,
        account_name: '',
        transition_type: null,
        amount: null,
        narrative: ''
      }))
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [entryOptions, setEntryOptions] = useState<
    { name: string; id: string }[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    watch,
    handleSubmit,
    control,
    getValues,
    formState: { errors },
    clearErrors,
    reset
  } = methods;
  const { fields, update, append, remove } = useFieldArray({
    control,
    name: 'rows'
  });

  const watchRows = watch('rows');
  const { showToast } = useToast();

  const onSubmit = async data => {
    setIsLoading(true);
    const EntryType =
      entryOptions.find(item => item.name === data.entryType)?.id || '';
    const payload = {
      entry_type: JSON.stringify(EntryType),
      date: formatDate(data.date) || '2024-09-23',
      entry_records: watchRows
        .map(row => {
          const record = {
            type: row.transition_type,
            amount: row.amount,
            narration: row.narrative || '',
            loan: row.loanId || null,
            loan_entry_type: row.loan_entry_type || null
          };

          const cleanedRecord = Object.fromEntries(
            Object.entries(record).filter(([, value]) => value !== null)
          );

          if (row.gl_code) {
            cleanedRecord['gl_account'] = row.gl_code;
          }
          if (row.bp_code) {
            cleanedRecord['bp_account'] = row.bp_code;
          }

          return cleanedRecord;
        })
        .filter(record => record.amount !== null)
    };

    try {
      const response = await financeEntryApi(payload);
      if (response.status_code >= 200 && response.status_code < 300) {
        reset();
        showToast(response.status_message, { type: NotificationType.Success });
      } else {
        showToast(response.status_message, { type: NotificationType.Error });
      }
    } catch (error) {
      console.log('Exception', error);
      showToast('something wrong!', { type: NotificationType.Error });
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  };

  const fetchEntryTypes = async () => {
    try {
      const response = await entryTypeGetApi();
      if (response.status_code >= 200 && response.status_code < 300) {
        // const names = response.data.map((entry) => entry.name);
        setEntryOptions(response.data);
      }
    } catch (error) {
      console.error('Error fetching entry types:', error);
    }
  };

  useEffect(() => {
    fetchEntryTypes();
  }, []);

  useEffect(() => {
    console.log(errors, 'errors');
  }, [errors]);

  const onAddNewRow = () => {
    append({
      gl_code: null,
      bp_code: null,
      account_name: '',
      transition_type: null,
      amount: null,
      narrative: watchRows[0].narrative
    });
  };

  const onRemoveLastRow = () => {
    if (fields.length > 2) {
      remove(fields.length - 1);
    }
  };

  const financeEntryDetail = async (id: string) => {
    try {
      const { data, status_code } = await financeEntryDetailApi(id);

      if (status_code < 200 || status_code >= 300) return;

      const rows = data.entry_records
        .map(
          ({
            type,
            amount,
            narration,
            loan,
            loan_entry_type,
            gl_code,
            bp_code,
            gl_account,
            bp_account
          }) => {
            if (amount === null) return null;
            const record = {
              transition_type: type,
              amount: parseInt(amount, 10),
              narrative: narration || '',
              loanId: loan || null,
              isCustomer: Boolean(loan),
              loan_entry_type: loan_entry_type || null,
              gl_account: gl_code || undefined,
              bp_account: bp_code || undefined,
              bp_code: bp_account?.id || null,
              gl_code: gl_account?.id || null,
              partner_code:
                bp_account?.partner_code || gl_account?.gl_code || null,
              partner_name:
                bp_account?.partner_name || gl_account?.gl_name || null,
              account_name: bp_account
                ? `${bp_account.partner_code} - ${bp_account.partner_name}`
                : gl_account
                  ? `${gl_account.gl_code} - ${gl_account.gl_name}`
                  : null
            };

            return record;
          }
        )
        .filter(Boolean);
      reset({
        date: data.date,
        entryType: entryOptions.filter(item => item.id === data.entry_type)[0]
          .name,
        rows
      });
    } catch (error) {
      console.error('Error fetching entry:', error);
      showToast('Something went wrong!', { type: NotificationType.Error });
    }
  };

  useEffect(() => {
    if (entry_id && entryOptions.length > 0) {
      financeEntryDetail(entry_id);
    }
  }, [entry_id, entryOptions]);

  const BulkUpload = () => {
    const [bulkUploadErrors, setBulkUploadErrors] = useState({ file: '' });
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileUpload = event => {
      const file = event.target.files[0];

      // Reset errors
      setBulkUploadErrors({ file: '' });

      if (!file) {
        setBulkUploadErrors({ file: 'File is required.' });
        return;
      }

      // Validate file type for CSV and XLSX
      const validFileTypes = [
        'text/csv',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      if (!validFileTypes.includes(file.type)) {
        setBulkUploadErrors({
          file: 'Please upload a valid CSV or XLSX file.'
        });
        return;
      }

      // Validate file size (max 2MB)
      const maxFileSize = 2 * 1024 * 1024;
      if (file.size > maxFileSize) {
        setBulkUploadErrors({ file: 'File size should not exceed 2MB.' });
        return;
      }

      setUploadedFiles([...uploadedFiles, file]);
      setBulkUploadErrors({ file: '' });
    };

    const handleClose = fileName => {
      setUploadedFiles(uploadedFiles.filter(file => file.name !== fileName));
    };

    const handleSubmit = async () => {
      setIsSubmitting(true);
      setIsLoading(true);

      if (uploadedFiles.length === 0) {
        setBulkUploadErrors({
          file: 'Please upload at least one CSV or XLSX file.'
        });
        setIsSubmitting(false);
        return;
      }

      try {
        const formData = new FormData();
        formData.append('file', uploadedFiles[0]);
        const response = await bulkUploadEntryPostApi(formData);
        if (response && response.status_code === 200) {
          setIsModalOpen(false);
          showToast(response.status_message, {
            type: NotificationType.Success
          });
        } else {
          showToast(response.status_message, { type: NotificationType.Error });
        }
      } catch (error) {
        console.log('Exception', error);
        showToast('Something went wrong!', { type: NotificationType.Error });
      } finally {
        setTimeout(() => {
          setIsSubmitting(false);
          setIsLoading(false);
        }, 1500);
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50">
        <div className="relative w-[600px] rounded-lg bg-white p-10 shadow-lg">
          <h2 className="mb-6 text-2xl font-bold">{'Bulk Upload Entry'}</h2>

          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="absolute right-4 top-4 p-2 text-gray-500 hover:text-gray-700"
          >
            <AiOutlineClose size={28} />
          </button>

          {uploadedFiles.length > 0 ? (
            <div className="space-y-4">
              {uploadedFiles.map(file => (
                <span key={file.name} className="flex items-center gap-2">
                  <PiFilesLight
                    size={28}
                    color={bulkUploadErrors?.file ? '#F44336' : '#00CC08'}
                  />
                  <span
                    className={
                      bulkUploadErrors?.file ? 'text-red-500' : 'text-[#00CC08]'
                    }
                  >
                    {file.name}
                  </span>
                  <button onClick={() => handleClose(file.name)}>
                    <IoMdClose color="#000000" className="font-medium" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <div
              className={`flex w-full items-center justify-center ${
                bulkUploadErrors?.file ? 'border-red-500' : ''
              }`}
            >
              <label
                className={`flex h-40 w-full flex-col border-2 border-dashed border-[#B7B7B7] ${
                  bulkUploadErrors?.file ? 'border-red-500' : ''
                }`}
              >
                <div className="flex flex-col items-center justify-center pt-7">
                  <input
                    type="file"
                    accept=".csv, .xlsx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex cursor-pointer flex-col items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-10 w-10 ${
                        bulkUploadErrors?.file
                          ? 'text-red-500'
                          : 'text-[#1A439A]'
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                      {bulkUploadErrors?.file ||
                        'Drag and drop your CSV or XLSX file here'}
                    </p>
                  </label>
                  <p
                    className={`text-[14px] ${
                      bulkUploadErrors?.file ? 'text-red-500' : 'text-[#1A439A]'
                    } max-sm:text-[12px]`}
                  >
                    {'Upload CSV or XLSX File'}
                  </p>
                </div>
              </label>
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="mt-6 rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
          >
            {isSubmitting ? 'Uploading...' : 'Submit'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full w-full flex-col">
      {entry_id && (
        <div
          onClick={() => setShowLedger(true)}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-200"
        >
          <BiArrowBack className="text-lg" />
        </div>
      )}
      <FormProvider {...methods}>
        {isLoading && (
          <div
            aria-hidden="true"
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50"
          >
            <Loader />
          </div>
        )}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex h-full w-full flex-col"
        >
          <div className="sticky top-0 z-20 flex flex-wrap justify-between gap-4 bg-white p-4">
            <div className="flex items-center gap-4">
              <p className="pr-4 text-[20px] font-semibold text-[#000000] max-sm:text-[18px]">
                {'Entry'}
              </p>

              <DropdownController
                metaData={{
                  fieldClass: `peer bg-transparent h-12 w-full text-black placeholder-transparent focus:outline-none focus:border-gray-500 border border-stone-300 px-2`,
                  labelClass: `${loanFormCommonStyleConstant.dropdown.labelClass}`,
                  key: 'entryType',
                  placeholder: 'Entry Type',
                  isRequired: true,
                  name: `entryType`,
                  label: 'Entry Type',
                  type: 'dropdown',
                  options: entryOptions?.map(item => item.name),
                  isDisabled: !!entry_id
                }}
              />
              <DateController
                metaData={{
                  fieldClass:
                    'peer bg-transparent h-12 w-full text-black placeholder-transparent px-8 focus:outline-none focus:border-gray-500 border border-stone-200',
                  labelClass: loanFormCommonStyleConstant.date.labelClass,
                  defaultValue: `${new Date()}`,
                  placeholder: 'Date',
                  isRequired: true,
                  name: 'date',
                  label: 'Date',
                  type: 'date',
                  isDisabled: !!entry_id
                }}
              />
            </div>
            <div>
              <button
                type="button"
                className="rounded bg-blue-500 px-4 py-2 text-white"
                onClick={() => setIsModalOpen(true)}
              >
                {'Bulk Upload'}
              </button>
            </div>
          </div>

          {/* Scrollable Table Section */}
          <div className="flex-grow overflow-y-auto p-4">
            <TableForm
              isDetailsView={!!entry_id}
              update={update}
              control={control}
              fields={fields}
              watchRows={watchRows}
              getValues={getValues}
              errors={errors}
              setIsSubmitDisabled={setIsSubmitDisabled}
              clearErrors={clearErrors}
            />
          </div>
          {!entry_id && (
            <div>
              <button
                type="button"
                onClick={onAddNewRow}
                className="mr-4 mt-4 rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-300"
              >
                {'Add Row'}
              </button>
              <button
                type="button"
                onClick={onRemoveLastRow}
                className="mr-4 mt-4 rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-300"
              >
                {'Remove Last Row'}
              </button>
              <button
                type="submit"
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitDisabled}
                className={`mt-4 rounded px-4 py-2 ${
                  isSubmitDisabled
                    ? 'cursor-not-allowed bg-gray-400 text-gray-700'
                    : 'cursor-pointer bg-blue-900 text-white hover:bg-blue-800'
                }`}
              >
                {'Submit'}
              </button>
            </div>
          )}
          {isModalOpen && <BulkUpload />}
        </form>
      </FormProvider>
    </div>
  );
};
