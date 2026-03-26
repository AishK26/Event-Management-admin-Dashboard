import axios from 'axios';
import React, { useState } from 'react';
import ButtonBox from '../ButtonBox/ButtonBox';
import InputField from '../InputField/InputField';
import './Feedback.css';

const Feedback = () => {
  const [inputValue, setInputValue] = useState({
    full_Name: '',
    email: '',
    Event_Name: '',
    Feedback: '',
    rating:0 // Added rating to state
  });

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://demo.internsbee.in/api/feedbacks', {
        full_Name: inputValue.full_Name,
        email: inputValue.email,
        event_Name: inputValue.Event_Name,
        client_Feedback: inputValue.Feedback,
        rating: inputValue.rating
      });

      alert("Feedback added successfully");
      setInputValue({
        full_Name: '',
        email: '',
        Event_Name: '',
        Feedback: '',
        rating: ''
      }); // Clear form fields
    } catch (err) {
      alert(err.response ? err.response.data.message : err.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center mt-7">
      <div className="w-full max-w-3xl px-4 m-7 mt-7">
        <h1 className="text-4xl font-bold mb-6 text-center">Feedback</h1>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-7 md:flex-row md:space-x-4 mb-4">
            <InputField
              label="Full Name"
              name="full_Name"
              type="text"
              placeholder="Enter your name"
              value={inputValue.full_Name}
              onChange={handleChange}
              required
            />
            <InputField
              label="Email Id"
              name="email"
              type="email"
              placeholder="Enter your Email"
              value={inputValue.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-7 md:flex-row md:space-x-4 mb-4">
            <InputField
              label="Event Name"
              name="Event_Name"
              type="text"
              placeholder="Enter event name"
              value={inputValue.Event_Name}
              onChange={handleChange}
              required
            />
            <InputField
              label="Rating"
              name="rating"
              type="number"
              placeholder="Enter your rating (1-5)"
              value={inputValue.rating}
              onChange={handleChange}
              min="1"
              max="5"
              required
            />
          </div>

          <label htmlFor="feedback" className="block mb-2">
            Feedback
          </label>
          <textarea
            className="m-2 py-2 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent w-full"
            id="feedback"
            name="Feedback"
            placeholder="Please give your valuable feedback"
            required
            value={inputValue.Feedback}
            onChange={handleChange}
            style={{
              height: '100px',
              width: '100%',
              padding: '10px',
              boxSizing: 'border-box'
            }}
          />

          <div className="flex flex-col md:flex-row justify-center md:items-center gap-5 space-y-4 md:space-y-0">
            <ButtonBox
              type="submit"
              label="Submit"
              className="bg-red-400 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
