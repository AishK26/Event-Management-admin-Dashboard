import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaCalendarAlt,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SearchInput from "../SearchInput/SearchInput";
import ButtonBox from "../ButtonBox/ButtonBox";
import { getEnquiries, updateEnquiry } from "../../Services/Enquiry";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../SideBar/SideBar";
import Modal from "react-modal";
import "./ViewEvent.css";
import axios from "axios";

// Required for accessibility reasons (can be skipped in testing)
Modal.setAppElement("#root");

const ApprovedEvent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [enquiries, setEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null); // To track the selected enquiry for the popup
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal open/close
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 4;
  const navigate = useNavigate();

  // Helper function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (!isNaN(date)) {
      return date.toLocaleDateString("en-GB");
    }
    return "Invalid Date";
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filterEnquiries = () => {
    let filtered = enquiries;

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

    if (startDate) {
      filtered = filtered.filter(
        (enquiry) => new Date(enquiry.event_date) >= startDate
      );
    }

    if (endDate) {
      filtered = filtered.filter(
        (enquiry) => new Date(enquiry.event_date) <= endDate
      );
    }

    setFilteredEnquiries(filtered);
  };

  const fetchEnquiries = async () => {
    try {
      // Show loading indicator
      setLoading(true);

      // Make the API request to fetch enquiries
      const response = await axios.get(
        "https://demo.internsbee.in/api/enquiry/confirm"
      );
      
       // Reverse the result array to show the latest enquiries first
      setEnquiries(response.data.result.reverse());
    } catch (error) {
      console.error("Error fetching enquiries:", error);
    } finally {
      // Hide loading indicator
      setLoading(false);
    }
  };

  // Using useEffect to fetch enquiries on component mount
  useEffect(() => {
    fetchEnquiries();
  }, []);
  useEffect(() => {
    filterEnquiries();
  }, [searchTerm, startDate, endDate, enquiries]);

  const openModal = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEnquiry(null);
  };

  const handleStatusChange = async (enquiryId, newStatus) => {
    try {
      const updatedEnquiry = await updateEnquiry(enquiryId, {
        status: newStatus,
      });
      setEnquiries((prevEnquiries) =>
        prevEnquiries.map((enquiry) =>
          enquiry._id === enquiryId
            ? { ...enquiry, status: newStatus }
            : enquiry
        )
      );
    } catch (error) {
      console.error("Error updating enquiry status:", error);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(filteredEnquiries.length / entriesPerPage);

  // Slice the filteredEnquiries based on the current page
  const paginatedEnquiries = filteredEnquiries.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  return (
    <div className="w-full px-4 vendor-content">
      <div className="flex justify-center items-center w-full mb-6">
        <h2 className="text-4xl font-bold text-black mx-3">Approved Events</h2>
      </div>

      <div className=" flex gap-5 flex-col justify-between w-full md:flex-row ">
        <div className="mt-3 w-full md:w-96">
          <SearchInput
            placeholder="Search by client or event name"
            onChange={handleSearchChange}
            className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
          />
        </div>
        <div className=" flex items-center justify-center gap-4">
          <div className="w-full max-w-xs">
            <label className="block text-lg font-medium text-gray-800 mb-2">
              From
            </label>
            <div className="relative w-full max-w-md">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="DD-MM-YYYY"
                placeholderText="DD-MM-YY"
                className="w-full py-2 pl-10 pr-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
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
                className="w-full py-2 pl-10 pr-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
              />
              <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto w-full mt-4 cursor-pointer">
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="rounded-2xl">
            <tr className="flex justify-between relative border border-gray-300 rounded-lg mb-1 bg-white w-full">
              <th className="px-3  py-2  w-3   text-left textbold text-black uppercase tracking-wider">
                Sr.No
              </th>
              <th className="px-3 py-2 w-24 text-left text-4xs font-bold text-black uppercase tracking-wider">
                Client Name
              </th>
              <th className="px-3 py-2 w-24 text-left text-4xs font-bold text-black uppercase tracking-wider">
                Contact
              </th>
              <th className="px-3 py-2 w-24 text-left text-4xs font-bold text-black uppercase tracking-wider">
                Email
              </th>
              <th className="px-3 py-2 w-24 text-left text-4xs font-bold text-black uppercase tracking-wider">
                Event Name
              </th>
              <th className="px-3 py-2 w-24 text-left text-4xs font-bold text-black uppercase tracking-wider">
                Event Date
              </th>
              <th className="px-3 py-2 w-24 text-left text-4xs font-bold text-black uppercase tracking-wider">
                Event Budget
              </th>
              <th className="px-3 py-2  w-24 text-left text-4xs font-bold text-black uppercase tracking-wider">
                View
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedEnquiries.length > 0 ? (
              paginatedEnquiries.map((enquiry, index) => (
                <tr
                  key={enquiry._id}
                  className="flex relative justify-between w-full border border-gray-300 rounded-lg mb-1 bg-white hover:bg-blue-300 hover:scale-[1.02] hover:-translate-y-1 hover:border-blue-400 transition-all duration-300"
                >
                  <td className="px-3 py-2  w-3   text-left text-2xs font-medium text-black uppercase tracking-wider">
                    {(currentPage - 1) * entriesPerPage + index + 1}
                  </td>
                  <td className="px-3 py-2  w-24    text-left text-2xs font-medium text-black tracking-wider">
                    {enquiry.client_id?.full_name || enquiry.client_name}
                  </td>
                  <td className="px-3 py-2  w-24    text-left text-2xs font-medium text-black tracking-wider">
                    {enquiry.client_id?.contact_number || enquiry.contact}
                  </td>
                  <td className="px-3 py-2  w-24    text-left text-2xs font-medium text-black tracking-wider">
                    <span title={enquiry.client_id?.email || enquiry.email}>
                      {(enquiry.client_id?.email || enquiry.email)?.length > 10
                        ? (enquiry.client_id?.email || enquiry.email).slice(
                            0,
                            10
                          ) + "..."
                        : enquiry.client_id?.email || enquiry.email}
                    </span>
                  </td>
                  <td className="px-3 py-2  w-24    text-left text-2xs font-medium text-black tracking-wider">
                    {enquiry.event_name}
                  </td>
                  <td className="px-3 py-2  w-24    text-left text-2xs font-medium text-black tracking-wider">
                    {formatDate(enquiry.event_date)}
                  </td>
                  <td className="px-3 py-2   w-24   text-left text-2xs font-medium text-black tracking-wider">
                    {enquiry.event_budget}
                  </td>
                  <td className="px-3 py-2  w-24    text-left text-2xs font-medium text-black tracking-wider">
                    <button
                      onClick={() => openModal(enquiry)}
                      className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex justify-center items-center py-4">
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

      {/* Modal for viewing enquiry details */}
      {isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-xs py-6 px-4" style={{marginLeft:"42px",maxWidth:"16rem"}}>
      <h2 className="text-xl font-bold mb-4 flex justify-center">
        Enquiry Details
      </h2>
      {selectedEnquiry && (
        <div>
          <p className="p-2">
            <strong>Client Name:</strong>{" "}
            {selectedEnquiry.client_id?.full_name || "N/A"}
          </p>
          <p className="p-2">
            <strong>Contact:</strong>{" "}
            {selectedEnquiry.client_id?.contact_number || "N/A"}
          </p>
          <p className="p-2">
            <strong>Email:</strong> {selectedEnquiry.client_id?.email || "N/A"}
          </p>
          <p className="p-2">
            <strong>Event Name:</strong> {selectedEnquiry.event_name || "N/A"}
          </p>
          <p className="p-2">
            <strong>Event Date:</strong>{" "}
            {formatDate(selectedEnquiry.event_date) || "N/A"}
          </p>
          <p className="p-2">
            <strong>Event Budget:</strong> {selectedEnquiry.event_budget || "N/A"}
          </p>
          <p className="p-2">
            <strong>Payment Status:</strong>{" "}
            {selectedEnquiry.payment_status || "N/A"}
          </p>
          <div className="flex justify-center mt-4">
            <ButtonBox
             label="Close"
              className="button-box bg-gray-600 text-white"
              onClick={closeModal}
            >
              Close
            </ButtonBox>
          </div>
        </div>
      )}
    </div>
  </div>
)}

    </div>
  );
};

export default ApprovedEvent;
