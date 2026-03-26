import React from "react";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";

const DatePickerInput = ({
  label,
  selectedDate,
  onDateChange,
  dateFormat,
  placeholder,
  required,
  style = {},
  className,
}) => {
  return (
    <div className="w-full p-2">
      {label && (
        <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 block">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative w-full">
        <DatePicker
          selected={selectedDate}
          onChange={onDateChange}
          dateFormat={dateFormat || "dd-MM-yyyy"}
          placeholderText={placeholder || "DD-MM-YYYY"}
          className={`w-full py-2 px-3 left-5 sm:py-2.5 sm:px-7 border border-black rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent ${className}`}
          style={{ ...style, height: "2.5rem", sm: { height: "3rem" } }}
          required={required}
        />
        <FaCalendarAlt className="absolute left-2 top-1/2 transform -translate-y-1/2 text-sm sm:text-base text-gray-500 pointer-events-none" />
      </div>
    </div>
  );
};

export default DatePickerInput;
