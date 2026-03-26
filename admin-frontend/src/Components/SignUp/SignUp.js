import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignUp.css';
import backgroundImage from '../../Images/Back1.jpg';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import Navbar from '../Navbar/Navbar';
import Sidebar from '../SideBar/SideBar';
import axios from 'axios';
import InputField from '../InputField/InputField';
import PasswordField from '../PasswordInput/PasswordInput';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false); 
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    number: '',
    address: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { fullname, email, number, address, password } = formData;

   

    try {
      const response = await axios.post('https://demo.internsbee.in/api/admin/register', formData);

      if (response.status === 200) {
        alert('Registration successful!');
        navigate('/Dashboard'); // Navigate to the login page on success
        localStorage.setItem('user',JSON.stringify(response.data.data._doc)) 
        localStorage.setItem('user_id',response.data.data._doc._id) 
      } else if (response.status === 500) {
        alert('User already exists.');
      } else {
        const data = await response.json();
        alert(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <>
      <div className="signup-container">
        <div
          className="left-section"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="overlay-text">
            <h1>Turning Moments<br />Into Memories</h1>
          </div>
        </div>

        <div className="right-section">
          <h2>Sign Up</h2>
          <p className='mb-3'>Please enter your details for sign up</p>
          <form className="signup-form" onSubmit={handleSubmit}>
            <InputField
              type="text" 
              name="fullname"
              label={"Full Name"}
              value={formData.fullname} 
              onChange={handleInputChange}
              onInput={handleCharInput}
              required 
            />
            <InputField
              type="email" 
              name="email" 
              label={"Email Id"}
              value={formData.email} 
              onChange={handleInputChange}
              onInput={handleEmailInput}
              required 
            />
            <InputField
              type="tel" 
              name="number"
              label={"Contact Number"}
              value={formData.number} 
              onChange={handleInputChange}
              onInput={handleContactNumberInput}
              maxLength="10"
              required 
            />
            <InputField 
              type="text" 
              name="address" 
              label={"address"}
              
              value={formData.address} 
              onChange={handleInputChange}
              required 
            />

            <div className="password-container">
              <PasswordField
                type={showPassword ? 'text' : 'password'} 
                name="password"
                label={"Enter Password"}
                value={formData.password}
                onChange={handleInputChange}
                onClick={togglePasswordVisibility}
                required
              />
              {/* <span className="toggle-password" onClick={togglePasswordVisibility}>
                {showPassword ? <FaEyeSlash /> : <FaEye />} 
              </span> */}
            </div>

            {message && <p className="signup-message">{message}</p>}

            <button type="submit" className="signup-btn" disabled={loading}>
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>

            <p className="login-text">
              Already have an account? <Link to={"/login"}>Log in</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
