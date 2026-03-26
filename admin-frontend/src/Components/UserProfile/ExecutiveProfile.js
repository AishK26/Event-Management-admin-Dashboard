import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InputField from '../InputField/InputField';
import ButtonBox from "../ButtonBox/ButtonBox";
import { getExecutiveById, deleteExecutive, updateExecutive } from '../../Services/Auth'; // Adjust the import path as needed
import SideBar from '../SideBar/SideBar';
const ExecutiveProfile = () => {
  const { _id } = useParams(); // Get the executive ID from the URL
  const [executive, setExecutive] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  
  const [editedExecutive, setEditedExecutive] = useState({
    fullname: '',
    email: '',
    number: '',
    city: '',
    account_holder_name: '',
    account_number: '',
    ifsc_code: '',
    bank_name: '',
  });

// Fetch executive by ID
  useEffect(() => {
    const fetchExecutive = async () => {
      try {
        const response = await getExecutiveById(_id);
        console.log("Fetched executive data:", response); // Log the entire response
        if (response.result) {
          setExecutive(response.result); // Set the executive data to state
          setEditedExecutive(response.result); // Pre-fill the form with fetched data
        } else {
          console.error("Invalid response format:", response);
        }
      } catch (error) {
        console.error("Failed to fetch executive", error);
        setExecutive(null);
      } finally {
        setLoading(false);
      }
    };
    fetchExecutive();
  }, [_id]);

  // Handle name, contact, email, account number, ifsc code input validations
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

  const handleAccountNumberInput = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length > 17) {
      e.target.value = value.slice(0, 17);
    } else {
      e.target.value = value;
    }
  };

  const handleIFSCInput = (e) => {
    e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  };

  const handleEmailInput = (e) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(e.target.value)) {
      e.target.setCustomValidity('Please enter a valid email address');
    } else {
      e.target.setCustomValidity('');
    }
  };

  // handle update function
  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedExecutive(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

   // Validate form fields before saving
  const validateForm = () => {
    const { fullname, email, contact, city, state,address } = editedExecutive;

    if (!fullname || !email || !contact || !city || !state || !address) {
      window.alert("Please fill in all mandatory fields.");
      return false;
    }
    return true;
  };

  // Save functionality
  const handleSaveChanges = async () => {
    if (!validateForm()) {
      return; // Stop if validation fails
    }

    try {
      const response = await updateExecutive(_id, editedExecutive); // Call the update service
      console.log('Executive updated successfully', response);
      window.alert("Executive updated successfully");
      setEditMode(false); // Exit edit mode after saving
    } catch (error) {
      console.error('Failed to update executive', error);
      window.alert("Failed to update executive . Please try again.");
    }
  };

  const handleCancelChanges = () => {
    setEditMode(false);
    setEditedExecutive(executive); // Reset the form to the original data
  };

  // Handle the delete action with confirmation and navigation
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${executive?.fullname}'s data?`
    );

    if (confirmDelete) {
      try {
        console.log(`Attempting to delete executive with ID: ${_id}`);
        await deleteExecutive(_id); // Call the delete API function
        alert("Executive deleted successfully"); // Show a success alert
        console.log("Executive deleted successfully");
        navigate("/usermanagement"); // Adjust path as needed
      } catch (error) {
        console.error("Error deleting executive:", error);
        alert("Failed to delete executive. Please try again.");
      }
    } else {
      console.log('Deletion cancelled by user');
    }
  };

  return (
    <>
    <div className="flex ">
      <SideBar/>

      <div className="min-h-screen w-full flex justify-center flex-grow-1 items-center bg-indigo-100">
      <div className="w-full max-w-3xl px-4  mt-16  justify-center py-2">
        <h1 className=" text-4xl sm:text-2xl mb-6 font-bold lg:text-3xl text-center text-black">Executive Profile</h1>
        {loading ? ( 
          <p>Loading...</p>
        ) : (
          <form className="w-full ">
            <div className="flex flex-col gap-7 md:flex-row md:space-x-4 mb-4">
              <InputField
                label="Full Name"
                name="fullname"
                type="text"
                onInput={handleCharInput}
                value={editedExecutive.fullname}
                onChange={handleInputChange}
                readOnly={!editMode}
                required
              />
              <InputField
                label="Contact Number"
                name="number"
                type="text"
                onInput={handleContactNumberInput}
                value={editedExecutive.number}
                onChange={handleInputChange}
                maxLength="10"
                readOnly={!editMode}
                required
              />
            </div>
            <div className="flex flex-col gap-7 md:flex-row md:space-x-4 mb-4">
              <InputField
                label="Email"
                name="email"
                type="email"
                onInput={handleEmailInput}
                value={editedExecutive.email}
                onChange={handleInputChange}
                readOnly={!editMode}
                required
              />
              <InputField
                label="City"
                name="city"
                type="text"
                onInput={handleCharInput}
                value={editedExecutive.city}
                onChange={handleInputChange}
                readOnly={!editMode}
                required
              />
            </div>
            <div className="flex flex-col gap-7 md:flex-row md:space-x-4 mb-4">
              <InputField
                label="Account Holder Name"
                name="account_holder_name"
                type="text"
                onInput={handleCharInput}
                value={editedExecutive.account_holder_name}
                onChange={handleInputChange}
                readOnly={!editMode}
              />
              <InputField
                label="Account Number"
                name="account_number"
                type="text"
                onInput={handleAccountNumberInput}
                value={editedExecutive.account_number}
                onChange={handleInputChange}
                maxLength="17"
                readOnly={!editMode}
              />
            </div>
            <div className="flex flex-col gap-7 md:flex-row md:space-x-4 mb-4">
              <InputField
                label="Bank Name"
                name="bank_name"
                type="text"
                onInput={handleCharInput}
                value={editedExecutive.bank_name}
                onChange={handleInputChange}
                readOnly={!editMode}
              />
              <InputField
                label="IFSC Code"
                name="ifsc_code"
                type="text"
                onInput={handleIFSCInput}
                value={editedExecutive.ifsc_code}
                onChange={handleInputChange}
                maxLength="11"
                readOnly={!editMode}
              />
            </div>
            {editMode ? (
              <div className="flex justify-center gap-7">
                <ButtonBox
                  label="Save"
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full"
                  onClick={handleSaveChanges}
                />
                <ButtonBox
                  label="Cancel"
                  className="bg-red-400 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full"
                  onClick={handleCancelChanges}
                />
              </div>
            ) : (
              <div className="flex justify-center gap-7">
                <ButtonBox
                  label="Edit"
                  className=" text-white font-bold py-3 px-8 rounded-full"
                  onClick={toggleEditMode}
                />
                <ButtonBox
                  label="Delete"
                  className=" text-white font-bold py-3 px-8 rounded-full"
                  onClick={handleDelete}
                />
              </div>
            )}
          </form>
        )}
      </div>
    </div>
    </div>
    </>
  );
};

export default ExecutiveProfile;
