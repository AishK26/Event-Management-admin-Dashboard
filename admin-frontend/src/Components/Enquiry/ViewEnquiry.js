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
import Modal from "react-modal";
import { getEnquiries, updateEnquiry } from "../../Services/Enquiry";
import { useNavigate } from "react-router-dom";
import ButtonBox from "./../ButtonBox/ButtonBox";
import "./Enquiry.css";
import InputField from './../InputField/InputField';


Modal.setAppElement("#root");

const ViewEnquiry = () => {
  const [enquiryDetails, setEnquiryDetails] = useState({
    id: "",
    client_name: "",
    contact_number: "",
    email: "",
    event_name: "",
    event_date: "",
    event_budget: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [enquiries, setEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 4;
  const [editMode, setEditMode] = useState(false);
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

    setFilteredEnquiries(filtered);
    setCurrentPage(1);
  };
  const fetchEnquiries = async () => {
    try {
      const response = await getEnquiries();
      // Reverse the data here to display the latest enquiries first
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


  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEnquiry(null);
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


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEnquiryDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const openModal = (enquiry) => {
    setSelectedEnquiry(enquiry);

    setEnquiryDetails({
      id: enquiry._id,
      client_name: enquiry.client_id?.full_name,
      contact_number: enquiry.client_id?.contact_number,
      email: enquiry.client_id?.email,
      event_name: enquiry.event_name,
      event_date: enquiry.event_date ? new Date(enquiry.event_date).toISOString().split('T')[0] : "",
      event_budget: enquiry.event_budget,
    });

    setIsModalOpen(true);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const saveChanges = async () => {
    // Validate input fields
    if (!enquiryDetails.client_name || !enquiryDetails.contact_number || !enquiryDetails.email ||
      !enquiryDetails.event_name || !enquiryDetails.event_date || !enquiryDetails.event_budget) {
      alert("Please fill all fields.");
      return;
    }

    // Validate contact number
    if (enquiryDetails.contact_number.length < 10 || enquiryDetails.contact_number.length > 10) {
      alert("Contact number must be exactly 10 digits.");
      return;
    }

    // Validate event budget
    if (enquiryDetails.event_budget <= 0) {
      alert("Event budget must be greater than 0.");
      return;
    }

    try {
      const response = await updateEnquiry(enquiryDetails.id, enquiryDetails);
      alert("Enquiry updated successfully");
      setEditMode(false);
      closeModal();
      await fetchEnquiries();
    } catch (error) {
      console.error("Error updating Enquiry", error);
    }
  };


  // Handle name, email, contact, Account No.,ifsc code input validations
  const handleCharInput = (e) => {
    e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
  };

  const handleContactNumberInput = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length > 10) {
      e.target.value = value.slice(0, 10);
    } else {
      e.target.value = value;
    }
  };
  const handleEmailInput = (e) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(e.target.value)) {
      e.target.setCustomValidity("Please enter a valid email address");
    } else {
      e.target.setCustomValidity("");
    }
  };

  return (

    <div className="w-full px-4 view-enquiry">
      <div className="flex justify-center items-center w-full">
        <h1 className="text-4xl font-bold text-center ">View Enquiry</h1>
      </div>

      <div className="flex flex-col md:flex-row justify-between w-full gap-10 md:gap-28 mt-6">
        <div className="mt-3 w-full">
          <SearchInput
            placeholder="Search client or event name"
            onChange={handleSearchChange}
            className="w-full"
          />
        </div>

        <div className="w-full flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
          <div className="w-full md:max-w-xs">
            <label className="block text-lg font-medium text-gray-800 mb-2">From</label>
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
            <label className="block text-lg font-medium text-gray-800 mb-2">To</label>
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


      <div className="overflow-x-auto w-full mt-8 viewenquiry-tabel">
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="rounded-2xl">
            <tr className="flex justify-between relative border border-gray-300 rounded-lg mb-1 bg-white w-full">
              <th className=" px-3    w-16 py-2   textbold text-black uppercase tracking-wider">
                Sr.No
              </th>
              <th className=" px-3  w-44 py-2 text-left text-3xs font-bold text-black uppercase tracking-wider">
                Client Name
              </th>
              <th className=" px-3    w-36 py-2 text-left text-3xs font-bold text-black uppercase tracking-wider">
                Contact
              </th>
              <th className=" px-3    w-36 py-2 text-left text-3xs font-bold text-black uppercase tracking-wider">
                Event Name
              </th>
              <th className=" px-3    w-36 py-2 text-left text-3xs font-bold text-black uppercase tracking-wider">
                Event Date
              </th>
              <th className=" px-3    w-40 py-2 text-left text-3xs font-bold text-black uppercase tracking-wider">
                Event Budget
              </th>
              <th className=" px-3    w-48 py-2 text-left text-3xs font-bold text-black uppercase tracking-wider">
                Proposal Status
              </th>
              <th className=" px-3    w-36 py-2 text-left text-3xs font-bold text-black uppercase tracking-wider">
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
                  <td className=" px-3    w-10 py-2 text-2xs font-medium text-black uppercase tracking-wider">
                    {(currentPage - 1) * entriesPerPage + index + 1}
                  </td>
                  <td className=" px-3   ml-4  w-40 py-2 text-left text-2xs font-medium text-black tracking-wider">
                    <span title={enquiry.client_id?.full_name}>
                      {(enquiry.client_id?.full_name)?.length > 10
                        ? (enquiry.client_id?.full_name).slice(
                          0,
                          10
                        ) + "..."
                        : enquiry.client_id?.full_name}
                    </span>
                  </td>
                  <td className=" px-3    w-36 py-2 text-left text-2xs font-medium text-black tracking-wider">
                    {enquiry.client_id?.contact_number}
                  </td>
                  <td className=" px-3    w-36 py-2 text-left text-2xs font-medium text-black tracking-wider">

                    <span title={enquiry.event_name}>
                      {(enquiry.event_name)?.length > 10
                        ? (enquiry.event_name).slice(
                          0,
                          10
                        ) + "..."
                        : enquiry.event_name}
                    </span>
                  </td>
                  <td className=" px-3    w-40 py-2 text-left text-2xs font-medium text-black tracking-wider">
                    {enquiry.event_date
                      ? new Date(enquiry.event_date).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className=" px-3     w-40 py-2 text-left text-2xs font-medium text-black tracking-wider">
                    {enquiry.event_budget}
                  </td>
                  <td className="px-3 py-2 w-40 text-left text-2xs font-medium text-black tracking-wider">
                    <select
                      value={enquiry.status ?? "NotDone"}
                      onChange={(e) =>
                        handleStatusChange(enquiry._id, e.target.value)
                      }
                      className="bg-white border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="Not Done">Not Done</option>
                      <option value="Done">Done</option>

                    </select>
                  </td>
                  <td className=" px-3     w-36 py-2 text-left text-2xs font-medium text-black tracking-wider">
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
                <td
                  colSpan="8"
                  className=" px-3   py-2 text-center text-gray-500"
                >
                  No enquiries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="pagination  flex justify-center items-center mt-4 ">
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

        {selectedEnquiry && (
          <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Enquiry Details"
            className="modal-content fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg z-50"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
          >
            <h2 className="text-xl font-bold mb-4 flex justify-center modal-header">
              Enquiry Details
            </h2>
            <div className="flex flex-col items-center">
              <div className="w-full">
                <div className="mb-4">
                  <InputField
                    label="Client Name"
                    type="text"
                    name="client_name"
                    onInput={handleCharInput}
                    value={enquiryDetails.client_name}
                    onChange={handleInputChange}
                    className="modal-input"
                    readOnly={!editMode}
                  />
                </div>
                <div className="mb-4">
                  <InputField
                    label="Contact Number"
                    type="text"
                    name="contact_number"
                    onInput={handleContactNumberInput}
                    value={enquiryDetails.contact_number}
                    onChange={handleInputChange}
                    className="modal-input"
                    readOnly={!editMode}
                  />
                </div>
                <div className="mb-4">
                  <InputField
                    label="Email"
                    name="email"
                    value={enquiryDetails.email}
                    onChange={handleInputChange}
                    onBlur={handleEmailInput}
                    readOnly={!editMode}
                  />
                </div>
                <div className="mb-4">
                  <InputField
                    label="Event Name"
                    type="text"
                    name="event_name"
                    onInput={handleCharInput}
                    value={enquiryDetails.event_name}
                    onChange={handleInputChange}
                    className="modal-input"
                    readOnly={!editMode}
                  />
                </div>
                <div className="mb-4">
                  <InputField
                    label="Event Date"
                    type="date"
                    name="event_date"
                    value={enquiryDetails.event_date}
                    onChange={handleInputChange}
                    className="modal-input"
                    readOnly={!editMode}
                  />
                </div>
                <div className="mb-4">
                  <InputField
                    label="Event Budget"
                    type="number"
                    name="event_budget"
                    onInput={handleContactNumberInput}
                    value={enquiryDetails.event_budget}
                    onChange={handleInputChange}
                    className="modal-input"
                    readOnly={!editMode}
                  />
                </div>
              </div>

              <div className="model-buttons flex flex-col md:flex-row justify-center gap-2 mt-4">
                {editMode ? (
                  <>
                    <ButtonBox
                      label="Save"
                      onClick={saveChanges}
                      className="button-box bg-blue-600 text-white"
                    >
                      Save
                    </ButtonBox>
                    <ButtonBox
                      label="Close"
                      onClick={closeModal}
                      className="button-box bg-gray-600 text-white"
                    >
                      Cancel
                    </ButtonBox>
                  </>
                ) : (
                  <>
                    <ButtonBox
                      label="Edit"
                      onClick={toggleEditMode}
                      className="button-box bg-blue-600 text-white"
                    >
                      Edit
                    </ButtonBox>
                    <ButtonBox
                      label="Close"
                      onClick={closeModal}
                      className="button-box bg-gray-600 text-white"
                    >
                      Close
                    </ButtonBox>
                  </>
                )}
              </div>
            </div>
          </Modal>
        )}

      </div>
    </div>
  );
};

export default ViewEnquiry;
