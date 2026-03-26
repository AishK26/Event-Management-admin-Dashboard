import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import ButtonBox from '../ButtonBox/ButtonBox';

const AssignModal = ({ show, handleClose, handleAssign, selectedEvent }) => {
  const [selectedManager, setSelectedManager] = useState("");
  const [description, setDescription] = useState(""); // New state for description
  const [managerDetails, setManagerDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // New state for image

  const fetchManagerDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://demo.internsbee.in/api/manager');
      if (Array.isArray(response.data.result)) {
        setManagerDetails(response.data.result);
      } else {
        throw new Error('Invalid data format from API');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show) {
      fetchManagerDetails();
    }
  }, [show]);

  const handleAssignClick = async () => {
    if (!selectedManager) {
      setError("Please select a manager.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("managerId", selectedManager); // Add manager ID
    formData.append("description", description); // Add description
    if (selectedImage) {
      formData.append("image", selectedImage); // Append the selected image
    }

    try {
      const response = await axios.patch(
        `https://demo.internsbee.in/api/enquiry/${selectedEvent._id}/assign-manager/${selectedManager}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Set correct header for file upload
          },
        }
      );

      if (response.status !== 200) {
        throw new Error('Failed to assign manager');
      }
      alert("Assigned to Manager Successfully.");
      window.location.reload();
      handleAssign(selectedEvent._id, selectedManager);
      handleClose(); // Close modal after successful assignment
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]); // Handle selected image
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white w-full  sm:max-w-sm md:max-w-md lg:max-w-lg p-6 rounded-lg shadow-lg z-10"  style={{maxWidth:"17.5rem",marginLeft:"46px"}}>
        <div className="py-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Assign Manager</h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
            >
            </button>
          </div>
        </div>
        <div className="py-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="manager">
            Select Manager
            <span className="text-black-500"> *</span>
          </label>
          <select
            id="manager"
            value={selectedManager}
            onChange={(e) => setSelectedManager(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a manager</option>
            {managerDetails.map((manager) => (
              <option key={manager._id} value={manager._id}>
                {manager.fullname}
              </option>
            ))}
          </select>
          {/* File Input for Image */}
          <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">
            Upload Image (optional)
          </label>
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* New Input for Description */}
          <label className="block text-gray-700 text-sm font-bold mt-4 mb-2" htmlFor="description">
            Description (optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {loading && <p className="text-gray-500 text-sm mt-2">Loading...</p>}
          {error && <p className="text-blue-500 text-sm mt-2">{error}</p>}
        </div>
        <div className="p-4 border-t flex justify-end space-x-4">
          <ButtonBox
          label="Cancel"
            onClick={handleClose}
            className="button-box bg-gray-600 text-white"
          >
            Cancel
          </ButtonBox>
          <ButtonBox
          label="Assign"
            onClick={handleAssignClick}
            disabled={loading}
            className={`button-box bg-blue-600 text-white font-bold py-2 px-4 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Assigning...' : 'Assign'}
          </ButtonBox>
        </div>
      </div>
    </div>
  );
};

export default AssignModal;
