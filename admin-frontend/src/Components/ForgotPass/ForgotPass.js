import React, { useState } from 'react';
import './ForgotPass.css';
import backgroundImage from '../../Images/Back1.jpg';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import InputField from '../InputField/InputField';
import PasswordField from '../PasswordInput/PasswordInput';
import Typography from "@mui/material/Typography";

const ForgotPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Function to send OTP
  const handleSendOtp = async () => {
    try {
      const response = await axios.post('https://demo.internsbee.in/api/sendotp', { email });
      if (response.data.success) {
        alert('OTP sent successfully!');
        setOtpSent(true);
      } else {
        alert('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Error sending OTP. Please try again.');
    }
  };

  // Function to verify OTP
  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post('https://demo.internsbee.in/api/verifyotp', { email, otp });
      if (response.data.success) {
        alert('OTP verified successfully!');
        setResetToken(response.data.token);
        setOtpVerified(true);
      } else {
        alert('Invalid OTP. Please try again.');
        setOtpVerified(false);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('Error verifying OTP. Please try again.');
      setOtpVerified(false);
    }
  };

  // Function to update password
  const handleUpdatePassword = async () => {
    try {
      const response = await axios.patch(`https://demo.internsbee.in/api/changepassword/${resetToken}`, { email, password });
      if (response.data.success) {
        alert('Password updated successfully!');
        // Reset states or redirect as necessary
        setEmail('');
        setOtp('');
        setPassword('');
        setOtpSent(false);
        setOtpVerified(false);
        navigate('/'); // Navigate to the login page
      } else {
        alert('Failed to update password. Please try again.');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Error updating password. Please try again.');
    }
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!otpVerified) {
      alert('Please verify OTP before continuing.');
      return;
    }
    handleUpdatePassword();
  };

  return (
    <>
      <div className="forgot-password-container">
        <div
          className="forgot-password-left"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="forgot-password-overlay">
            <h1>Turning Moments<br />Into Memories</h1>
          </div>
        </div>

        <div className="forgot-password-right">
        <div className='mb-10'>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            color: "#1E40AF",
            // backgroundColor: "#1E40AF",  // Blue background color
            // paddingInline: "15px",
            // borderRadius: "5px",
            // width: "100%",
            textAlign: "center",
            // cursor: "pointer",
            // boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
            fontWeight: "bold",
            fontSize:"2rem",
            textTransform: "uppercase",
          }}
        >
          VirtuElite
        </Typography>
        </div>
          <h2 className=' mt-10 mb-3'>Forgot Password</h2>
          <form className="forgot-password-form" onSubmit={handleSubmit}>
            <InputField
              type="email"
              label={"Enter Email Id"}
              className="border border-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="button"
              className="forgot-password-label"
              onClick={handleSendOtp}
              disabled={otpSent}
            >
              Send OTP
            </button>
            
            {otpSent && (
              <>
                <InputField
                  type="text"
                  label={"Enter OTP"}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="forgot-password-label"
                  onClick={handleVerifyOtp}
                  disabled={otpVerified}
                >
                  Verify OTP
                </button>
              </>
            )}

            {otpVerified && (
              <div className="forgot-password-input-container">
                <PasswordField
                  type={showPassword ? 'text' : 'password'}
                  label={"Change Password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {/* <span className="forgot-password-toggle" onClick={togglePasswordVisibility}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span> */}
              </div>
            )}

            <button type="submit" className="login-btn" disabled={!otpVerified}>
              Continue
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
