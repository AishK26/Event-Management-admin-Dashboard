import React, { useState, useEffect } from "react";
import ButtonBox from "../ButtonBox/ButtonBox";
import InputField from "../InputField/InputField";
import DatePickerInput from "../DatePickerInput/DatePickerInput";
import { useNavigate } from "react-router-dom";
import "./Enquiry.css";
import axios from "axios";
import SelectField from "../Dropdown/SelectField";

const AddEnquiry = () => {
  const [enquiry, setEnquiry] = useState({
    client_id: "",
    client_name: "",
    email: "",
    contact: "",
    address: "",
    event_name: "",
    event_budget: "",
    guest_quantity: "",
    event_venue: "",
  });
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedClientData, setSelectedClientData] = useState(null);
  const [eventDate, setEventDate] = useState(null);
  const [errors, setErrors] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch clients on mount
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(
          `https://demo.internsbee.in/api/clients/`
        );
        setClients(response.data.result || []);
      } catch (error) {
        console.error(
          "Error fetching clients:",
          error.response?.data || error.message
        );
        setClients([]);
      }
    };
    fetchClients();
  }, []);

  useEffect(() => {
    if (selectedClientId) {
      const fetchClientData = async () => {
        try {
          const response = await axios.get(
            `https://demo.internsbee.in/api/clients/${selectedClientId}`
          );
          const clientData = response.data.result;
          setSelectedClientData(clientData);
          setEnquiry((prevEnquiry) => ({
            ...prevEnquiry,
            client_id: clientData._id || "",
            client_name: clientData.full_name || "",
            email: clientData.email || "",
            contact: clientData.contact_number || "",
            address: clientData.address || "",
          }));
        } catch (error) {
          console.error(
            "Error fetching client data:",
            error.response?.data || error.message
          );
          setSelectedClientData(null);
        }
      };
      fetchClientData();
    }
  }, [selectedClientId]);

  const handleClientChange = (event) => {
    setSelectedClientId(event.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Allow empty string to be set if the user deletes all characters
    if (value === "") {
      setEnquiry({
        ...enquiry,
        [name]: value,
      });
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: null, // Clear error on empty input
      }));
      return;
    }

    // Convert value to number for validation
    const numericValue = parseFloat(value);

    // Check for non-positive values for event_budget and guest_quantity
    if ((name === "event_budget" || name === "guest_quantity") && (numericValue <= 0)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: `${name === "event_budget" ? "Event budget" : "Guest quantity"} must be greater than 0`,
      }));
      return;
    }

    // Update enquiry state
    setEnquiry({
      ...enquiry,
      [name]: value,
    });

    // Clear any previous errors when valid input is detected
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: null,
    }));
  };



  const handleDateChange = (date) => {
    setEventDate(date);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formattedDate = eventDate
      ? new Date(eventDate.getTime() - eventDate.getTimezoneOffset() * 60000)
        .toISOString()
        .split("T")[0]
      : null;

    const enquiryData = {
      ...enquiry,
      event_date: formattedDate,
    };

    try {
      const response = await axios.post(
        "https://demo.internsbee.in/api/enquiry/add",
        enquiryData
      );

      // Show success alert
      alert("Enquiry created successfully.");

      // Clear the form fields
      setEnquiry({
        client_id: "",
        client_name: "", // Clear client name
        email: "",
        contact: "",
        address: "",
        event_name: "", // Clear event name
        event_budget: "",
        guest_quantity: "",
        event_venue: "",
      });

      // Clear selected client and event name
      setSelectedClientId(""); // Reset selected client ID
      setSelectedClientData(null); // Clear selected client data
      setEventDate(null); // Reset event date
      setErrors({}); // Clear errors
    } catch (error) {
      console.error("Error creating enquiry:", error.response?.data || error.message);
      alert("Failed to create enquiry.");
    }
  };



  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://demo.internsbee.in/api/event"
        );
        if (Array.isArray(response.data)) {
          setData(response.data);
        } else if (response.data.event) {
          setData(response.data.event);
        } else {
          setData([]);
        }
      } catch (error) {
        alert("Failed to load events. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleViewEnquiry = () => {
    navigate("/viewenquiry");
  };

  const validate = () => {
    let tempErrors = {};
    if (!String(enquiry.client_name).trim())
      tempErrors.client_name = "Client name is required";
    if (!String(enquiry.email).trim()) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(enquiry.email)) {
      tempErrors.email = "Email is not valid";
    }
    if (!String(enquiry.contact).trim()) {
      tempErrors.contact = "Contact number is required";
    } else if (String(enquiry.contact).length !== 10) {
      tempErrors.contact = "Contact number must be 10 digits";
    }
    if (!String(enquiry.address).trim())
      tempErrors.address = "Address is required";
    if (!String(enquiry.event_name).trim())
      tempErrors.event_name = "Event name is required";

    // Check for event_budget and guest_quantity
    const eventBudget = parseFloat(enquiry.event_budget);
    const guestQuantity = parseFloat(enquiry.guest_quantity);

    if (!String(enquiry.event_budget).trim() || isNaN(eventBudget) || eventBudget <= 0) {
      tempErrors.event_budget = "Valid event budget greater than 0 is required";
    }
    if (!String(enquiry.guest_quantity).trim() || isNaN(guestQuantity) || guestQuantity <= 0) {
      tempErrors.guest_quantity = "Valid guest quantity greater than 0 is required";
    }

    if (!String(enquiry.event_venue).trim())
      tempErrors.event_venue = "Event venue is required";
    if (!eventDate) tempErrors.event_date = "Event date is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };


  return (
    <div className="w-full max-w-3xl h-screen px-4">
      <h1 className="text-4xl font-bold mb-7 text-center">Add Enquiry</h1>
      <form className="w-full" onSubmit={handleSubmit}>
        <div className="flex justify-center gap-6 md:flex-row md:space-x-4 mb-4">
          <div className="w-full max-w-md mx-auto">
            <SelectField
              id="client"
              name="client_id"
              label="Client Name"
              value={selectedClientId || ""} // Set to empty string if no selection
              onChange={handleClientChange}
              options={clients.map((client) => ({
                value: client._id,
                label: client.full_name,
              }))}
              required
            />
          
          </div>

          {selectedClientData && (
            <InputField
              label="Address"
              name="address"
              type="text"
              value={selectedClientData.address}
              readOnly
            />
          )}
        </div>

        {selectedClientData && (
          <div className="flex flex-col gap-7 md:flex-row md:space-x-4 mb-4">
            <InputField
              label="Contact Number"
              name="contact"
              type="number"
              value={selectedClientData.contact_number || ""}
              readOnly
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              value={selectedClientData.email || ""}
              readOnly
            />
          </div>
        )}

        <div className="flex flex-col gap-7 md:flex-row md:space-x-4 mb-4">
          <div className="w-full max-w-md mx-auto">
            <SelectField
              id="event"
              name="event_name"
              label="Event Name"
              value={enquiry.event_name || ""} // Ensure it starts as empty after submission
              onChange={handleChange}
              options={data.map((event) => ({
                value: event.event_name,
                label: event.event_name,
              }))}
              required
            />


          </div>

          <InputField
            label="Event Venue"
            name="event_venue"
            type="text"
            value={enquiry.event_venue}
            onChange={handleChange}
            error={errors.event_venue}
            required
          />
        </div>

        <div className="flex flex-col gap-7 md:flex-row md:space-x-4 mb-4">
          <InputField
            label="Event Budget"
            name="event_budget"
            type="number" 
            value={enquiry.event_budget}
            onChange={handleChange}
            error={errors.event_budget}
            required
          />
          <InputField
            label="Guest Quantity"
            name="guest_quantity"
            type="number" 
            value={enquiry.guest_quantity}
            onChange={handleChange}
            error={errors.guest_quantity}
            required
          />
        </div>

        <div className=" md:flex-row md:space-x-4 mb-4">
          <DatePickerInput
            label="Event Date"
            selectedDate={eventDate}
            onDateChange={handleDateChange} // Correctly passing the handler
            error={errors.event_date}
            required
          />

        </div>

        <div className="flex justify-center mb-7">
          <ButtonBox

            label="Add Enquiry"
            type="submit"
          />

        </div>
      </form>
    </div>
  );
};

export default AddEnquiry;
