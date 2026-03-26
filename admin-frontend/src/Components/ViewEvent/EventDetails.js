import React, { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SearchInput from "../SearchInput/SearchInput";
import AssignModal from "./AssignPage";
import DetailsModal from "./DetailsModal";
import axios from "axios";

// Helper function to format the date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (!isNaN(date)) {
    return date.toLocaleDateString("en-GB");
  }
  return "Invalid Date";
};

const EventDetails = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 4;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [details, setDetails] = useState(null);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        "https://demo.internsbee.in/api/enquiry"
      );
      // Reverse the data here to display the latest enquiries first
      setEvents(response.data.result);
      setFilteredEvents(response.data.result.reverse()); 
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openModal = (details) => {
    setSelectedDetails(details);
    setShowDetailsModal(true);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false); // Close modal
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

    // Convert startDate and endDate to Date objects if they are not already
    const start = startDate ? new Date(startDate.setHours(0, 0, 0, 0)) : null;
    const end = endDate ? new Date(endDate.setHours(23, 59, 59, 999)) : null;

    // Filter by start date ("From")
    if (start) {
      filtered = filtered.filter((event) => {
        const eventDate = new Date(event.event_date);
        return !isNaN(eventDate) && eventDate >= start;
      });
    }

    // Filter by end date ("To")
    if (end) {
      filtered = filtered.filter((event) => {
        const eventDate = new Date(event.event_date);
        return !isNaN(eventDate) && eventDate <= end;
      });
    }

    // Filter by search term (client_name or event_name)
    if (searchTerm) {
      filtered = filtered.filter((event) => {
        const clientName =
          event.client_id && event.client_id.full_name
            ? event.client_id.full_name.toLowerCase()
            : "";
        const eventName = event.event_name
          ? event.event_name.toLowerCase()
          : "";

        return (
          clientName.includes(searchTerm.toLowerCase()) ||
          eventName.includes(searchTerm.toLowerCase())
        );
      });
    }

    console.log("Filtered Events:", filtered);

    setFilteredEvents(filtered);
  };

  // Apply filters whenever search term, start date, or end date change
  useEffect(() => {
    applyFilters();
  }, [searchTerm, startDate, endDate]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(filteredEvents.length / entriesPerPage);

  // Slice the filteredEvents based on the current page
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  return (
    <>
      <div className="w-full px-4  vendor-content">
        <div className="flex justify-center items-center w-full mb-3">
          <h2 className="text-4xl font-bold text-black mx-3">Event Details</h2>
        </div>
        <div className="flex gap-5 flex-col w-full md:flex-row justify-between">
          <div className="mt-3 w-full md:w-96">
            <SearchInput
              placeholder="Search By Event or Client Name"
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

        <div className="overflow-x-auto w-full mt-4">
          <table className="min-w-full border border-gray-300 rounded-lg">
            <thead className="rounded-2xl">
              <tr className="flex justify-between relative border border-gray-300 rounded-lg mb-1 bg-white w-full">
                <th className="px-6 py-2 w-24  text-left textbold text-black uppercase tracking-wider">
                  Sr.No
                </th>
                <th className="px-6 py-2 w-24  text-left text-4xs font-bold text-black uppercase tracking-wider">
                  Client Name
                </th>
                <th className="px-6 py-2 w-24  text-left text-4xs font-bold text-black uppercase tracking-wider">
                  Event Name
                </th>
                <th className="px-6 py-2 w-24  text-left text-4xs font-bold text-black uppercase tracking-wider">
                  Event Date
                </th>
                <th className="px-6 py-2 w-24  text-left text-4xs font-bold text-black uppercase tracking-wider">
                  Assigned Manager
                </th>
                {/* <th className="px-6 py-2 w-24  text-left text-4xs font-bold text-black uppercase tracking-wider">Status</th> */}
                <th className="px-6 py-2 w-24  text-left text-4xs font-bold text-black uppercase tracking-wider">
                  View
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedEvents.map((item, index) => (
                <tr
                  key={item._id}
                  className="flex relative justify-between w-full border border-gray-300 rounded-lg mb-1 bg-white hover:bg-blue-300 hover:scale-[1.02] hover:-translate-y-1 hover:border-blue-400 transition-all duration-300"
                >
                  <td className="px-6 py-2 w-24  text-left text-2xs font-medium text-black tracking-wider">
                    {(currentPage - 1) * entriesPerPage + index + 1}
                  </td>
                  <td className="px-6 py-2 w-24  text-left text-2xs font-medium text-black tracking-wider">
                    {item.client_id?.full_name || item.client_name}
                  </td>
                  <td className="px-6 py-2 w-24  text-left text-2xs font-medium text-black tracking-wider">
                    {item.event_name}
                  </td>
                  <td className="px-6 py-2 w-24  text-left text-2xs font-medium text-black tracking-wider">
                    {formatDate(item.event_date)}
                  </td>
                  <td className="px-6 py-2 w-24  text-left text-2xs font-medium text-black tracking-wider">
                    {item.assign_manager_id
                      ? item.assign_manager_id.fullname
                      : "Not Assigned"}
                  </td>
                  {/* <td className="px-6 py-2 w-24  text-left text-2xs font-medium text-black tracking-wider">{item.status}</td> */}
                  <td className="px-6 py-2 w-24  text-left text-2xs font-medium text-black tracking-wider">
                    <button
                      onClick={() => openModal(item)}
                      className="flex items-center justify-center bg-blue-800 hover:bg-blue-900 text-white py-1 px-2 rounded"
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))}
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

        {/* Modals */}
        {showAssignModal && selectedEvent && (
          <AssignModal
            show={showAssignModal}
            onClose={handleCloseAssignModal}
            selectedEvent={selectedEvent}
          />
        )}

        {isModalOpen && selectedDetails && (
          <DetailsModal
            show={isModalOpen}
            handleClose={closeModal}
            details={selectedDetails}
          />
        )}
      </div>
    </>
  );
};

export default EventDetails;
