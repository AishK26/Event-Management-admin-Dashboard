import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ViewClient.css";
import { useParams } from "react-router-dom";
import Sidebar from "../SideBar/SideBar";
import { FaChevronLeft, FaChevronRight, FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ClientDetails = () => {
  const { clientId } = useParams();
  const [client, setClient] = useState(null);
  const [clientEvents, setClientEvents] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 5;

  // Date filter states
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Fetch client details and events by ID
  useEffect(() => {
    axios
      .get(`https://demo.internsbee.in/api/enquiry/client/${clientId}`)
      .then((response) => {
        console.log("Client Details Response:", response.data);
        if (response.data && response.data.result.length > 0) {
          setClient(response.data.result[0].client_id); // Set client details
          setClientEvents(response.data.result); // Set client events
        }
      })
      .catch((error) => {
        console.error("Error fetching client details and events:", error);
      });
  }, [clientId]);

  // Filter client events by date range
  const filteredEvents = clientEvents.filter((event) => {
    const eventDate = new Date(event.event_date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && eventDate < start) return false;
    if (end && eventDate > end) return false;
    return true;
  });

  // Pagination logic
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredEvents.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredEvents.length / entriesPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="bg-indigo-100 flex-grow mt-16 h-full w-full min-h-screen clientdetails">
        <div className="p-6 mt-22">
          <div className="flex justify-center items-center w-full">
            <h1 className="text-4xl font-bold text-center ">Client Details</h1>
          </div>
          <div className="flex justify-center gap-4 items-center p-2 mt-4">

            {/* Display selected client details */}
            {client && (
              <div className="w-full flex gap-12 justify-center mt-5">
                <div><p className="text-lg">Name: {client.full_name}</p></div>
                <div><p className="text-lg">Email: {client.email}</p></div>
              </div>
            )}
            {/* Date Filter with DatePickers */}
            <div className="w-full flex justify-center  md:flex-row items-start md:items-center md:gap-8">
              <div className="w-full md:max-w-xs">
                <label className="block text-lg font-medium text-gray-800 ">From</label>
                <div className="relative w-full max-w-xs md:max-w-full">
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    dateFormat="dd-MM-yyyy"
                    placeholderText="DD-MM-YYYY"
                    className="w-full py-2 pl-10 pr-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                  />
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              </div>

              <div className="w-full md:max-w-xs">
                <label className="block text-lg font-medium text-gray-800 ">To</label>
                <div className="relative w-full">
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    dateFormat="dd-MM-yyyy"
                    placeholderText="DD-MM-YYYY"
                    className="w-full py-2 pl-10 pr-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                  />
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
          {/* Display client event details */}
          {filteredEvents.length > 0 ? (
            <div className="overflow-x-auto w-full mt-4">
              <table className="min-w-full border border-gray-300 rounded-lg">
                <thead className="rounded-2xl">
                  <tr className="flex justify-between relative border border-gray-300 rounded-lg mb-1 bg-white w-full">
                    <th className="px-3 py-2 w-2 text-left textbold text-black uppercase tracking-wider">Sr.No</th>
                    <th className="px-3 py-2 w-44 text-left text-4xs font-bold text-black uppercase tracking-wider">Event Name</th>
                    <th className="px-3 py-2 w-32 text-left text-4xs font-bold text-black uppercase tracking-wider">Event Date</th>
                    <th className="px-3 py-2 w-32 text-left text-4xs font-bold text-black uppercase tracking-wider">Budget</th>
                    <th className="px-3 py-2 w-32 text-left text-4xs font-bold text-black uppercase tracking-wider">Venue</th>
                    <th className="px-3 py-2 w-32 text-left text-4xs font-bold text-black uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEntries.map((event, index) => (
                    <tr
                      key={event._id}
                      className="flex relative justify-between w-full border border-gray-300 rounded-lg mb-1 bg-white hover:bg-blue-300 hover:scale-[1.02] hover:-translate-y-1 hover:border-blue-400 transition-all duration-300"
                    >
                      <td className="px-3 py-2 w-2 text-left text-2xs font-medium text-black uppercase tracking-wider">
                        {(currentPage - 1) * entriesPerPage + index + 1}
                      </td>
                      <td className="px-3 py-2 w-44 text-left text-2xs font-medium text-black tracking-wider">{event.event_name}</td>
                      <td className="px-3 py-2 w-32 text-left text-2xs font-medium text-black tracking-wider">{new Date(event.event_date).toLocaleDateString()}</td>
                      <td className="px-3 py-2 w-32 text-left text-2xs font-medium text-black tracking-wider">{event.event_budget}</td>
                      <td className="px-3 py-2 w-32 text-left text-2xs font-medium text-black tracking-wider">{event.event_venue}</td>
                      <td className="px-3 py-2 w-32 text-left text-2xs font-medium text-black tracking-wider">{event.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center mt-4">No events found for the selected date range.</p>
          )}

          {/* Pagination Controls */}
          {filteredEvents.length > entriesPerPage && (
            <div className="flex justify-center items-center py-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 w-32 bg-gray-200 text-gray-600 rounded-l hover:bg-gray-300 disabled:opacity-50"
              >
                <FaChevronLeft />
              </button>
              <span className="mx-2 text-gray-600">{currentPage} of {totalPages}</span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 w-32 bg-gray-200 text-gray-600 rounded-r hover:bg-gray-300 disabled:opacity-50"
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDetails;
