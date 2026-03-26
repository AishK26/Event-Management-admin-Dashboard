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
import Navbar from "../Navbar/Navbar";
import Sidebar from "../SideBar/SideBar";

const ManagerTask = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 4;

  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          "https://demo.internsbee.in/api/enquiry"
        );
        const tasksWithManagers = response.data.result
        .filter((task) => task.assign_manager_id)
        .reverse(); // Reverse the array to get the new tasks at the top
      
        setTasks(tasksWithManagers);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
  
    fetchTasks();
  }, []);
  

  // Filter tasks based on search term and date range
  useEffect(() => {
    let filtered = tasks;

    if (searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.event_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (task.assign_manager_id?.fullname || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    if (startDate) {
      filtered = filtered.filter(
        (task) => new Date(task.event_date) >= new Date(startDate)
      );
    }

    if (endDate) {
      filtered = filtered.filter(
        (task) => new Date(task.event_date) <= new Date(endDate)
      );
    }

    setFilteredTasks(filtered);
  }, [searchTerm, startDate, endDate, tasks]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

 

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(filteredTasks.length / entriesPerPage);

  // Slice the filteredTasks based on the current page
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  return (
    <div className="w-full px-4 vendor-content">
      <div className="flex justify-center items-center w-full mb-6">
        <h2 className="text-4xl font-bold text-black mx-3">Manager Task</h2>
      </div>

      <div className="flex gap-5 flex-col justify-between w-full md:flex-row">
        <div className="mt-3 w-full md:w-96">
          <SearchInput
            placeholder="Search by manager or Task name"
            onChange={handleSearchChange}
            className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto w-full mt-4 cursor-pointer">
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="rounded-2xl">
            <tr className="flex justify-between relative border border-gray-300 rounded-lg mb-1 bg-white w-full">
              <th className="px-6 w-12 py-2 text-left text-bold text-black uppercase tracking-wider">
                Sr.No
              </th>
              <th className="px-6 w-48 py-2 text-left text-bold text-black uppercase tracking-wider">
                Manager Name
              </th>
              <th className="px-6 w-48 py-2 text-left text-bold text-black uppercase tracking-wider">
                Task Name
              </th>
              
              <th className="px-6 w-48 py-2 text-left text-bold text-black uppercase tracking-wider">
                Contact No
              </th>
              <th className="px-6 w-48  py-2 text-left text-bold text-black uppercase tracking-wider">
                Manager Status
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
                    {index + 1}
                  </td>
                  <td className="px-6 w-48 py-2 text-left text-2xs font-medium text-black tracking-wider">
                    {task.assign_manager_id?.fullname}
                  </td>
                  <td className="px-6 w-48 py-2 text-left text-2xs font-medium text-black tracking-wider">
                    {task.event_name}
                  </td>
                  <td className="px-6  w-48 py-2 text-left text-2xs font-medium text-black tracking-wider">
                    {task.assign_manager_id?.contact}
                  </td>
                  <td className="px-6  w-48 py-2 text-left text-2xs font-medium text-black tracking-wider">
                    {task.manager_status}
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

export default ManagerTask;
