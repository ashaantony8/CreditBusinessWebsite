import { useEffect, useState } from 'react';
import { RxCross2 } from 'react-icons/rx';

import {
  businessPartnerGetApi,
  generalLedgerGetApi
} from '../../../../api/financeManagerServices';
import { NotificationType } from '../../../../utils/hooks/toastify/enums';
import useToast from '../../../../utils/hooks/toastify/useToast';
import { GLSelectModalProps } from '../../../../utils/types';

const GLSelectModal: React.FC<GLSelectModalProps> = ({
  selectedCell,
  close,
  getValues,
  update,
  onLoanIdsReceived,
  clearErrors,
  isForTable = true,
  setSelectedGl
}) => {
  const [codeType, setCodeType] = useState('gl');
  const [bpIDs, setBpIds] = useState([]);
  const [glIds, setGlIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBpId, setSelectedBpId] = useState(null); // State to keep track of selected Business Partner
  const { showToast } = useToast();

  const fetchGlIds = async (term = '') => {
    try {
      const response = await generalLedgerGetApi(term);
      if (response.status_code >= 200 && response.status_code < 300) {
        const fetchedGlIds = response.data
          .filter(
            ledger =>
              ledger.gl_code.toLowerCase().includes(term.toLowerCase()) ||
              ledger.gl_name.toLowerCase().includes(term.toLowerCase())
          )
          .map(ledger => ({
            id: ledger.id,
            display: `${ledger.gl_code} - ${ledger.gl_name}`,
            partner_code: ledger.gl_code,
            partner_name: ledger.gl_name
          }));
        setGlIds(fetchedGlIds);
      } else {
        showToast('Failed to fetch General Ledger IDs.', {
          type: NotificationType.Error
        });
      }
    } catch (error) {
      showToast('An error occurred while fetching General Ledger IDs.', {
        type: NotificationType.Error
      });
      console.error('Error during API call:', error);
    }
  };

  const fetchBsIds = async (term = '') => {
    try {
      const response = await businessPartnerGetApi(term);

      if (response.status_code >= 200 && response.status_code < 300) {
        const fetchedBpIds = response.data
          .filter(
            partner =>
              partner.partner_code.toLowerCase().includes(term.toLowerCase()) ||
              partner.partner_name.toLowerCase().includes(term.toLowerCase())
          )
          .map(partner => ({
            id: partner.id,
            display: `${partner.partner_code} - ${partner.partner_name}`,
            partner_code: partner.partner_code,
            partner_name: partner.partner_name,
            type: partner.partner_type.group_name,
            bpId: partner.partner_type.id,
            bpLoanNumber: partner?.loan?.loan_number,
            loanId: partner.loan
              ? partner.loan.customer.loan_details[0].loan_id
              : null
          }));

        setBpIds(fetchedBpIds);

        if (fetchedBpIds.length > 0) {
          setSelectedBpId(fetchedBpIds[0].id); // Set the first BP as selected for demo
          onLoanIdsReceived(fetchedBpIds); // Pass the loan IDs
        }
      } else {
        showToast('Failed to fetch Business Partner IDs.', {
          type: NotificationType.Error
        });
      }
    } catch (error) {
      showToast('An error occurred while fetching Business Partner IDs.', {
        type: NotificationType.Error
      });
      console.error('Error during API call:', error);
    }
  };

  useEffect(() => {
    if (codeType === 'gl') {
      fetchGlIds(searchTerm);
    } else {
      fetchBsIds(searchTerm);
    }
  }, [searchTerm, codeType]);

  const handleClick = item => {
    if (isForTable) {
      const values = getValues('rows');
      const rowIndex = selectedCell.index;

      if (selectedCell.type === 'debit') {
        const updatedRow = {
          ...values[rowIndex],
          [codeType == 'gl' ? 'gl_code' : 'bp_code']: item.id,
          partner_code: item.partner_code,
          partner_name: item.partner_name,
          account_name: item.display,
          isCustomer: !!item.loanId
        };
        update(rowIndex, updatedRow);
      } else {
        const updatedRow = {
          ...values[rowIndex],
          glCodeCredit: item.id
        };
        update(rowIndex, updatedRow);
      }
      clearErrors(`rows.${rowIndex}`);
    } else {
      setSelectedGl(item);
    }
    close();
  };

  const handleBpSelect = bp => {
    setSelectedBpId(bp.id);
    const selectedBpLoanNumber = bpIDs.filter(partner => partner.id === bp.id);
    onLoanIdsReceived(selectedBpLoanNumber); // Pass the loan IDs of the selected BP
  };

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50"
    >
      <div className="relative w-full max-w-[800px] md:h-auto">
        <div className="relative min-h-[70vh] bg-white p-4 shadow">
          <div className="flex gap-2">
            <input
              className="border border-gray-200 p-2"
              placeholder="Search"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <div className="flex items-center gap-1">
              <input
                type="radio"
                id="codeTypeGl"
                name="codeType"
                value="gl"
                checked={codeType === 'gl'}
                className="cursor-pointer"
                onChange={e => setCodeType(e.target.value)}
              />
              <p>{'GL'}</p>
            </div>
            {isForTable && (
              <div className="flex items-center gap-1">
                <input
                  type="radio"
                  id="codeTypeBp"
                  name="codeType"
                  value="bp"
                  className="cursor-pointer"
                  checked={codeType === 'bp'}
                  onChange={e => setCodeType(e.target.value)}
                />
                <p>{'BP'}</p>
              </div>
            )}
          </div>

          {codeType === 'gl' ? (
            <div className="my-4 max-h-[60vh] overflow-auto">
              {glIds.map(i => (
                <p
                  key={i.id}
                  onClick={() => handleClick(i)}
                  className="border-bottom-2 w-full cursor-pointer border p-2 hover:bg-gray-100"
                >
                  {i.display}
                </p>
              ))}
            </div>
          ) : (
            <div className="my-4 max-h-[60vh] overflow-auto">
              {bpIDs.map(i => (
                <div key={i.id}>
                  <p
                    onClick={() => {
                      handleClick(i);
                      handleBpSelect(i);
                    }}
                    className={`border-bottom-2 w-full cursor-pointer border p-2 hover:bg-gray-100 ${selectedBpId === i.id ? 'bg-gray-200' : ''}`} // Highlight selected BP
                  >
                    {i.display}
                  </p>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={close}
            type="button"
            className="absolute right-2 top-2 ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-400"
          >
            <RxCross2 size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GLSelectModal;
