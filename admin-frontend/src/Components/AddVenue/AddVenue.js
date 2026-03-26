import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ButtonBox from '../ButtonBox/ButtonBox';
import InputField from '../InputField/InputField';
import Sidebarcms from '../SidebarCms/Sidebarcms';
import './Venue.css'

const AddVenue = () => {
  const navigate = useNavigate();
  
  const [inputValue, setInputValue] = useState({
    venue: '',
    Description: ''
  });

  const [inputFile, setInputFile] = useState(null);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value
    });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    setInputFile(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object
    const formData = new FormData();
    formData.append('event_venue', inputValue.venue);
    formData.append('venue_content', inputValue.Description);
    if (inputFile) {
      formData.append('image', inputFile);
    }

    try {
      const response = await axios.post('https://demo.internsbee.in/api/landing/venue', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Venue added successfully!');
      console.log(response.data);
      setInputValue({ venue: '', Description: '' }); // Clear text inputs
      setInputFile(null); // Clear file input
      navigate("/viewVenue")
    } catch (error) {
      console.error('Error adding venue:', error);
      alert('Failed to add venue');
    }
  };

  return (
    <div>
      <Sidebarcms />
    <div className="min-h-screen flex justify-center mt-7 add-venue-container">
      <div className="w-full max-w-3xl px-4 m-7 mt-7">
        <h1 className="text-4xl font-bold mb-6 text-center">Add Venue</h1>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-7 md:flex-row md:space-x-4 mb-4">
            <InputField
              label="Add Venue"
              name="venue"
              type="text"
              placeholder="Enter venue"
              value={inputValue.venue}
              onChange={handleChange}
              required
            />
            <InputField
              label="Image"
              name="image"
              type="file"
              onChange={handleFileChange}
              id = 'file-input'
              required
            />
          </div>

          <label htmlFor="Description" style={{ display: 'block', marginBottom: '8px' }}>
            Description
          </label>
          <textarea
          className="m-2 py-2 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:border-transparent textarea-responsive"
          id="description"
          name="description"
          placeholder="Enter Description"
          required
          value={inputValue.description}
          onChange={handleChange}
        />

          <div className="flex flex-col mt-3 md:flex-row justify-center md:items-center gap-5 space-y-4 md:space-y-0">
            <div className="flex justify-between gap-4 md:gap-7">
              <ButtonBox
                type="submit"
                label="Add Venue"
                className="bg-red-400 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full"
              />
              {/* <ButtonBox
                label="View Venue"
                className="bg-red-400 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full"
                onClick={() => navigate('/viewVenue')}
              /> */}
            </div>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default AddVenue;
