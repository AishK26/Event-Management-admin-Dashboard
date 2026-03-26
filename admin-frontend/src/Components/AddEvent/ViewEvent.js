import React, { useState, useEffect } from "react";
import axios from "axios";
import EditModal from "./EditModal"; // Import the EditModal component
import Sidebarcms from "../SidebarCms/Sidebarcms";
import "./AddEvent.css";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";

const ViewEvents = () => {
  // State to hold events data
  const [events, setEvents] = useState([]);
  // State to manage modal visibility and selected event
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        "https://demo.internsbee.in/api/landing/events"
      );
      setEvents(response.data); // Assuming response.data is an array of events
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };
  // Fetch data from API
  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle deletion of an event
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(
          `https://demo.internsbee.in/api/landing/events/${id}`
        );
        setEvents(events.filter((event) => event._id !== id)); // Update state to remove deleted event
        alert("Event deleted successfully!");
        fetchEvents();
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Failed to delete event");
      }
    }
  };

  // Open edit modal with selected event data
  const handleEdit = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
    fetchEvents();
  };

  // Handle saving the updated event data
  const handleSave = (updatedEvent) => {
    setEvents(
      events.map((event) =>
        event._id === updatedEvent._id ? updatedEvent : event
      )
    );
  };

  return (
    <div className="w-full max-w-3xl px-4 ">
      {/* <Sidebar /> */}
      <div className="p-4 flex-grow-1 w-full items-center">
        <h1 className="text-4xl font-bold  text-center mt-7">View Events</h1>
        <div className="flex justify-between items-center w-full max-w-4xl mb-6">
          <div className="w-full max-w-4xl mt-8 overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6  w-20 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6  w-20 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6  w-20 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6  w-20 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((item) => (
                  <tr key={item._id}>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <img
                        src={item.image}
                        alt="image"
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="px-6  w-20 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.event_title}
                    </td>
                    <td className="px-6  w-20 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.event_content}
                    </td>
                    <td className="px-6  w-20 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-500 hover:text-blue-700 mr-4"
                      >
                        <MdOutlineModeEditOutline size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <RiDeleteBin6Line size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Render the EditModal if open */}
        {isModalOpen && (
          <EditModal
            venue={selectedEvent}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
};

export default ViewEvents;
