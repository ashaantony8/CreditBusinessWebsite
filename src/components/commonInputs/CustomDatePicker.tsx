import 'react-datepicker/dist/react-datepicker.css';

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';

import { CustomDatePickerProps } from '../../utils/types'; // Import the type definition

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ metaData }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <div>
      <label htmlFor={metaData.name}>{metaData.label}</label>
      <DatePicker
        selected={selectedDate}
        onChange={date => setSelectedDate(date as Date)} // Ensure the type is Date
      />
    </div>
  );
};

export default CustomDatePicker;
