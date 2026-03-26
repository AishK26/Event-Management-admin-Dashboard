import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import DatePicker from "react-datepicker";
import ButtonBox from "./../ButtonBox/ButtonBox";
import { getEnquiries } from "../../Services/Enquiry";
import "react-datepicker/dist/react-datepicker.css";
import {
  FaSortAmountDown,
  FaSortAmountUp,
  FaChevronLeft,
  FaChevronRight,
  FaCalendarAlt,
} from "react-icons/fa";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date) ? date.toLocaleDateString("en-GB") : "Invalid Date";
};

const EnquiryReport = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [enquiries, setEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 4;

  const fetchEnquiries = async () => {
    try {
      const response = await getEnquiries();
      // Reverse the data here to display the latest enquiries first
      const reversedEnquiries = response.result.reverse();
      setEnquiries(reversedEnquiries);
      setFilteredEnquiries(reversedEnquiries); // Set initial filtered enquiries
    } catch (error) {
      console.error("Error fetching enquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterEnquiries(query, { startDate, endDate }, selectedStatus);
  };

  const filterEnquiries = () => {
    let filtered = enquiries;

    filtered = filtered.filter(
      (enquiry) =>
        enquiry &&
        (searchQuery
          ? enquiry.client_name
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            enquiry.client_id?.full_name
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            enquiry.event_name?.toLowerCase().includes(searchQuery.toLowerCase())
          : true) &&
        (startDate ? new Date(enquiry.event_date) >= startDate : true) &&
        (endDate ? new Date(enquiry.event_date) <= endDate : true)
    );

    setFilteredEnquiries(filtered);
    setCurrentPage(1); // Reset to first page after filtering
  };

  const sortEnquiries = (order) => {
    const sorted = [...filteredEnquiries].sort((a, b) => {
      return order === "asc"
        ? new Date(a.event_date) - new Date(b.event_date)
        : new Date(b.event_date) - new Date(a.event_date);
    });
    setFilteredEnquiries(sorted);
  };

  const exportToExcel = () => {
    const filteredData = filteredEnquiries.map((event) => ({
      EventName: event.event_name,
      Venue: event.event_venue,
      Event_Date: event.event_date,
      Guest_Number: event.guest_quantity,
      QuotationAmount: event.event_budget,
      Status: event.status,
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(filteredData);
    XLSX.utils.book_append_sheet(wb, ws, "Enquiries");
    XLSX.writeFile(wb, "enquiry_report.xlsx");
  };

  const toggleSortOrder = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    sortEnquiries(newOrder);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(filteredEnquiries.length / entriesPerPage);

  const paginatedEnquiries = filteredEnquiries.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  useEffect(() => {
    fetchEnquiries();
  }, []);

  useEffect(() => {
    filterEnquiries();
  }, [startDate, endDate, searchQuery, selectedStatus, enquiries]);


  return (
    <div className="w-full  px-4 eventreport-content ">
      <div className="flex justify-center items-center w-full mb-6">
        <h2 className="text-4xl font-bold text-black mx-3">Enquiry Reports</h2>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="w-full flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
          <div className="w-full md:max-w-xs">
            <label className="block text-lg font-medium text-gray-800 mb-2">
              From
            </label>
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
        <div className="flex items-center flex-wrap">
          <p className="mr-4">
            Total number of Enquiry: {filteredEnquiries.length}
          </p>
          {/* <button
            className="p-2 bg-blue-800 hover:bg-blue-400 text-white font-bold py-3 px-8 rounded-full"
            onClick={exportToExcel}
          >
            Export to Excel
          </button> */}
           <ButtonBox
                  label="Export to Excel"
                  className=" text-white w-full py-2 pl-10 pr-4 rounded border mr-2"
                  onClick={exportToExcel}
                />
        </div>
      </div>

      <div className="overflow-x-auto w-full mt-4">
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="rounded-2xl">
            <tr className="flex justify-between relative border border-gray-300 rounded-lg mb-1 bg-white w-full">
              <th className=" px-3    w-36 py-2    text-left textbold text-black uppercase tracking-wider">
                Sr.No
              </th>
              <th
                className="px-3    w-36 py-2 text-left text-3xs font-bold text-black uppercase tracking-wider"
                scope="col"
              >
                Event Name
              </th>
              <th
                className=" px-3    w-24 py-2 text-left text-3xs font-bold text-black uppercase tracking-wider"
                scope="col"
                onClick={toggleSortOrder}
              >
                Event Date{" "}
                {sortOrder === "asc" ? (
                  <FaSortAmountDown />
                ) : (
                  <FaSortAmountUp />
                )}
              </th>
              <th
                className="px-3    w-24 py-2 text-left text-3xs font-bold text-black uppercase tracking-wider"
                scope="col"
              >
                Guest Number
              </th>
              <th
                className="px-3  w-36 py-2 text-left text-3xs font-bold text-black uppercase tracking-wider"
                scope="col"
              >
                Venue
              </th>
             
              <th
                className="px-3  w-36 py-2 text-left text-3xs font-bold text-black uppercase tracking-wider"
                scope="col"
              >
                Address
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedEnquiries.length > 0 ? (
              paginatedEnquiries.map((event, index) => (
                <tr
                  key={event._id}
                  className="flex relative justify-between w-full border border-gray-300 rounded-lg mb-1 bg-white hover:bg-blue-300 hover:scale-[1.02] hover:-translate-y-1 hover:border-blue-400 transition-all duration-300 ease-in-out "
                >
                  <td className="px-3    w-36 py-2    text-left textbold text-black uppercase tracking-wider">
                   {index + 1 + (currentPage - 1) * entriesPerPage}{" "}
                      {/* Adjusted for pagination */}
                  </td>
                  <td className="px-3    w-36 py-2 text-left text-2xs font-medium text-black tracking-wider">
                    {/* {event.event_name} */}
                    <span title={event.event_name || "N/A"}>
    {event.event_name && event.event_name.length > 11
      ?event.event_name.slice(0, 11) + "..."
      : event.event_name || "N/A"}
  </span>
                  </td>
                  <td className="px-3    w-24 py-2 text-left text-2xs font-medium text-black tracking-wider">
                    {formatDate(event.event_date)}
                  </td>
                  <td className="px-3    w-24 py-2  text-2xs font-medium text-black tracking-wider   text-left">
                    {event.guest_quantity}
                  </td>
                  <td className="px-3  w-36 py-2 text-2xs font-medium text-black tracking-wider   text-left">
                    {/* {event.event_venue} */}
                    <span title={event.event_venue || "N/A"}>
    {event.event_venue && event.event_venue.length > 11
      ? event.event_venue.slice(0, 11) + "..."
      : event.event_venue || "N/A"}
  </span>
                  </td>
                 
                  <td className="px-3  w-36 py-2  text-2xs font-medium text-black tracking-wider  text-left ">
                    {/* {event.client_id?.address} */}
                    <span title={event.client_id?.address || "N/A"}>
    {event.client_id?.address && event.client_id?.address.length > 9
      ? event.client_id?.address.slice(0, 9) + "..."
      : event.client_id?.address || "N/A"}
  </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-2 w-24 text-sm text-center">
                  No events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Pagination */}
        <div className="pagination  flex justify-center items-center mt-8">
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

export default EnquiryReport;