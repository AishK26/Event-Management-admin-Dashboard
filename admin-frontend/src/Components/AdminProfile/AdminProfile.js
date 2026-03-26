import React, { useState, useEffect } from "react";
import InputField from "../InputField/InputField";
import ButtonBox from "../ButtonBox/ButtonBox";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SideBar from "../SideBar/SideBar";

const AdminProfile = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    number: "",
  });

  // Handle name, email, contact, Account No.,ifsc code input validations
  const handleCharInput = (e) => {
    e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
  };

  const handleContactNumberInput = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length > 10) {
      e.target.value = value.slice(0, 10);
    } else {
      e.target.value = value;
    }
  };
  const handleEmailInput = (e) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(e.target.value)) {
      e.target.setCustomValidity('Please enter a valid email address');
    } else {
      e.target.setCustomValidity('');
    }
  };


  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user"); // Get user data from local storage

    if (userData) {
      const parsedUser = JSON.parse(userData);
      setFormData({
        fullname: parsedUser.fullname,
        email: parsedUser.email,
        number: parsedUser.number,
      });
    } else {
      console.error("User data not found in local storage.");
    }
  }, []);

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    try {
      const userId = localStorage.getItem("user_id"); // Replace with the actual user ID
      console.log('Sending request with data:', formData);
      const response = await axios.patch(`https://demo.internsbee.in/api/admin/update/${userId}`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Admin Profile updated successfully', response.data);
      window.alert("Admin Profile updated successfully");
      setEditMode(false); // Exit edit mode after saving
    } catch (error) {
      console.error('Failed to update manager', error.response ? error.response.data : error.message);
      window.alert("Failed to update manager");
    }
  };
  

  const handleCancelChanges = () => {
    setEditMode(false);
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setFormData({
        fullname: parsedUser.fullname,
        email: parsedUser.email,
        number: parsedUser.number,
      });
    }
  };

  const handleChangePassword = () => {
    navigate('/changepassword'); // Navigate to the ChangePassword component
  };

  return (
    <div className="flex">
      <SideBar />
    <div className="max-w-md mx-auto mt-14 p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Profile</h1>

      <form className="space-y-4 max-w-lg mx-auto">
        <InputField
          label="Full Name"
          name="fullname"
          placeholder="Enter your full name"
          value={formData.fullname}
          onInput={handleCharInput}
          onChange={handleInputChange}
          disabled={!editMode}
        />
        <InputField
          label="Email Address"
          type="email"
          name="email"
          placeholder="Enter your email address"
          value={formData.email}
          onInput={handleEmailInput}
          onChange={handleInputChange}
          disabled={!editMode}
        />
        <InputField
          label="Mobile Number"
          type="tel"
          name="number"
          placeholder="Enter your mobile number"
          value={formData.number}
          onInput={handleContactNumberInput}
          onChange={handleInputChange}
          maxLength="10"
          disabled={!editMode}
        />
 
        <div className="flex justify-center gap-7">
          {editMode ? (
            <>
              <ButtonBox
                label="Save"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full"
                onClick={handleSaveChanges}
              />
              <ButtonBox
                label="Cancel"
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-full"
                onClick={handleCancelChanges}
              />
            </>
          ) : (
            <>
              <ButtonBox
                label="Edit"
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full"
                onClick={toggleEditMode}
              />
              <ButtonBox
                label="Change Password"
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full"
                onClick={handleChangePassword}
              />
            </>
          )}
        </div>
      </form>
    </div>
    </div>
    
  );
};

export default AdminProfile;
