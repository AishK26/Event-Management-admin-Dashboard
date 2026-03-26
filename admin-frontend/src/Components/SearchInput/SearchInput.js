import React from "react";
import { FaSearch } from "react-icons/fa";

const SearchInput = ({ placeholder, onChange, style = {}, className = "" }) => {
  return (
    <div className="mt-6 flex justify-center w-full max-w-4xl md:px-0">
      <div className="relative w-full max-w-xs sm:max-w-md lg:max-w-4xl">
        <input
          type="text"
          placeholder={placeholder}
          style={style}
          className={`p-2 pr-10 rounded-full text-sm sm:text-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800 w-full ${className}`}
          onChange={onChange}
        />
        <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
      </div>
    </div>
  );
};

export default SearchInput;
