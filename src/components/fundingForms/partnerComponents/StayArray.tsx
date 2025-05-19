import addressbook from '../../../assets/svg/address-book.svg';
import city from '../../../assets/svg/la_city.svg';
import pin from '../../../assets/svg/pin.svg';
import date from '../../../assets/svg/system-uicons_calendar-date.svg';

export const getStayArray = (
  partnerType,
  currentDirectorIndex,
  currentStayIndex
) => {
  return [
    {
      type: 'number',
      name: `${partnerType}[${currentDirectorIndex}].stay[${currentStayIndex}].pincode`,
      placeholder: 'Postcode',
      icon: () => {
        return (
          <div>
            <img src={pin} className="h-4 w-4 rtl:rotate-[270deg]" />
          </div>
        );
      }
    },
    {
      type: 'textarea',
      name: `${partnerType}[${currentDirectorIndex}].stay[${currentStayIndex}].address`,
      rows: 3,
      isDisabled: true,
      placeholder: 'Address',
      icon: () => {
        return (
          <div>
            <img src={addressbook} className="h-4 w-4 rtl:rotate-[270deg]" />
          </div>
        );
      }
    },
    {
      type: 'dropdown',
      name: `${partnerType}[${currentDirectorIndex}].stay[${currentStayIndex}].house_ownership`,
      options: ['Owned', 'Tenant', 'Family Owned', 'Spouse Owned'],
      placeholder: 'House Ownership',
      icon: () => {
        return (
          <div className="w-7 pr-2 text-gray-400">
            <img src={city} />
          </div>
        );
      }
    },
    {
      type: 'date',
      icon: () => {
        return (
          <div className="w-[26px] pr-2 text-gray-400">
            <img src={date} />
          </div>
        );
      },
      name: `${partnerType}[${currentDirectorIndex}].stay[${currentStayIndex}].start_date`,
      placeholder: 'Enter the start date'
    },
    {
      type: 'date',
      icon: () => {
        return (
          <div className="w-[26px] pr-2 text-gray-400">
            <img src={date} />
          </div>
        );
      },
      name: `${partnerType}[${currentDirectorIndex}].stay[${currentStayIndex}].end_date`,
      placeholder: 'End date'
    }
  ];
};
