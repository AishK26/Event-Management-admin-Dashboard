import React, { useEffect, useState } from "react";
import { getAllQuotations } from "../../Services/ProposalApi"; // Adjust the import path as necessary
import Modal from "./Mode"; // Adjust the import path as necessary
import SendProposalModal from "./SendProposalModal";
import { MdOutlineModeEditOutline } from "react-icons/md";
import {
  FaCalendarAlt,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SearchInput from "../SearchInput/SearchInput";
import { useNavigate } from "react-router";
import { MdMail } from "react-icons/md";

const ViewProposal = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [quotations, setQuotations] = useState([]);
  const [filteredQuotations, setFilteredQuotations] = useState([]);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [isSendMailModalOpen, setIsSendMailModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [quotationsPerPage] = useState(5);
  const navigate = useNavigate();
  const handleEditProposal = (quotation) => {
    // Navigate to the edit proposal page with the quotation ID
    navigate(`/edit-proposal/${quotation._id}`);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filterProposals = () => {
    let filtered = quotations;

    filtered = filtered.filter((quotation) => {
      const enquiry = quotation?.enquiry_id;

      // Check if enquiry exists before proceeding
      if (!enquiry) return false;

      return (
        (searchTerm
          ? enquiry.client_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          quotation.enquiry_id?.client_id?.full_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          quotation.enquiry_id?.event_name?.toLowerCase().includes(searchTerm.toLowerCase())
          : true) &&
        (startDate ? new Date(enquiry.event_date) >= startDate : true) &&
        (endDate ? new Date(enquiry.event_date) <= endDate : true)
      );
    });

    setFilteredQuotations(filtered);
  };

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const response = await getAllQuotations();
        if (response.quotation && Array.isArray(response.quotation)) {
          // Reverse the quotations array before setting state
          const reversedQuotations = response.quotation.reverse();
          setQuotations(reversedQuotations);
          setFilteredQuotations(reversedQuotations);
        } else {
          console.error("Unexpected data format:", response);
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchQuotations();
  }, []);


  useEffect(() => {
    filterProposals();
  }, [searchTerm, startDate, endDate, quotations]);

  // Function to handle opening the modal
  const handleViewMore = (quotation) => {
    setSelectedQuotation(quotation);
    setIsModalOpen(true);
  };

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedQuotation(null);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (
      newPage >= 1 &&
      newPage <= Math.ceil(filteredQuotations.length / quotationsPerPage)
    ) {
      setCurrentPage(newPage);
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredQuotations.length / quotationsPerPage);

  // Slice the filtered quotations based on the current page
  const currentQuotations = filteredQuotations.slice(
    (currentPage - 1) * quotationsPerPage,
    currentPage * quotationsPerPage
  );

  if (error) return <div>Error: {error}</div>;
  if (!filteredQuotations.length) return <div>Loading...</div>;
  const handleSendMail = (quotation) => {
    setSelectedQuotation(quotation);
    setIsSendMailModalOpen(true);
  };

  return (
    // <div className="flex bg-indigo-100">
    //   <Sidebar />
    //   <div className="min-h-screen p-4 flex-grow-1 mt-20 w-full event-content">
    //     <div className="">
    <div className="w-full  px-4 proposal">
      <div className="flex justify-center items-center w-full">
        <h1 className="text-4xl font-bold text-center ">View Proposal</h1>
      </div>
      <div className="flex flex-col md:flex-row justify-between w-full gap-10 md:gap-28 mt-6">
        <div className="mt-3 w-full">
          <SearchInput
            placeholder="Search client or event name"
            onChange={handleSearchChange}
            style={{ width: "100%" }} // Full width on smaller screens
          />
        </div>
        <div className="w-full flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
          <div className="w-full md:max-w-xs">
            <label className="block text-lg font-medium text-gray-800 mb-2">       From
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
      <div className="overflow-x-auto w-full mt-4">
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="rounded-2xl">
            <tr className="flex justify-between relative border border-gray-300 rounded-lg mb-1 bg-white w-full">
              <th className="px-3 py-2 w-24 text-4xs font-bold text-black uppercase tracking-wider">
                Sr.No
              </th>
              <th className="px-3 py-2 w-36 text-left text-4xs font-bold text-black uppercase tracking-wider">
                Client Name
              </th>
              <th className="px-3 py-2 w-36 text-left text-4xs font-bold text-black uppercase tracking-wider">
                Event Name
              </th>
              <th className="px-3 py-2 w-36 text-left text-4xs font-bold text-black uppercase tracking-wider">
                Event Date
              </th>
              <th className="px-3 py-2 w-36 text-left text-4xs font-bold text-black uppercase tracking-wider">
                Grand Total
              </th>
              <th className="px-3 py-2 w-44 text-left text-4xs font-bold text-black uppercase tracking-wider">
                Send Proposal
              </th>
              <th className="px-3 py-2 w-36 text-left text-4xs font-bold text-black uppercase tracking-wider">
                View
              </th>
              <th className="px-3 py-2 w-36 text-left text-4xs font-bold text-black uppercase tracking-wider">
                Edit
              </th>

            </tr>
          </thead>
          <tbody>
            {currentQuotations.map((quotation, index) => (
              <tr
                key={quotation._id}
                className="flex relative justify-between w-full border border-gray-300 rounded-lg mb-1 bg-white hover:bg-blue-300 hover:scale-[1.02] hover:-translate-y-1 hover:border-blue-400 transition-all duration-300"
              >
                <td className="px-3 py-2 w-24 text-left text-2xs font-medium text-black tracking-wider">
                  {(currentPage - 1) * quotationsPerPage + index + 1}
                </td>

                <td className="px-3 py-2 w-36 text-left text-2xs font-medium text-black tracking-wider">
                  <span title={quotation.enquiry_id?.client_id?.full_name}>
                    {(quotation.enquiry_id?.client_id?.full_name)?.length > 10
                      ? (quotation.enquiry_id?.client_id?.full_name).slice(
                        0,
                        10
                      ) + "..."
                      : quotation.enquiry_id?.client_id?.full_name}
                  </span>
                </td>

                <td className="px-3 py-2 w-36 text-left text-2xs font-medium text-black tracking-wider">

                  <span title={quotation.enquiry_id?.event_name}>
                    {(quotation.enquiry_id?.event_name)?.length > 10
                      ? (quotation.enquiry_id?.event_name).slice(
                        0,
                        10
                      ) + "..."
                      : quotation.enquiry_id?.event_name}
                  </span>
                </td>
                <td className="px-3 py-2 w-36 text-left text-2xs font-medium text-black tracking-wider">
                  {new Date(
                    quotation.enquiry_id?.event_date
                  ).toLocaleDateString() || "N/A"}
                </td>
                <td className="px-3 py-2 w-36 text-left text-2xs font-medium text-black tracking-wider">
                  {quotation?.grand_total || "N/A"}
                </td>
                <td className="px-3 py-2 w-36 text-left text-2xs font-medium text-black tracking-wider">
                  <button
                    onClick={() => handleSendMail(quotation)} // Open send mail modal
                    className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
                  >
                    <MdMail />
                  </button>
                </td>
                <td className="px-3 py-2 w-36 text-left text-2xs font-medium text-black tracking-wider">
                  <button

                    onClick={() => handleViewMore(quotation)} className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
                  >
                    <FaEye />
                  </button>
                </td>
                <td className="px-3 py-2 w-36 text-left text-2xs font-medium text-black tracking-wider">
                  <button onClick={() => handleEditProposal(quotation)} className="bg-blue-800 text-white px-2 py-1 rounded">
                    <MdOutlineModeEditOutline size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination */}
        {filteredQuotations.length > 0 && (
          <div className="pagination flex justify-center items-center py-2 ">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-button px-4 py-2  bg-gray-200 text-gray-600 rounded-l hover:bg-gray-300 disabled:opacity-50"
            >
              <FaChevronLeft />
            </button>
            <span className="pagination-info mx-2">
              {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-button px-4 py-2  bg-gray-200 text-gray-600 rounded-r hover:bg-gray-300 disabled:opacity-50"
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>
      <SendProposalModal
        isOpen={isSendMailModalOpen}
        onClose={() => setIsSendMailModalOpen(false)}
        quotation={selectedQuotation}
      />
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        quotation={selectedQuotation}
      />
    </div>
    //   </div>
    // </div>
  );
};

export default ViewProposal;
