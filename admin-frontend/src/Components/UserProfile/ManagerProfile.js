import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getManagerById, deleteManager, updateManager } from '../../Services/Auth';
import InputField from '../InputField/InputField';
import ButtonBox from "../ButtonBox/ButtonBox";
import Sidebar from '../SideBar/SideBar';

const ManagerProfile = () => {
  const { _id } = useParams(); // Get the manager ID from the URL
  const [manager, setManager] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);

  const [editedManager, setEditedManager] = useState({
    fullname: '',
    email: '',
    contact: '',
    city: '',
    holder_name: '',
    account_number: '',
    IFSC_code: '',
    bank_name: '',
    state:'',
    address:'',
  });

  // Handle name, email, contact, account No., IFSC code input validations
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

  // Fetch manager by ID
  useEffect(() => {
    const fetchManager = async () => {
      try {
        const response = await getManagerById(_id);
        setManager(response.result);
        setEditedManager(response.result); // Pre-fill the form with fetched data
      } catch (error) {
        console.error("Failed to fetch manager", error);
        setManager(null);
      } finally {
        setLoading(false);
      }
    };
    fetchManager();
  }, [_id]);

  // Toggle edit mode
  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedManager(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Validate form fields before saving
  const validateForm = () => {
    const { fullname, email, contact, city, state,address } = editedManager;

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
      const response = await updateManager(_id, editedManager); // Call the update service
      console.log('Manager updated successfully', response);
      window.alert("Manager updated successfully");
      setEditMode(false); // Exit edit mode after saving
    } catch (error) {
      console.error('Failed to update manager', error);
      window.alert("Failed to update manager. Please try again.");
    }
  };

  // Cancel changes and reset the form
  const handleCancelChanges = () => {
    setEditMode(false);
    setEditedManager(manager); // Reset the form to the original data
  };

  // Handle the delete action with confirmation and navigation
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${manager?.fullname}'s data?`
    );

    if (confirmDelete) {
      try {
        await deleteManager(_id); // Call the delete API function
        window.alert("Manager deleted successfully");
        navigate("/usermanagement");
      } catch (error) {
        console.error("Error deleting manager:", error);
        alert("Failed to delete manager. Please try again.");
      }
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="min-h-screen w-full flex justify-center items-center bg-indigo-100">
        <div className="w-full max-w-3xl px-4 py-2 mt-16">
          <h1 className="text-4xl sm:text-2xl mb-6 font-bold lg:text-3xl text-center text-black">Manager Profile</h1>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <form className="w-full">
              <div className="flex flex-col gap-7 md:flex-row md:space-x-4 mb-4">
                <InputField
                  label="Full Name"
                  name="fullname"
                  type="text"
                  onInput={handleCharInput}
                  value={editedManager.fullname}
                  onChange={handleInputChange}
                  readOnly={!editMode}
                  required
                />
                <InputField
                  label="Contact Number"
                  name="contact"
                  type="text"
                  onInput={handleContactNumberInput}
                  value={editedManager.contact}
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
                  value={editedManager.email}
                  onChange={handleInputChange}
                  readOnly={!editMode}
                  required
                />
                <InputField
                  label="City"
                  name="city"
                  type="text"
                  onInput={handleCharInput}
                  value={editedManager.city}
                  onChange={handleInputChange}
                  readOnly={!editMode}
                  required
                />
              </div>

              <div className="flex flex-col gap-7 md:flex-row md:space-x-4 mb-4">
                <InputField
                  label="State"
                  name="state"
                  type="text"
                  onInput={handleCharInput}
                  value={editedManager.state}
                  onChange={handleInputChange}
                  readOnly={!editMode}
                  required
                />
                <InputField
                  label="Address"
                  name="address"
                  type="text"
                  value={editedManager.address}
                  onChange={handleInputChange}
                  readOnly={!editMode}
                  required
                />
              </div>

              <div className="flex flex-col gap-7 md:flex-row md:space-x-4 mb-4">
                <InputField
                  label="Account Holder Name"
                  name="holder_name"
                  type="text"
                  onInput={handleCharInput}
                  value={editedManager.holder_name}
                  onChange={handleInputChange}
                  readOnly={!editMode}
                  required
                />
                <InputField
                  label="Account Number"
                  name="account_number"
                  type="text"
                  onInput={handleAccountNumberInput}
                  value={editedManager.account_number}
                  onChange={handleInputChange}
                  maxLength="17"
                  readOnly={!editMode}
                  required
                />
              </div>
              <div className="flex flex-col gap-7 md:flex-row md:space-x-4 mb-4">
                <InputField
                  label="Bank Name"
                  name="bank_name"
                  type="text"
                  onInput={handleCharInput}
                  value={editedManager.bank_name}
                  onChange={handleInputChange}
                  readOnly={!editMode}
                  required
                />
                <InputField
                  label="IFSC Code"
                  name="IFSC_code"
                  type="text"
                  onInput={handleIFSCInput}
                  value={editedManager.IFSC_code}
                  onChange={handleInputChange}
                  maxLength="11"
                  readOnly={!editMode}
                  required
                />
              </div>
              {editMode ? (
                <div className="flex justify-center gap-6">
                  <ButtonBox
                    label="Save"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full"
                    onClick={handleSaveChanges}
                  />
                  <ButtonBox
                    label="Cancel"
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-full"
                    onClick={handleCancelChanges}
                  />
                </div>
              ) : (
                <div className="flex justify-center gap-7">
                  <ButtonBox
                    label="Edit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full"
                    onClick={toggleEditMode}
                  />
                  <ButtonBox
                    label="Delete"
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full"
                    onClick={handleDelete}
                  />
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerProfile;
