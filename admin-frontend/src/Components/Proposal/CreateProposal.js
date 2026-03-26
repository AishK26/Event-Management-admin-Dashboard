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
import "./Proposal.css";
// Required for accessibility reasons (can be skipped in testing)
Modal.setAppElement("#root");

const CreateProposal = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [enquiries, setEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null); // To track the selected enquiry for the popup
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal open/close
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 5;
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filterEnquiries = () => {
    let filtered = enquiries;
  
    filtered = filtered.filter(
      (enquiry) =>
        enquiry &&
        (searchTerm
          ? enquiry.client_name
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            enquiry.client_id?.full_name
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            enquiry.event_name?.toLowerCase().includes(searchTerm.toLowerCase())
          : true) &&
        (startDate ? new Date(enquiry.event_date) >= startDate : true) &&
        (endDate ? new Date(enquiry.event_date) <= endDate : true)
    );
  
    // No need to reverse again if already reversed during fetch
    setFilteredEnquiries(filtered);
    setCurrentPage(1); // Reset to the first page when filter is applied
  };
  

  const fetchEnquiries = async () => {
    try {
      const response = await getEnquiries();
      // Reverse the data as soon as it's fetched
      setEnquiries(response.result.reverse());
    } catch (error) {
      console.error("Error fetching enquiries:", error);
    } finally {
      setLoading(false);
    }
  };
  

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

  const totalPages = Math.ceil(filteredEnquiries.length / entriesPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Slice the filteredEnquiries based on the current page
  const paginatedEnquiries = filteredEnquiries.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  return (
    // <div className="flex bg-indigo-100">
    //   <Sidebar />
    //   <div className="min-h-screen p-4 flex-grow-1 mt-20 w-full event-content">
    //     <div className="">
    <div className="w-full  px-4 proposal">
      <div className="flex justify-center items-center w-full">
        <h1 className="text-4xl font-bold text-center ">Create Proposal</h1>
      </div>

      <div className="flex flex-col md:flex-row justify-between w-full gap-10 md:gap-28 mt-6">
        <div className="mt-3 w-full">
          <SearchInput
            placeholder="Search client or event name"
            onChange={handleSearchChange}
            style={{ width: "100%" }}
          />
        </div>
        <div className="w-full flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
          <div className="w-full md:max-w-xs">
            <label className="block text-lg font-medium text-gray-800 mb-2">        From
            </label>
            <div className="relative w-full">
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

          <div className="w-full max-w-xs">
            <label className="block text-lg font-medium text-gray-800 mb-2">
              To
            </label>
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

      {loading ? (
        <div className="mt-6 text-center">Loading...</div>
      ) : (
        <div className="overflow-x-auto w-full mt-4">
          <table className="min-w-full border border-gray-300 rounded-lg">
            <thead className="rounded-2xl">
              <tr className="flex justify-between relative border border-gray-300 rounded-lg mb-1 bg-white w-full">
                <th className="px-3 py-2 w-3  text-4xs font-bold text-black uppercase tracking-wider">
                  Sr.No
                </th>
                <th className="px-3 py-2 w-36  text-4xs font-bold text-black uppercase tracking-wider">
                  Client Name
                </th>
                <th className="px-3 py-2 w-36  text-4xs font-bold text-black uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-3 py-2 w-36  text-4xs font-bold text-black uppercase tracking-wider">
                  Event Name
                </th>
                <th className="px-3 py-2 w-36  text-4xs font-bold text-black uppercase tracking-wider">
                  Event Date
                </th>
                <th className="px-3 py-2 w-40  text-4xs font-bold text-black uppercase tracking-wider">
                  Event Budget
                </th>
                <th className="px-3 py-2 w-40  text-4xs font-bold text-black uppercase tracking-wider">
                  Create Proposal
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
                    <td className="px-3 py-2 w-3  text-2xs font-medium text-black tracking-wider">
                      {(currentPage - 1) * entriesPerPage + index + 1}
                    </td>
                    <td className="px-3 py-2 w-36  text-2xs font-medium text-black tracking-wider">
                      <span title={enquiry.client_id?.full_name}>
                        {(enquiry.client_id?.full_name)?.length > 10
                          ? (enquiry.client_id?.full_name).slice(
                            0,
                            10
                          ) + "..."
                          : enquiry.client_id?.full_name}
                      </span>
                    </td>
                    <td className="px-3 py-2 w-36  text-2xs font-medium text-black tracking-wider">
                      {enquiry.client_id?.contact_number}
                    </td>
                    <td className="px-3 py-2 w-36  text-2xs font-medium text-black tracking-wider">
                      <span title={enquiry.event_name}>
                        {(enquiry.event_name)?.length > 10
                          ? (enquiry.event_name).slice(
                            0,
                            10
                          ) + "..."
                          : enquiry.event_name}
                      </span>
                    </td>
                    <td className="px-3 py-2 w-36  text-2xs font-medium text-black tracking-wider">
                      {enquiry.event_date
                        ? new Date(enquiry.event_date).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-3 py-2 w-36  text-2xs font-medium text-black tracking-wider">
                      {enquiry.event_budget}
                    </td>
                    <td className="px-3 py-2 w-36  text-2xs font-medium text-black tracking-wider">
                      <ButtonBox
                        label="Create"
                        className=""
                        onClick={() => {
                          navigate(`/proposal/${enquiry._id}`);
                        }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-3 py-4  text-4xs font-medium text-black uppercase tracking-wider"
                  >
                    No enquiries found.d
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Pagination */}
          {filteredEnquiries.length > 0 && (
            <div className="pagination flex justify-center items-center py-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className="pagination-button"
                disabled={currentPage === 1}
              >
                <FaChevronLeft />
              </button>
              <span className="pagination-info mx-2">
                {`${currentPage} of ${totalPages}`}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="pagination-button"
                disabled={currentPage === totalPages}
              >
                <FaChevronRight />
              </button>
            </div>
          )}

        </div>
      )}
    </div>
    // </div>
  );
};

export default CreateProposal;
