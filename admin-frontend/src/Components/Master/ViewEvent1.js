import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ViewEvent1.css";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import SearchInput from "../SearchInput/SearchInput";
import { styled } from "@mui/material/styles";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const ViewEvent1 = () => {
  const [searchText, setSearchText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({ event_name: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 5;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://demo.internsbee.in/api/event");
        console.log(response.data);
        setData(Array.isArray(response.data) ? response.data.reverse() : response.data.event.reverse() || []);
      } catch (error) {
        console.error("Error fetching events:", error);
        alert("Failed to load events. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setFormData({ event_name: event.event_name });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      await axios.patch(`https://demo.internsbee.in/api/event/update/${selectedEvent._id}`, formData);
      setData((prevData) =>
        prevData.map((event) =>
          event._id === selectedEvent._id ? { ...event, ...formData } : event
        )
      );
      setShowModal(false);
      alert("Event updated successfully!");
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Failed to update event. Please try again.");
    }
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
  };

  const filteredData = Array.isArray(data)
    ? data.filter((event) =>
        event.event_name.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleDelete = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`https://demo.internsbee.in/api/event/delete/${eventId}`);
        setData((prevData) => prevData.filter((event) => event._id !== eventId));
        alert("Event deleted successfully!");
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Failed to delete event. Please try again.");
      }
    }
  };

  return (
    <>
      <div className="w-full h-full px-4 event-content">
        <div className="flex flex-col md:flex-row items-center justify-between p-4 space-y-4 md:space-y-0">
          <h1 className="text-4xl font-bold text-center">View Events</h1>
          <div className="w-full md:w-1/2 lg:w-1/3">
            <SearchInput
              placeholder="Search"
              onChange={handleSearchChange}
              value={searchText}
              style={{ width: "100%" }}
              className="border border-gray-300 rounded-lg p-2"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <div className="overflow-x-auto w-full mt-4">
              <table className="min-w-full border border-gray-300 rounded-lg">
                <thead className="rounded-2xl">
                  <tr className="flex justify-between relative border border-gray-300 rounded-lg mb-1 bg-white w-full">
                    <th className="px-6 w-12 py-2 text-left text-4xs font-bold text-black uppercase tracking-wider">Sr.No</th>
                    <th className="px-6 w-36 py-2 text-left text-4xs font-bold text-black uppercase tracking-wider">Event Name</th>
                    <th className="px-6 w-24 py-2 text-left text-4xs font-bold text-black uppercase tracking-wider">View</th>
                    <th className="px-6 w-24 py-2 text-left text-4xs font-bold text-black uppercase tracking-wider">Delete</th>
                  </tr>
                </thead>
                {filteredData.length <= 0 ? (
                  <tbody className="relative">
                    <tr>
                      <td colSpan="4" className="text-center py-4">No data available</td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody className="relative">
                    {currentEntries.map((event, index) => (
                      <tr key={event._id} className="flex relative justify-between w-full border border-gray-300 rounded-lg mb-1 bg-white hover:bg-blue-300 transition-all duration-300">
                        <td className="px-6 w-12 py-2 text-left text-2xs font-medium text-black uppercase tracking-wider">
                          {(currentPage - 1) * entriesPerPage + index + 1}
                        </td>
                        <td className="px-6 w-36 py-2 text-left text-2xs font-medium text-black tracking-wider">{event.event_name}</td>
                        <td className="px-6 w-36 py-4 text-sm font-medium flex gap-2">
                          <button onClick={() => handleEdit(event)} className="flex items-center justify-center bg-blue-800 hover:bg-blue-900 text-white py-1 px-2 rounded">
                            <MdOutlineModeEditOutline size={20} />
                          </button>
                        </td>
                        <td className="px-6 w-36 py-2 text-left text-2xs font-medium text-black tracking-wider">
                          <button onClick={() => handleDelete(event._id)} className="flex items-center justify-center bg-red-500 hover:bg-red-400 text-white py-1 px-2 rounded">
                            <RiDeleteBin6Line size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="pagination flex justify-center items-center mt-4">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="pagination-button">
            <FaChevronLeft />
          </button>
          <span className="pagination-info mx-2">{currentPage} of {totalPages}</span>
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="pagination-button">
            <FaChevronRight />
          </button>
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Event Details</h2>
            <div className="modal-body">
              <label>
                Event Name:
                <input
                  type="text"
                  name="event_name"
                  value={formData.event_name}
                  onChange={handleInputChange}
                />
              </label>
            </div>
            <div className="modal-footer">
              <button className="save-button" onClick={handleSaveChanges}>
                Save
              </button>
              <button className="cancel-button" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewEvent1;
