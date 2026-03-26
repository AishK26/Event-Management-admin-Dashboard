import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EditModal from './EditModal'; // Import the EditModal component
import Sidebarcms from '../SidebarCms/Sidebarcms';
import './Venue.css'
import { MdOutlineModeEditOutline } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";

const ViewVenue = () => {
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  // Fetch data from API
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get('https://demo.internsbee.in/api/landing/venue');
        setVenues(response.data); // Assuming response.data is an array of venues
      } catch (error) {
        console.error('Error fetching venues:', error);
      }
    };

    fetchVenues();
  }, []);

  // Handle deletion of a venue
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this venue?')) {
      try {
        await axios.delete(`https://demo.internsbee.in/api/landing/venue/${id}`);
        setVenues(venues.filter(venue => venue._id !== id)); // Update state to remove deleted venue
        alert('Venue deleted successfully!');
      } catch (error) {
        console.error('Error deleting venue:', error);
        alert('Failed to delete venue');
      }
    }
  };

  // Handle edit button click
  const handleEdit = (venue) => {
    setSelectedVenue(venue);
    setIsEditModalVisible(true);
  };

  // Close the edit modal
  const handleEditClose = () => {
    setIsEditModalVisible(false);
    setSelectedVenue(null);
  };

  // Save the updated venue
  const handleEditSave = (updatedVenue) => {
    setVenues(venues.map(venue =>
      venue._id === updatedVenue._id ? updatedVenue : venue
    ));
    handleEditClose();
  };

  return (
    <div>
      <Sidebarcms />
    <div className="min-h-screen flex flex-col items-center justify-start p-4 view-venue-container">
<h1 className="text-4xl font-bold  text-center mt-7">View Venue</h1>
      <div className="w-full max-w-4xl mt-8 overflow-x-auto">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {venues.map((item) => (
                <tr key={item._id}>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <img src={item.image} alt='Venue' className="w-16 h-16 object-cover rounded" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.event_venue}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.venue_content}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-500 hover:text-blue-700 mr-4"
                    >
                     <MdOutlineModeEditOutline size={20}/>
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                     <RiDeleteBin6Line size={20}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isEditModalVisible && (
          <EditModal
            venue={selectedVenue}
            onClose={handleEditClose}
            onSave={handleEditSave}
          />
        )}
      </div>
    </div>
    </div>
  );
};

export default ViewVenue;
