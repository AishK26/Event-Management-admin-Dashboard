import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InputField from '../InputField/InputField';

const EditModal = ({ venue, onClose, onSave }) => {
  const [editValues, setEditValues] = useState({
    event_venue: '',
    venue_content: '',
    image: null
  });

  useEffect(() => {
    if (venue) {
      setEditValues({
        event_venue: venue.event_venue || '',
        venue_content: venue.venue_content || '',
        image: null
      });
    }
  }, [venue]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditValues({
      ...editValues,
      [name]: value
    });
  };

  const handleEditFileChange = (e) => {
    setEditValues({
      ...editValues,
      image: e.target.files[0]
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('event_venue', editValues.event_venue);
    formData.append('venue_content', editValues.venue_content);
    if (editValues.image) {
      formData.append('image', editValues.image);
    }

    try {
      const response = await axios.patch(`https://demo.internsbee.in/api/landing/venue/${venue._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      onSave(response.data); // Notify parent of the update
      onClose(); // Close the modal
      alert('Successfully update venue');
    } catch (error) {
      console.error('Error updating venue:', error);
      alert('Failed to update venue');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/3">
        <h2 className="text-2xl font-bold mb-4">Edit Venue</h2>
        <form onSubmit={handleEditSubmit}>
          <InputField
            label="Venue"
            name="event_venue"
            type="text"
            placeholder="Enter venue"
            value={editValues.event_venue}
            onChange={handleEditChange}
            required
          />
          <InputField
            label="Venue Image"
            name="image"
            type="file"
            onChange={handleEditFileChange}
          />
          <label htmlFor="venue_content" style={{ display: 'block', marginBottom: '8px' }}>
            Description
          </label>
          <textarea
            className="m-2 py-2 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent w-full"
            id="venue_content"
            name="venue_content"
            placeholder="Enter Description"
            required
            value={editValues.venue_content}
            onChange={handleEditChange}
            style={{
              height: '100px',
              width: '100%',
              padding: '10px',
              boxSizing: 'border-box'
            }}
          />
          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="submit"
              className="bg-green-400 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              Save
            </button>
            <button
              type="button"
              className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
