import React, { useState } from "react";
import "./LogIn.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import backgroundImage from "../../Images/Back1.jpg";
import googleLogo from "../../Images/Google-Symbol.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";
import InputField from "../InputField/InputField";
import ButtonBox from "../ButtonBox/ButtonBox";
import PasswordField from "../PasswordInput/PasswordInput";
import Typography from "@mui/material/Typography";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null); // State for error handling
  const navigate = useNavigate(); // Initialize navigate function for navigation

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://demo.internsbee.in/api/admin/login",
        {
          email: email,
          password: password,
        }
      );

      if (response.status === 200) {
        // Handle successful login, navigate to the register page
        alert("Login successful");
        console.log(response.data.data._doc._id);
        localStorage.setItem("user", JSON.stringify(response.data.data._doc));
        localStorage.setItem("user_id", response.data.data._doc._id);
        navigate("/Dashboard"); // Navigate to the register page
      } else if (response.status === 202) {
        // Handle invalid credentials
        alert("Invalid credentials");
        setError("Invalid credentials. Please try again.");
      } else {
        // Handle other possible errors
        setError("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("An error occurred during login", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <div className="login-container">
        <div
          className="login-left"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="login-overlay">
            <h1>
              Turning Moments
              <br />
              Into Memories
            </h1>
          </div>
        </div>

        <div className="login-right">
          <div className="mb-12">
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
                fontSize: "2rem",
                textTransform: "uppercase",
              }}
            >
              VirtuElite
            </Typography>
          </div>
          <h2 className="">Log In</h2>
          <p className="mb-3">Please enter your details for log in</p>
          <form className="login-form" onSubmit={handleLogin}>
            <InputField
              type="email"
              label={"Email Id"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="login-password-container">
              <div className="password-wrapper">
                <InputField
                  type={showPassword ? "text" : "password"}
                  label={"Enter Password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="login-toggle-password"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}{" "}
                  {/* Show/Hide password */}
                </span>
              </div>
            </div>
            {error && <p className="login-error">{error}</p>}{" "}
            {/* Display error if any */}
            <div className="login-remember">
              {/* <input type="checkbox" id="keepSignedIn" /> */}
              {/* <label htmlFor="keepSignedIn">Keep me logged in</label> */}
              <Link to="/forgotpassword">
                <label htmlFor="forgotPass">Forgot Password?</label>
              </Link>
            </div>
            <button type="submit" className="login-btn">
              Log In
            </button>
            {/* <p className="login-text">
            Don’t have an account?  <Link to={'/'}>Sign Up</Link>
            </p> */}
            {/* <p className="login-or-text">or continue with</p>
            <button type="button" className="login-google-btn">
              <img src={googleLogo} alt="Google logo" />
              Continue With Google
            </button> */}
          </form>
        </div>
      </div>
    </>
  );
};

export default LogIn;
