import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaEye } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SearchInput from "../SearchInput/SearchInput";
import ButtonBox from "../ButtonBox/ButtonBox";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../SideBar/SideBar";
import AssignModal from "./AssignPage"; // Import the modal component
import DetailsModal from "./DetailsModal";
import axios from "axios";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

// Helper function to format the date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (!isNaN(date)) {
    return date.toLocaleDateString("en-GB"); // Formats to "dd/MM/yyyy"
  }
  return "Invalid Date";
};

const CreateTask = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [managers, setManagers] = useState([]);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 4;

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        "https://demo.internsbee.in/api/enquiry/confirm"
      );
      // Reverse the data here to display the latest enquiries first
      setEvents(response.data.result.reverse());
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [startDate, endDate, searchTerm, events]);

  const handleViewMore = (details) => {
    setSelectedDetails(details);
    setShowDetailsModal(true);
  };

  const handleAssign = (event) => {
    setSelectedEvent(event);
    setShowAssignModal(true);
  };

  const handleCloseAssignModal = () => {
    setShowAssignModal(false);
    setSelectedEvent(null);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedDetails(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const applyFilters = () => {
    let filtered = events;

    // Filter by start and end date
    if (startDate) {
      filtered = filtered.filter(
        (event) => new Date(event.event_date) >= startDate
      );
    }
    if (endDate) {
      filtered = filtered.filter(
        (event) => new Date(event.event_date) <= endDate
      );
    }

    // Apply search filter for full_name, event_name, and event_date
    filtered = filtered.filter((event) => {
      const fullName = event.client_id?.full_name?.toLowerCase() || "";
      const eventName = event.event_name.toLowerCase();
      const eventDate = formatDate(event.event_date).toLowerCase();

      return (
        fullName.includes(searchTerm.toLowerCase()) ||
        eventName.includes(searchTerm.toLowerCase()) ||
        eventDate.includes(searchTerm.toLowerCase())
      );
    });

    setFilteredEvents(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setSearchTerm("");
    setFilteredEvents(events);
    setCurrentPage(1); // Reset to first page when filters are cleared
  };

  // Pagination logic
  const indexOfLastEvent = currentPage * rowsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - rowsPerPage;
  const currentEvents = filteredEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );

  const totalPages = Math.ceil(filteredEvents.length / rowsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const PaginationControls = () => (
    <div className="flex justify-center">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg mr-2 disabled:opacity-50 hover:bg-gray-300"
      >
        <FaChevronLeft />
      </button>
      <span className="px-4 py-2">
        {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg ml-2 disabled:opacity-50 hover:bg-gray-300"
      >
        <FaChevronRight />
      </button>
    </div>
  );

  return (
    <>
      <div className="w-full px-4 vendor-content">
        <div className="flex justify-center items-center w-full mb-6">
          <h2 className="text-4xl font-bold text-black mx-3">Create Task</h2>
        </div>
        <div className="flex gap-5 flex-col justify-between w-full md:flex-row">
          <div className="mt-3 w-full md:w-96">
            <SearchInput
              placeholder="Search by Client or Event Name"
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

        <div className="overflow-x-auto w-full  cursor-pointer">
          <table className="min-w-full border border-gray-300 rounded-lg">
            <thead className="rounded-2xl">
              <tr className="flex justify-between relative border border-gray-300 rounded-lg mb-1 bg-white w-full">
                <th className="px-6 py-2 w-24 text-left text-4xs font-bold text-black uppercase tracking-wider">
                  Sr.No.
                </th>
                <th className="px-6 py-2 w-24 text-left text-4xs font-bold text-black uppercase tracking-wider">
                  Client Name
                </th>
                <th className="px-6 py-2 w-24 text-left text-4xs font-bold text-black uppercase tracking-wider">
                  Event Name
                </th>
                <th className="px-6 py-2 w-24 text-left text-4xs font-bold text-black uppercase tracking-wider">
                  Event Date
                </th>
                <th className="px-6 py-2 w-24 text-left text-4xs font-bold text-black uppercase tracking-wider">
                  Contact No
                </th>
                <th className="px-6 py-2 w-24 text-left text-4xs font-bold text-black uppercase tracking-wider">
                  Assigned Manager
                </th>
                <th className="px-6 py-2 w-24 text-left text-4xs font-bold text-black uppercase tracking-wider">
                  View
                </th>
                <th className="px-6 py-2 w-24 text-left text-4xs font-bold text-black uppercase tracking-wider">
                  Assign To
                </th>
              </tr>
            </thead>
            <tbody>
              {currentEvents.map((item, index) => (
                <tr
                  key={item._id}
                  className="flex relative justify-between w-full border border-gray-300 rounded-lg mb-1 bg-white hover:bg-blue-300 hover:scale-[1.02] hover:-translate-y-1 hover:border-blue-400 transition-all duration-300"
                >
                  <td className="px-6 py-2  w-24    text-left text-2xs font-medium text-black tracking-wider">
                    {indexOfFirstEvent + index + 1}
                  </td>
                  <td className="px-6 py-2  w-24    text-left text-2xs font-medium text-black tracking-wider">
                    {item.client_id?.full_name}
                  </td>
                  <td className="px-6 py-2  w-24    text-left text-2xs font-medium text-black tracking-wider">
                    {item.event_name}
                  </td>
                  <td className="px-6 py-2  w-24    text-left text-2xs font-medium text-black tracking-wider">
                    {formatDate(item.event_date)}
                  </td>
                  <td className="px-6 py-2  w-24    text-left text-2xs font-medium text-black tracking-wider">
                    {item.client_id?.contact_number}
                  </td>
                  <td className="px-6 py-2  w-24    text-left text-2xs font-medium text-black tracking-wider">
                    {item.assign_manager_id
                      ? item.assign_manager_id.fullname
                      : "Not Assigned"}
                  </td>
                  <td className="px-6 py-2  w-15    text-left text-2xs font-medium text-black tracking-wider">
                    <button
                      onClick={() => handleViewMore(item)}
                      className="flex items-center justify-center bg-blue-800 hover:bg-blue-400 text-white font-bold py-1 px-4 rounded text-sm"
                    >
                      <FaEye className="text-base" />
                    </button>
                  </td>
                  <td className="px-6 py-2  w-15    text-left text-2xs font-medium text-black tracking-wider">
                    <button
                      className="flex items-center justify-center bg-blue-800 hover:bg-blue-400 text-white font-bold py-1 px-4 rounded text-sm"
                      onClick={() => handleAssign(item)}
                      disabled={!!item.assign_manager_id} // Disable if manager is assigned
                    >
                       {item.assign_manager_id ? 'Assigned' : 'Assign'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <PaginationControls />

        <AssignModal
          show={showAssignModal}
          handleClose={handleCloseAssignModal}
          managers={managers}
          handleAssign={handleAssign}
          selectedEvent={selectedEvent}
        />
        <DetailsModal
          show={showDetailsModal}
          handleClose={handleCloseDetailsModal}
          details={selectedDetails}
        />
      </div>
    </>
  );
};

export default CreateTask;
