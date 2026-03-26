import React, { useState, useEffect } from "react";
import axios from "axios";
import { styled } from "@mui/material/styles";
import Sidebar from "../SideBar/SideBar";
import ButtonBox from "../ButtonBox/ButtonBox";
import InputField from "../InputField/InputField";
import SelectField from "../Dropdown/SelectField";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AddPayment = ({ eventId }) => {
  const [formData, setFormData] = useState({
    advanceAmount: "",
    balanceAmount: "",
  });
  const [clientNames, setClientNames] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); // Store selected event details
  const [quotation, setQuotation] = useState({
    grand_total: "",
  });

  useEffect(() => {
    const fetchClientNames = async () => {
      try {
        const response = await axios.get(
          "https://demo.internsbee.in/api/clients"
        );
        const clients = response.data.result;
        setClientNames(clients);
      } catch (error) {
        console.error("Error fetching client names:", error);
      }
    };
    fetchClientNames();
  }, []);

  const fetchEventsByClientId = async (clientId) => {
    try {
      const response = await axios.get(
        `https://demo.internsbee.in/api/enquiry/client/${clientId}`
      );
      const eventsData = response.data.result;
  
      // Filter events to get only those with payment_status "unpaid"
      const unpaidEvents = eventsData.filter(event => event.payment_status === "unpaid");
  
      // Update state with filtered events
      setEvents(unpaidEvents);
    } catch (error) {
      console.error("Error fetching events for client:", error);
    }
  };
  

  const fetchQuotationDetails = async (eventId) => {
    try {
      const response = await axios.get(
        `https://demo.internsbee.in/api/quotation/enquiry/${eventId}`
      );
      const eventDetails = response.data.quotation.enquiry_id;
      setSelectedEvent(eventDetails); // Store selected event details in state
      setQuotation({
        grand_total: response.data.quotation.grand_total,
      });
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let newBalance = parseFloat(formData.balanceAmount) || 0; // Ensure newBalance is a number

    if (name === "advanceAmount") {
      // Restrict negative values
      const advanceAmount = parseFloat(value) || 0; // Default to 0 if value is not a valid number
  
      if (advanceAmount < 0) {
        alert("Advance amount cannot be negative.");
        return; // Exit if the value is negative
      }
      const grandTotal = parseFloat(quotation.grand_total) || 0; 
  

      if (!isNaN(advanceAmount)) {
        newBalance = grandTotal - advanceAmount;
        if (newBalance < 0) {
          alert("Advance amount cannot be greater than the total amount.");
          newBalance = 0;
        }
      }
    }

    setFormData({
      ...formData,
      [name]: value,
      balanceAmount: newBalance.toFixed(2), // Ensure toFixed is called on a number
    });
  };

  const handleClientChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      clientName: value,
    });
    const selectedClient = clientNames.find(
      (client) => client.full_name === value
    );
    if (selectedClient) {
      fetchEventsByClientId(selectedClient._id);
    }
  };

  const handleEventChange = (e) => {
    const eventId = e.target.value;
    if (eventId) {
      fetchQuotationDetails(eventId); // Fetch quotation details for the selected event
    }
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const selectedEnquiryId = selectedEvent?._id;
    const advanceAmount = parseFloat(formData.advanceAmount);
    const balanceAmount = parseFloat(formData.balanceAmount);
    const grandTotal = parseFloat(quotation.grand_total) || 0;
  
    // Validation: Ensure that advance amount is not greater than the total amount
    if (advanceAmount > grandTotal) {
      alert("Advance amount cannot be greater than the total amount.");
      return;
    }
  
    // Validation checks for empty fields
    if (!formData.clientName) {
      alert("Please select a client.");
      return;
    }
  
    if (!selectedEvent) {
      alert("Please select an event.");
      return;
    }
  
    if (!formData.advanceAmount || isNaN(advanceAmount)) {
      alert("Please enter a valid advance amount.");
      return;
    }
  
    if (balanceAmount < 0) {
      alert(
        "Balance amount cannot be negative. Please adjust the advance amount."
      );
      return;
    }
  
    const paymentData = {
      enquiry: selectedEnquiryId,
      advance_amount: advanceAmount,
      balance_amount: balanceAmount,
      grand_total: grandTotal
    };
  
    try {
      const response = await axios.post(
        "https://demo.internsbee.in/api/advancepayment/add",
        paymentData
      );
      alert("Advance Payment added successfully!");
  
     // Clear all form fields after successful submission
    setFormData({
      clientName: "", // Reset clientName field
      advanceAmount: "",
      balanceAmount: "",
      
    });
      setEvents([]);
      setSelectedEvent(null);
      setQuotation({
        grand_total: "",
      });
    } catch (error) {
      console.error("Error submitting payment:", error);
      alert("Failed to add payment.");
    }
  };
  
  

  return (
    <div className="w-full h-screen max-w-3xl px-4 mx-auto">
    <h1 className="text-4xl font-bold mb-7 text-center ">Add Payment</h1>
      <form className="w-full">
      <div className="flex flex-col gap-7 md:flex-row md:space-x-4 mt-7 mb-4">
      <SelectField
        id="clientName"
        name="clientName"
        label="Client Name"
        value={formData.clientName}
        onChange={handleClientChange}
        options={clientNames.map(client => ({ label: client.full_name, value: client.full_name }))}
        required
      />
      
      <SelectField
        id="eventName"
        name="eventName"
        label="Event Name"
        value={formData.eventName}
        onChange={handleEventChange}
        options={events.map(event => ({ label: event.event_name, value: event._id }))}
        required
      />
    </div>
        {/* Display selected event details if available */}
        {selectedEvent && (
          <>
            <div className="flex flex-col gap-7 md:flex-row md:space-x-4 mt-7 mb-4">
              <InputField
                type="date"
                id="event_date"
                name="event_date"
                label="Event Date"
                value={
                  new Date(selectedEvent.event_date)
                    .toISOString()
                    .split("T")[0]
                } // Convert event date to "YYYY-MM-DD"
                className="border rounded w-full p-2"
                readOnly
              />
              <InputField
                type="text"
                label="Event Venue"
                id="event_venue"
                name="event_venue"
                value={selectedEvent.event_venue}
                className="border rounded w-full p-2"
                readOnly
                placeholder="Event Venue"
              />
            </div>
            <div className="flex flex-col gap-7 md:flex-row md:space-x-4 mt-7 mb-4">
              <InputField
                type="number"
                id="totalAmount"
                name="grand_total"
                label="Total Amount"
                value={quotation.grand_total}
                className="border rounded w-full p-2"
                placeholder="Total Amount"
                readOnly
              />
              <InputField
                type="number"
                id="advanceAmount"
                name="advanceAmount"
                label="Advance Amount"
                value={formData.advanceAmount}
                onChange={handleInputChange}
                className="border rounded w-full p-2"
                placeholder="Advance Amount"
              />
            </div>
            <div className="flex flex-col gap-7 md:flex-row md:space-x-4 mt-7 mb-4">
              <InputField
                label="Pending Amount"
                type="number"
                id="balanceAmount"
                name="balanceAmount"
                value={formData.balanceAmount}
                className="border rounded w-full p-2"
                readOnly
                placeholder="Pending Amount"
              />
            </div>
          </>
        )}

        <div className="flex justify-end">
          <ButtonBox
            label="Save"
            onClick={handleSubmit}
            className="bg-red-400 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full"
          />
        </div>
      </form>
    </div>
  );
};

export default AddPayment;
