import React, { useState } from "react";
import PasswordInput from "../PasswordInput/PasswordInput";
import ButtonBox from "../ButtonBox/ButtonBox";
import SideBar from "../SideBar/SideBar";
import axios from "axios";
import InputField from "../InputField/InputField";

const ChangePassword = () => {
  const [email, setEmail] = useState(""); // Add email state
  const [oldPassword, setOldPassword] = useState("");
  const [password, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // const handleOldPasswordChange = (e) => {
  //   setOldPassword(e.target.value);
  // };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  // const handleConfirmPasswordChange = (e) => {
  //   setConfirmPassword(e.target.value);
  // };

  const handleContinue = async () => {
    // Reset error and success messages
    setError("");
    setSuccess("");
    
    // Basic validation
    // if (password !== confirmPassword) {
    //   setError("New password and confirm password do not match.");
    //   return;
    // }

    
  // if (password !== confirmPassword) {
  //   setError("New password and confirm password do not match.");
  //   return;
  // }

    try {
      setLoading(true);
      const response = await axios.patch(
        "https://demo.internsbee.in/api/profile/changepassword/",
        {
          email: email,
          password: password
        }
      );
      
      if (response.status === 200) {
        setSuccess("Password changed successfully!");
        // Optionally, clear the form fields or redirect the user
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      setError("Failed to change password: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex">
      <SideBar />
      <div className="max-w-md mx-auto mt-14 p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-5">Change Password</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        <div className="mb-4">
          <InputField
            label="Enter Email Id"
            placeholder="Enter Email Id"
            required
            onChange={handleEmailChange}
            value={email}
            styles_password={{ marginBottom: '1rem' }}
            className="mb-4"
          />
        </div>

        <div className="mb-4">
          <PasswordInput
            label="Change Password"
            placeholder="Change Password"
            required
            onChange={handleNewPasswordChange}
            value={password}
            styles_password={{ marginBottom: '1rem' }}
            className="mb-4"
          />
        </div>
        <div className="flex justify-center">
          <ButtonBox
            label={loading ? "Changing..." : "Continue"}
            onClick={handleContinue}
            className={`bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full ${loading ? "cursor-not-allowed opacity-50" : ""}`}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
