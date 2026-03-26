import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ViewClient.css";
import { useNavigate } from "react-router-dom";
import {
  FaEye,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import SearchInput from "../SearchInput/SearchInput";
import { MdOutlineModeEditOutline } from "react-icons/md";
import ClientEditModal from "./ClientEditModal";


const ViewClient = () => {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 6;

  // Fetch all clients on component mount
  useEffect(() => {
    axios
      .get("https://demo.internsbee.in/api/clients")
      .then((response) => {
        setClients(response.data.result.reverse()); // Reverse the data to show the most recent clients first
      })
      .catch((error) => {
        console.error("Error fetching clients:", error);
      });
  }, []);


  // Navigate to individual client details page
  const viewClientDetails = (clientId) => {
    navigate(`/client/${clientId}`);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to the first page on search
  };

  // Filter and paginate the clients data
  const filteredClients = clients.filter((client) =>
    client.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredClients.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

  const totalPages = Math.ceil(filteredClients.length / entriesPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };
  // Open modal and set the selected client data
  const handleEditClick = (client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedClient(null);
  };

  // Save the updated client data
  const handleSaveClient = (updatedClient) => {
    // Ensure the client ID is available
    if (!updatedClient._id) {
      console.error("Client ID is missing.");
      return;
    }

    // Use the correct endpoint to update the client with a PATCH request
    axios
      .patch(`https://demo.internsbee.in/api/clients/${updatedClient._id}`, updatedClient)
      .then((response) => {
        setClients((prevClients) =>
          prevClients.map((client) =>
            client._id === updatedClient._id ? { ...client, ...updatedClient } : client
          )
        );
        handleCloseModal(); // Close the modal after saving
        alert("Client details updated successfully!"); // Show alert on success
      })
      .catch((error) => {
        console.error("Error updating client:", error.response?.data || error.message);
      });
  };



  return (
    <div className="w-full px-4 clientdetails">
      <div className="flex justify-between mb-10 mt-5">
        <div className="flex justify-center items-center mt-7 w-full">
          <h2 className="text-2xl sm:text-4xl font-bold text-black ">View Client</h2>
        </div>

        <div className="flex justify-center items-center sm:flex-row w-full">
          <div className="w-full mt-2 sm:w-auto">
            <SearchInput
              placeholder="Search by Name"
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>
      {/* <div className="flex flex-col sm:flex-row items-center ml-4 justify-center gap-4 mt-4 sm:mt-0">
          <div className="w-full sm:w-auto max-w-xs">
            <label className="block text-lg font-medium text-gray-800 mb-2">From</label>
            <div className="relative w-full max-w-md">
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

          <div className="w-full sm:w-auto max-w-xs">
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
        </div> */}


      <div className="overflow-x-auto w-full mt-4">
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="rounded-2xl">
            <tr className="flex justify-between relative border border-gray-300 rounded-lg mb-1 bg-white w-full">
              <th className="px-3 py-2 w-2 text-left text-4xs font-bold text-black uppercase tracking-wider">Sr.No</th>
              <th className="px-3 py-2 w-40 text-left text-4xs font-bold text-black uppercase tracking-wider">Name</th>
              <th className="px-3 py-2 w-36 text-left text-4xs font-bold text-black uppercase tracking-wider">Email ID</th>
              <th className="px-3 py-2 w-36 text-left text-4xs font-bold text-black uppercase tracking-wider">Contact No.</th>
              <th className="px-3 py-2 w-32 text-left text-4xs font-bold text-black uppercase tracking-wider">Actions</th>
              <th className="px-3 py-2 w-32 text-left text-4xs font-bold text-black uppercase tracking-wider">Edit</th>
            </tr>
          </thead>
          <tbody className="relative">
            {clients.length <= 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">No data available</td>
              </tr>
            ) : (
              currentEntries.map((client, index) => (
                <tr
                  key={client._id}
                  className="flex relative justify-between w-full border border-gray-300 rounded-lg mb-1 bg-white hover:bg-blue-300 hover:scale-[1.02] hover:-translate-y-1 hover:border-blue-400 transition-all duration-300"
                >
                  <td className="px-3 py-2 w-2 text-left text-2xs font-medium text-black tracking-wider">
                    {(currentPage - 1) * entriesPerPage + index + 1}
                  </td>

                  <td className=" px-3  w-40 py-2 text-left text-2xs font-medium text-black tracking-wider">
                    <span title={client.full_name}>
                      {(client.full_name)?.length > 10
                        ? (client.full_name).slice(
                          0,
                          10
                        ) + "..."
                        : client.full_name}
                    </span>
                  </td>

                  <td className=" px-3  w-36 py-2 text-left text-2xs font-medium text-black tracking-wider">
                    <span title={client.email}>
                      {(client.email)?.length > 10
                        ? (client.email).slice(
                          0,
                          10
                        ) + "..."
                        : client.email}
                    </span>
                  </td>
                  <td className="px-3 py-2 w-36 text-left text-2xs font-medium text-black tracking-wider">
                    {client.contact_number}
                  </td>
                  <td className="px-3 py-2 w-32 ml-4 text-left text-2xs font-medium text-black tracking-wider">
                    <button
                      onClick={() => viewClientDetails(client._id)}
                      className="flex items-center justify-center bg-blue-800 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                    >
                      <FaEye className="text-lg" />
                    </button>
                  </td>
                  <td className="px-3 py-2 w-32 text-left text-2xs font-medium text-black tracking-wider">
                    <button onClick={() => handleEditClick(client)} className="bg-blue-800 text-white px-2 py-1 rounded">
                      <MdOutlineModeEditOutline size={20} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Edit Client Modal */}
      <div>
        <ClientEditModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          clientData={selectedClient}
          onSave={handleSaveClient}
        />
      </div>
      {/* Pagination Controls */}
      {filteredClients.length > entriesPerPage && (
        <div className="pagination flex justify-center items-center py-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-button px-4 py-2 bg-gray-200 text-gray-600 rounded-l hover:bg-gray-300 disabled:opacity-50"
          >
            <FaChevronLeft />
          </button>
          <span className="pagination-info mx-2">
            {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-button px-4 py-2 bg-gray-200 text-gray-600 rounded-r hover:bg-gray-300 disabled:opacity-50"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewClient;
