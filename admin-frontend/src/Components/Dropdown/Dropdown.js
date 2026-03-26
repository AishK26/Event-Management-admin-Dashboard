import React from "react";

const Dropdown = ({
  id,
  name,
  options,
  title,
  handleChange,
  selectedValue,
}) => (
  <div className="w-full p-1">
    <h1 className="text-sm font-medium  text-gray-700 mb-2 block">{title}</h1>
    <select
      id={id}
      name={name}
      onChange={handleChange}
      value={selectedValue}
      className=" m-2 py-2 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-bg-blue-800 focus:border-transparent w-[20]"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export default Dropdown;
