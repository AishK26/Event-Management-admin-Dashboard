import React from "react";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (!isNaN(date)) {
    return date.toLocaleDateString("en-GB");
  }
  return "Invalid Date";
};
const table = ({ label1, label2, label3, label4, data }) => {
  return (
    <div className="w-full max-w-4xl overflow-x-auto  ">
      <table className="min-w-full border border-gray-300 rounded-lg ">
        <thead className="rounded-2xl">
          <tr className="flex justify-between rounded-2xl">
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {label1}
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {label2}
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {label3}
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">
              {label4}
            </th>
          </tr>
        </thead>
        <tbody className="relative">
          {data.length <= 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-4">
                LOADING...
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={index}
                className="flex justify-between relative border border-gray-300 rounded-lg my-5 bg-white"
              >
                <td className="px-6 py-4 text-sm text-gray-500 truncate text-wrap">
                  {item.event_name || "-"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 truncate text-wrap">
                  {item.client_name || "-"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 truncate text-wrap">
                  {formatDate(item.event_date || "-")}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 truncate text-wrap">
                  {formatDate(item.event_name || "-")}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default table;
