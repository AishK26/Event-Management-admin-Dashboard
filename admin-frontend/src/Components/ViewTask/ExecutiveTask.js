import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Importing DatePicker styles
import axios from "axios";
import SearchInput from "../SearchInput/SearchInput";

const ExecutiveTask = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 4;

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          "https://demo.internsbee.in/api/tasks"
        );
        // Filter tasks to include only those with an executive_id
        const filteredTasks = response.data.result.filter(
          (task) => task.assign_details && task.assign_details.executive_id
        )
        .reverse(); // Reverse the array to get the new tasks at the top
      
        setTasks(filteredTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

 // Filter tasks based on search term and date range
const filteredTasks = tasks.filter((task) => {
  const taskDate = new Date(task.start_date); // Adjust if task date is stored differently
  
  // Check if the task date is within the range
  const isDateInRange =
    (!startDate || taskDate >= startDate) &&
    (!endDate || taskDate <= endDate);

  // Convert search term to lowercase for case-insensitive comparison
  const lowerSearchTerm = searchTerm.toLowerCase();

  // Check if the search term matches task_Title or executive_id.fullname
  const isSearchMatch = task.task_Title?.toLowerCase().includes(lowerSearchTerm) || 
                        task.assign_details?.executive_id?.fullname?.toLowerCase().includes(lowerSearchTerm);

  return isDateInRange && isSearchMatch;
});

  const totalPages = Math.ceil(filteredTasks.length / entriesPerPage);

  // Slice the filteredTasks based on the current page
  const indexOfFirstTask = (currentPage - 1) * entriesPerPage;
  const paginatedTasks = filteredTasks.slice(
    indexOfFirstTask,
    indexOfFirstTask + entriesPerPage
  );

  return (
    <div className="w-full px-4 vendor-content">
      <div className="flex justify-center items-center w-full mb-6">
        <h2 className="text-4xl font-bold text-black mx-3">Executive Task</h2>
      </div>

      <div className="flex gap-5 flex-col justify-between w-full md:flex-row">
        <div className="mt-3 w-full md:w-96">
          <SearchInput
            placeholder="Search by task title"
            onChange={handleSearchChange}
            className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
          />
        </div>
        <div className="flex items-center justify-center gap-4">
          <div className="w-full max-w-xs">
            <label className="block text-lg font-medium text-gray-800 mb-2">
              From
            </label>
            <div className="relative w-full max-w-md">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="dd-MM-yyyy"
                placeholderText="DD-MM-YY"
                className="w-full py-2 pl-10 pr-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-bg-blue-800"
              />
              <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>

          <div className="w-full max-w-xs">
            <label className="block text-lg font-medium text-gray-800 mb-2">
              To
            </label>
            <div className="relative w-full">
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="dd-MM-yyyy"
                placeholderText="DD-MM-YY"
                className="w-full py-2 pl-10 pr-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-bg-blue-800"
              />
              <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto w-full mt-4 cursor-pointer">
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="rounded-2xl">
            <tr className="flex justify-between relative border border-gray-300 rounded-lg mb-1 bg-white w-full">
              <th className="px-6 w-12 py-2 text-left text-bold text-black uppercase tracking-wider">
                Sr.No.
              </th>
              <th className="px-6 w-48  py-2 text-left text-bold text-black uppercase tracking-wider">
                Executive Name
              </th>
              <th className="px-6 w-48  py-2 text-left text-bold text-black uppercase tracking-wider">
                Task Title
              </th>
              <th className="px-6 w-48  py-2 text-left text-bold text-black uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 w-48  py-2 text-left text-bold text-black uppercase tracking-wider">
                Start Date
              </th>
              <th className="px-6 w-48  py-2 text-left text-bold text-black uppercase tracking-wider">
                End Date
              </th>
              <th className="px-6 w-48  py-2 text-left text-bold text-black uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedTasks.length > 0 ? (
              paginatedTasks.map((task, index) => (
                <tr
                  key={index}
                  className="flex relative justify-between w-full border border-gray-300 rounded-lg mb-1 bg-white hover:bg-blue-300 hover:scale-[1.02] hover:-translate-y-1 hover:border-blue-400 transition-all duration-300"
                >
                  <td className="px-6 w-12 py-2 text-left text-2xs font-medium text-black tracking-wider">
                    {indexOfFirstTask + index + 1}
                  </td>
                  <td className="px-6 w-48  py-2 text-left text-2xs font-medium text-black tracking-wider">
                    {task.assign_details.executive_id?.fullname}
                  </td>
                  <td className="px-6 w-48  py-2 text-left text-2xs font-medium text-black tracking-wider">
                  <span title={task.task_Title}>
                      {(task.task_Title || task.task_Title)?.length > 20
                        ? (task.task_Title || task.task_Title).slice(0, 20) +
                          "..."
                        : task.task_Title || task.task_Title}
                    </span>
                  </td>
                  <td className="px-6 w-48  py-2 text-left text-2xs font-medium text-black tracking-wider">
                    <span title={task.description}>
                      {(task.description || task.description)?.length > 15
                        ? (task.description || task.description).slice(0, 15) +
                          "..."
                        : task.description || task.description}
                    </span>
                  </td>
                  <td className="px-6 w-48  py-2 text-left text-2xs font-medium text-black tracking-wider">
                    {new Date(task.start_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 w-48  py-2 text-left text-2xs font-medium text-black tracking-wider">
                    {new Date(task.end_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 w-48  py-2 text-left text-2xs font-medium text-black tracking-wider">
                    {task.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-2 text-center text-2xs font-medium text-black tracking-wider"
                >
                  No tasks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="pagination flex justify-center items-center mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            <FaChevronLeft />
          </button>
          <div className="pagination-info mx-2">
            {currentPage} of {totalPages}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveTask;
