import axios from "axios";
import React, { useState } from "react";
import ButtonBox from "../ButtonBox/ButtonBox";
import InputField from "../InputField/InputField";
import Sidebar from "../SideBar/SideBar";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AddVendor = () => {
  const [inputValue, setInputValue] = useState({
    full_Name: "",
    email: "",
    phone_Number: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Validation function
  const validate = () => {
    const newErrors = {};
    if (!inputValue.full_Name) {
      newErrors.full_Name = "Name is required.";
    } else if (!/^[a-zA-Z\s]+$/.test(inputValue.full_Name)) {
      newErrors.full_Name =
        "Name should not contain numbers or special characters.";
    }
    if (!inputValue.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(inputValue.email)) {
      newErrors.email = "Email address is invalid.";
    }
    if (!inputValue.phone_Number) {
      newErrors.phone_Number = "Contact number is required.";
    } else if (!/^\d{10}$/.test(inputValue.phone_Number)) {
      newErrors.phone_Number = "Contact number must be 10 digits.";
    }
    if (!inputValue.address) newErrors.address = "Address is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValue({ ...inputValue, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return; // Stop submission if validation fails

    if (loading) return;
    setLoading(true);

    try {
      const response = await axios.post(
        "https://demo.internsbee.in/api/vendors",
        inputValue
      );
      console.log(response);
      alert("Vendor added successfully");

      setInputValue({
        full_Name: "",
        email: "",
        phone_Number: "",
        address: "",
      });

    } catch (err) {
      alert(err.response ? err.response.data.message : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <div className="flex">
        <Sidebar />
        <div className="h-screen w-full flex justify-center bg-indigo-100">
          <div className="flex justify-center align-middle items-center"> */}
      <div className="w-full max-w-3xl px-4 h-screen">
        <h1 className="text-4xl font-bold mb-7 text-center ">Add Vendor</h1>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-7 md:flex-row md:space-x-4 mb-4">
            <InputField
              label="Name"
              name="full_Name"
              type="text"
              placeholder="Enter your name"
              value={inputValue.full_Name}
              onChange={handleChange}
              required
              error={errors.full_Name}
            />
            <InputField
              label="Contact number"
              name="phone_Number"
              type="number"
              placeholder="Enter your Mobile Number"
              value={inputValue.phone_Number}
              onChange={handleChange}
              required
              error={errors.phone_Number}
            />
          </div>
          <div className="flex flex-col gap-7 md:flex-row md:space-x-4 mb-4">
            <InputField
              label="Email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={inputValue.email}
              onChange={handleChange}
              required
              error={errors.email}
            />
            <InputField
              label="Current Address"
              name="address"
              type="text"
              placeholder="Enter your address"
              value={inputValue.address}
              onChange={handleChange}
              required
              error={errors.address}
            />
          </div>

          <div className="flex justify-end gap-4 md:gap-7">
            <ButtonBox
              type="submit"
              // label={loading ? "Submitting..." : "Submit"}
              label={'Add Vendor'}
              className=""
              disabled={loading}
            />
          </div>
        </form>
      </div>
      {/* </div>
        </div>
      </div> */}
    </>
  );
};

export default AddVendor;
