import React, { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaEye,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaEdit,
} from "react-icons/fa";
import { styled } from "@mui/material/styles";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SearchInput from "../SearchInput/SearchInput";
import Sidebar from "../SideBar/SideBar";
import axios from "axios";
import "./ViewPayment.css";
import ButtonBox from "./../ButtonBox/ButtonBox";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const ViewPayment = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 4;
  const [selectedEdit, setSelectedEdit] = useState(null); 
  const [balanceAmountToPay, setBalanceAmountToPay] = useState(""); 
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchPayments = async () => {
    try {
      const response = await axios.get(
        "https://demo.internsbee.in/api/advancepayment"
      );
       // Reverse the array so that the newest payment comes first
    const reversedPayments = response.data.data.reverse();

    setPayments(reversedPayments);
    setFilteredPayments(reversedPayments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      alert("Failed to fetch payments. Please try again later.");
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, startDate, endDate, payments]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const applyFilters = () => {
    let filtered = payments;

    if (startDate) {
      filtered = filtered.filter(
        (payment) => new Date(payment.payment_date) >= startDate
      );
    }
    if (endDate) {
      filtered = filtered.filter(
        (payment) => new Date(payment.payment_date) <= endDate
      );
    }
    if (searchTerm) {
      filtered = filtered.filter(
        (payment) =>
          payment.enquiry?.client_id?.full_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          payment.enquiry?.event_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPayments(filtered);
    setCurrentPage(1); // Reset to first page after filters are applied
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredPayments.length / entriesPerPage);
  const indexOfLastPayment = currentPage * entriesPerPage;
  const indexOfFirstPayment = indexOfLastPayment - entriesPerPage;
  const currentPayments = filteredPayments.slice(
    indexOfFirstPayment,
    indexOfLastPayment
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleViewMore = (details) => {
    setSelectedDetails(details);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedDetails(null);
  };

  // Function to close the edit modal
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedEdit(null);
    setBalanceAmountToPay("");
  };

  // Edit Payment functionality
  const handleEditPayment = (payment) => {
    setSelectedEdit(payment);
    setBalanceAmountToPay(payment.balance_amount.toFixed(2));
    setShowEditModal(true);
  };

  const handlePayBalance = async () => {
    const amountToPay = parseFloat(balanceAmountToPay);

    // Validate if the entered amount is a valid number
    if (isNaN(amountToPay)) {
        alert("Please enter a valid number for the amount to pay.");
        return;
    }

    // Validate the amount is greater than 0 and does not exceed the remaining balance
    if (amountToPay <= 0 || amountToPay > selectedEdit.balance_amount) {
        alert(
            "Please enter a valid amount to pay. It should be greater than 0 and less than or equal to the pending amount."
        );
        return;
    }

    try {
        // Log selectedEdit to ensure correct data is being passed
        console.log("Selected Quotation ID:", selectedEdit._id);
        console.log("Balance Amount to Pay:", amountToPay);

        // Prepare the request payload
        const updatedPayment = {
            balance_amount: amountToPay,
        };

        // Make the PATCH request to the backend
        const response = await axios.patch(
            `https://demo.internsbee.in/api/quotation/paybalance/${selectedEdit._id}`,
            updatedPayment,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        // Log the response to see if it’s returning the correct data
        console.log("Response Data:", response.data);

        // Extract the updated quotation data from the response
        const updatedQuotation = response.data.quotation; 

        // Update the payments state
        const updatedPayments = payments.map((payment) =>
            payment._id === selectedEdit._id
                ? { ...payment, balance_amount: updatedQuotation.balance_amount, quotation: updatedQuotation }
                : payment
        );
        setPayments(updatedPayments);
        applyFilters();

        // Check if the payment status is now "paid"
        if (updatedQuotation.payment_status === "paid") {
            alert("Payment completed. The quotation is fully paid.");
        } else {
            alert("Remaining amount paid successfully.");
        }

        handleCloseEditModal(); // Close the modal after success
    } catch (error) {
        console.error("Error updating payment:", error);
        if (error.response) {
            if (error.response.status === 404) {
                alert("Quotation not found.");
            } else if (error.response.status === 500) {
                alert("Internal server error. Please try again.");
            } else {
                alert(`Failed to update payment: ${error.response.data.message}`);
            }
        } else {
            alert("Failed to update payment. Please try again.");
        }
    }
};

  
  

  const renderStatusBadge = (status) => {
    let color = "";
    switch (status) {
      case "paid":
        color = "bg-green-500";
        break;
      case "half-paid":
        color = "bg-yellow-500";
        break;
      case "unpaid":
        color = "bg-red-500";
        break;
      default:
        color = "bg-gray-500";
    }
    return (
      <span
        className={`text-white px-2 py-1 rounded-full text-xs font-semibold ${color}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <>
      <div className="w-full h-full px-4 vendor-content">
        <div className="flex justify-center items-center w-full mb-6">
          <h2 className="text-4xl font-bold text-black mx-3">View Payment</h2>
        </div>
        <div className="flex flex-col justify-between w-full md:flex-row">
          <div className="mt-3 w-full md:w-96">
            <SearchInput
              placeholder="Search by Name or Event"
              onChange={handleSearchChange}
              className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
            />
          </div>
          <div className="flex items-center justify-center gap-4 mt-4 md:mt-0">
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
                <th className="px-3 py-2 w-3 text-left text-bold text-black uppercase tracking-wider">
                  Sr.No
                </th>
                <th className="px-6 py-2 w-24 text-left text-4xs font-bold text-black uppercase tracking-wider">
                  Client Name
                </th>
                <th className="px-6 py-2 w-24 text-left text-4xs font-bold text-black uppercase tracking-wider">
                  Event Name
                </th>
                {/* <th className="px-6 py-2 w-24 text-left text-4xs font-bold text-black uppercase tracking-wider">
                  Event Date
                </th> */}
                <th className="px-6 py-2 w-24 text-left text-4xs font-bold text-black uppercase tracking-wider">
                  Payment Date
                </th>
                <th className="px-6 py-2 w-24 text-left text-4xs font-bold text-black uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-2 w-24 text-left text-4xs font-bold text-black uppercase tracking-wider">
                  Advance Amount
                </th>
                <th className="px-6 py-2 w-24 text-left text-4xs font-bold text-black uppercase tracking-wider">
                  Pending Amount
                </th>
                <th className="px-3 py-2 w-15 text-left text-4xs font-bold text-black uppercase tracking-wider">
                  View
                </th>
                <th className="px-3 py-2 w-15 text-left text-4xs font-bold text-black uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-2 w-24 text-left text-4xs font-bold text-black uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentPayments.map((item, index) => (
                <tr
                  key={item._id}
                  className="flex relative justify-between w-full border border-gray-300 rounded-lg mb-1 bg-white hover:bg-blue-300 hover:scale-[1.02] hover:-translate-y-1 hover:border-blue-400 transition-all duration-300"
                >
                  <td className="px-3 py-2 w-3 text-left text-2xs font-medium text-black tracking-wider">
                    {indexOfFirstPayment + index + 1}
                  </td>
                  <td className="px-6 py-2 w-24 text-left text-2xs font-medium text-black tracking-wider">
                    {item.enquiry?.client_id?.full_name}
                  </td>
                  <td className="px-6 py-2 w-24 text-left text-2xs font-medium text-black tracking-wider">
                    {item.enquiry?.event_name}
                  </td>
                  {/* <td className="px-6 py-2 w-24 text-left text-2xs font-medium text-black tracking-wider">
                    {new Date(item.enquiry?.event_date).toLocaleDateString()}
                  </td> */}
                  <td className="px-6 py-2 w-24 text-left text-2xs font-medium text-black tracking-wider">
                    {new Date(item.payment_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-2 w-24 text-left text-2xs font-medium text-black tracking-wider">
                    {item.quotation.grand_total.toFixed(2)}
                  </td>
                  <td className="px-6 py-2 w-24 text-left text-2xs font-medium text-black tracking-wider">
                    {item.advance_amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-2 w-24 text-left text-2xs font-medium text-black tracking-wider">
                    {item.balance_amount.toFixed(2)}
                  </td>
                  <td className="px-3 py-2 w-15 text-left text-2xs font-medium text-black tracking-wider">
                    <button
                      onClick={() => handleViewMore(item)}
                      className="bg-blue-800 text-white py-1 px-2 rounded"
                    >
                      <FaEye />
                    </button>
                  </td>
                  <td className="px-3 py-2 w-15 text-left text-2xs font-medium text-black tracking-wider">
                    {renderStatusBadge(item.quotation.payment_status)}
                  </td>
                  <td className="px-6 py-2 w-24 text-left text-2xs font-medium text-black tracking-wider">
                    <button
                      onClick={() => handleEditPayment(item)}
                      className="text-gray-700 hover:text-blue-700"
                    >
                      <FaEdit style={{ cursor: "pointer" }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredPayments.length > 0 && (
          <div className="pagination flex justify-center items-center mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 text-gray-600 rounded-l hover:bg-gray-300 disabled:opacity-50"
            >
              <FaChevronLeft />
            </button>
            <span className="mx-2">
              {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 text-gray-600 rounded-r hover:bg-gray-300 disabled:opacity-50"
            >
              <FaChevronRight />
            </button>
          </div>
        )}

        {/* Details Modal */}
        {showDetailsModal && selectedDetails && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
            <div
              className="bg-white rounded-lg shadow-lg w-full max-w-md py-6 px-6"
              style={{ marginLeft: "42px", maxWidth: "16rem" }}
            >
              <h3 className="text-xl font-bold mb-4 text-center">
                Payment Details
              </h3>
              <div className="p-2">
                <strong>Client Name:</strong>{" "}
                {selectedDetails.enquiry?.client_id?.full_name}
              </div>
              <div className="p-2">
                <strong>Event Name:</strong>{" "}
                {selectedDetails.enquiry.event_name}
              </div>
              <div className="p-2">
                <strong>Event Date:</strong>{" "}
                {new Date(
                  selectedDetails.enquiry.event_date
                ).toLocaleDateString()}
              </div>
              <div className="p-2">
                <strong>Payment Date:</strong>{" "}
                {new Date(selectedDetails.payment_date).toLocaleDateString()}
              </div>
              <div className="p-2">
                <strong>Advance Amount:</strong>{" "}
                {selectedDetails.advance_amount.toFixed(2)}
              </div>
              <div className="p-2">
                <strong>Pending Amount:</strong>{" "}
                {selectedDetails.balance_amount.toFixed(2)}
              </div>
              <div className="p-2">
                <strong>Total Amount:</strong>{" "}
                {selectedDetails.quotation.grand_total.toFixed(2)}
              </div>
              <div className="flex justify-center mt-4">
                <ButtonBox
                  label="Close"
                  onClick={handleCloseDetailsModal}
                  className="font-bold py-2 px-4 rounded bg-gray-500 text-white hover:bg-gray-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* Edit Payment Modal */}
        {showEditModal && selectedEdit && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
            <div
              className="bg-white rounded-lg shadow-lg w-full max-w-md py-6 px-6"
              style={{ marginLeft: "42px", maxWidth: "16rem" }}
            >
              <h3 className="text-xl font-bold mb-4 text-left">Edit Payment</h3>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Payment Date:
                </label>
                <input
                  type="text"
                  value={new Date(
                    selectedEdit.payment_date
                  ).toLocaleDateString()}
                  readOnly
                  className="w-full px-3 py-2 border rounded-md bg-gray-100 focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Remaining Amount:
                </label>
                <input
                  type="text"
                  value={selectedEdit.balance_amount.toFixed(2)}
                  readOnly
                  className="w-full px-3 py-2 border rounded-md bg-gray-100 focus:outline-none"
                />
              </div>
              <div className="mb-4">
  <label className="block text-gray-700 font-medium mb-2">
    Pay Remaining Amount:
  </label>
  <input
    type="number"
    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    min="0"
    step="0.01"
    value={balanceAmountToPay}
    onChange={(e) => setBalanceAmountToPay(e.target.value)}
    placeholder="Enter amount to pay"
    max={selectedEdit.balance_amount} // Prevent entering more than the balance
  />
</div>
              <div className="flex justify-center">
                <ButtonBox
                  label="Cancel"
                  onClick={handleCloseEditModal}
                  className="bg-gray-500 text-white font-bold py-2 px-4 rounded mr-2 hover:bg-gray-600"
                />
                <ButtonBox
                  label="Pay"
                  onClick={handlePayBalance}
                  className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ViewPayment;
