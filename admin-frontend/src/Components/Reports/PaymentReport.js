import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import "./EventReport.css";
import ButtonBox from "../ButtonBox/ButtonBox";
import DatePicker from "react-datepicker";
import { FaChevronLeft, FaChevronRight,FaCalendarAlt } from "react-icons/fa";
// Helper function to format the date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (!isNaN(date)) {
    return date.toLocaleDateString("en-GB"); // Formats to "dd/MM/yyyy"
  }
  return "Invalid Date";
};

const PaymentReport = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 4;
  // Fetch payment data from API
  const fetchPayments = async () => {
    try {
      const response = await axios.get(
        "https://demo.internsbee.in/api/advancepayment"
      );
      setPayments(response.data.data);
      setFilteredPayments(response.data.data); // Initialize with all data
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Filter logic for search, start date, and end date
  useEffect(() => {
    applyFilters();
  }, [searchTerm, startDate, endDate]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const applyFilters = () => {
    let filtered = payments;
  
    // Filter by search term (client name or event name)
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (payment) =>
          payment.enquiry?.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.enquiry?.event_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  
    // Filter by start date ("From")
    if (startDate) {
      const start = new Date(startDate.setHours(0, 0, 0, 0));
      filtered = filtered.filter((payment) => {
        const eventDate = payment.enquiry?.event_date
          ? new Date(payment.enquiry.event_date)
          : null;
        return eventDate && !isNaN(eventDate) && eventDate >= start;
      });
    }

    // Filter by end date ("To")
    if (endDate) {
      const end = new Date(endDate.setHours(23, 59, 59, 999));
      filtered = filtered.filter((payment) => {
        const eventDate = payment.enquiry?.event_date
          ? new Date(payment.enquiry.event_date)
          : null;
        return eventDate && !isNaN(eventDate) && eventDate <= end;
      });
    }

    setFilteredPayments(filtered);
  };

  // Export to Excel functionality
  const handleExportToExcel = () => {
    const exportData = filteredPayments.map((payment, index) => ({
      "Sr.No": index + 1,
      "Client Name": payment.enquiry?.client_id?.full_name,
      "Event Name": payment.enquiry?.event_name,
      "Event Date": formatDate(payment.enquiry?.event_date),
      "Payment Date": formatDate(payment.payment_date),
      "Total Amount": payment.quotation.grand_total,
      "Advance Amount": payment.advance_amount,
      "Pending Amount": payment.balance_amount,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    worksheet["!cols"] = [
      { wch: 5 },
      { wch: 20 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "PaymentReport");

    XLSX.writeFile(workbook, "Payment_Report.xlsx");
  };
  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };
  const totalPages = Math.ceil(filteredPayments.length / entriesPerPage);

   // Slice the filteredPayments based on the current page
   const paginatedEnquiries = filteredPayments
   .slice()
   .reverse() // Reverses the order of the array
   .slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);
   
  return (
    <>
      <div className="w-full  px-4 eventreport-content">
        <div className="flex justify-center items-center w-full mb-6">
          <h2 className="text-4xl font-bold text-black mx-3">
            Payment Reports
          </h2>
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
            <p className="mr-4">Total payments: {filteredPayments.length}</p>
            {/* <button
              className="p-2 bg-blue-800 hover:bg-blue-400 text-white font-bold py-3 px-8 rounded-full"
              onClick={handleExportToExcel}
            >
              Export to Excel
            </button> */}
            <ButtonBox
                  label="Export to Excel"
                  className=" text-white w-full py-2 pl-10 pr-4 rounded border mr-2"
                  onClick={handleExportToExcel}
                />
          </div>
        </div>

        <div className="overflow-x-auto w-full mt-4">
          <table className="min-w-full border border-gray-300 rounded-lg">
            <thead className="rounded-2xl">
              <tr className="flex justify-between relative border border-gray-300 rounded-lg mb-1 bg-white w-full">
                <th className="px-3    w-36 py-2 text-left text-3xs font-bold text-black uppercase tracking-wider">
                  Sr.No
                </th>
                <th className="px-3    w-36 py-2 text-left text-3xs font-bold text-black uppercase tracking-wider">
                  Client Name
                </th>
                <th className="px-3    w-36 py-2 text-left text-3xs font-bold text-black uppercase tracking-wider">
                  Event Name
                </th>
                <th className="px-3    w-36 py-2 text-left text-3xs font-bold text-black uppercase tracking-wider">
                  Event Date
                </th>
                <th className="px-3    w-36 py-2 text-left text-3xs font-bold text-black uppercase tracking-wider">
                  Payment Date
                </th>
                <th className="px-3    w-36 py-2 text-left text-3xs font-bold text-black uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-3    w-36 py-2 text-left text-3xs font-bold text-black uppercase tracking-wider">
                  Advance Amount
                </th>
                <th className="px-3    w-36 py-2 text-left text-3xs font-bold text-black uppercase tracking-wider">
                  Pending Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedEnquiries.length > 0 ? (
                paginatedEnquiries.map((item, index) => (
                  <tr
                    key={item._id}
                    className="flex relative justify-between w-full border border-gray-300 rounded-lg mb-1 bg-white hover:bg-blue-300 hover:scale-[1.02] hover:-translate-y-1 hover:border-blue-400 transition-all duration-300"
                  >
                    <td className="px-3    w-36 py-2 text-left text-2xs font-medium text-black tracking-wider">
                      {index + 1 + (currentPage - 1) * entriesPerPage}{" "}
                      {/* Adjusted for pagination */}
                    </td>
                    <td className="px-3    w-36 py-2 text-left text-2xs font-medium text-black tracking-wider">
                      {/* {item.enquiry?.client_id?.full_name} */}
                      <span title={item.enquiry?.client_id?.full_name || "N/A"}>
    {item.enquiry?.client_id?.full_name && item.enquiry?.client_id?.full_name.length > 11
      ? item.enquiry?.client_id?.full_name.slice(0, 11) + "..."
      :item.enquiry?.client_id?.full_name || "N/A"}
  </span>

                    </td>
                    <td className="px-3    w-36 py-2 text-left text-2xs font-medium text-black tracking-wider">
                      {/* {item.enquiry?.event_name} */}
                      <span title={item.enquiry?.event_name || "N/A"}>
    {item.enquiry?.event_name && item.enquiry?.event_name.length > 11
      ? item.enquiry?.event_name.slice(0, 11) + "..."
      :item.enquiry?.event_name || "N/A"}
  </span>
                    </td>
                    <td className="px-3    w-36 py-2 text-left text-2xs font-medium text-black tracking-wider">
                      {formatDate(item.enquiry?.event_date)}
                    </td>
                    <td className="px-3    w-36 py-2 text-left text-2xs font-medium text-black tracking-wider">
                      {formatDate(item.payment_date)}
                    </td>
                    <td className="px-3    w-36 py-2 text-left text-2xs font-medium text-black tracking-wider">
                      {item.quotation.grand_total}
                    </td>
                    <td className="px-3    w-36 py-2 text-left text-2xs font-medium text-black tracking-wider">
                      {item.advance_amount}
                    </td>
                    <td className="px-3    w-36 py-2 text-left text-2xs font-medium text-black tracking-wider">
                      {item.balance_amount}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6   py-2 text-center">
                    No payments found.
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
    </>
  );
};

export default PaymentReport;