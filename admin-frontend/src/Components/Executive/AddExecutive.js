import React, { useState } from "react";
import ButtonBox from "../ButtonBox/ButtonBox";
import InputField from "../InputField/InputField";
import PasswordInput from "../PasswordInput/PasswordInput";
import { createExecutive } from "../../Services/Auth";
import Sidebar from "../SideBar/SideBar";

const AddExecutive = () => {
  const [executive, setExecutive] = useState({
    fullname: "",
    email: "",
    number: "",
    password: "",
    city: "",
    address: "",
    account_holder_name: "",
    account_number: "",
    bank_name: "",
    ifsc_code: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExecutive({
      ...executive,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const response = await createExecutive(executive);
      alert(`${response.message}`);
      setExecutive({
        fullname: "",
        email: "",
        number: "",
        password: "",
        city: "",
        address: "",
        account_holder_name: "",
        account_number: "",
        bank_name: "",
        ifsc_code: "",
      });
    } catch (error) {
      alert("Error occurred while saving executive data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = () => {
    setExecutive({
      fullname: "",
      email: "",
      number: "",
      password: "",
      city: "",
      address: "",
      account_holder_name: "",
      account_number: "",
      bank_name: "",
      ifsc_code: "",
    });
  };

  const handleCharInput = (e) => {
    e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
  };

  const handleContactNumberInput = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    e.target.value = value.length > 10 ? value.slice(0, 10) : value;
  };

  const handleAccountNumberInput = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    e.target.value = value.length > 17 ? value.slice(0, 17) : value;
  };

  const handleIFSCInput = (e) => {
    e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  };

  const handleEmailInput = (e) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    e.target.setCustomValidity(
      !emailPattern.test(e.target.value)
        ? "Please enter a valid email address"
        : ""
    );
  };

  return (
    // <div className="flex ">
    //   <Sidebar />

    //   <div className="min-h-screen w-full flex justify-center flex-grow-1 items-center bg-indigo-100">
    <div className="w-full max-w-3xl px-4 ">
      <h1 className="text-4xl font-bold mb-7 text-center">Add Executive</h1>
      <form className="w-full" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-7 md:flex-row md:space-x-4 mb-4">
          <InputField
            label="Full Name"
            name="fullname"
            type="text"
            value={executive.fullname}
            onChange={handleChange}
            required
            onInput={handleCharInput}
          />
          <InputField
            label="Email"
            name="email"
            type="email"
            value={executive.email}
            onChange={handleChange}
            required
            onInput={handleEmailInput}
          />
        </div>
        <div className="flex flex-col gap-7 md:flex-row md:space-x-4 mb-4">
          <InputField
            label="Contact number"
            name="number"
            type="text"
            onInput={handleContactNumberInput}
            value={executive.number}
            onChange={handleChange}
            required
          />
          <PasswordInput
            label="Password"
            name="password"
            value={executive.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col gap-7 md:flex-row md:space-x-4 mb-4">
        
          <InputField
            label="City"
            name="city"
            type="text"
            onInput={handleCharInput}
            value={executive.city}
            onChange={handleChange}
            required
          />
           <InputField
            label="Account Holder Name"
            name="account_holder_name"
            type="text"
            onInput={handleCharInput}
            value={executive.account_holder_name}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-7 md:flex-row md:space-x-4 mb-4">
         
          <InputField
            label="Account Number"
            name="account_number"
            type="text"
            onInput={handleAccountNumberInput}
            value={executive.account_number}
            onChange={handleChange}
          />

<InputField
            label="Bank Name"
            name="bank_name"
            type="text"
            onInput={handleCharInput}
            value={executive.bank_name}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-7 md:flex-row md:space-x-4 mb-4">
         
          <InputField
            label="IFSC Code"
            name="ifsc_code"
            type="text"
            onInput={handleIFSCInput}
            value={executive.ifsc_code}
            onChange={handleChange}
            style={{width:"345px"}}
          />
        </div>
        <div className="flex justify-center gap-7 mt-7">
          <ButtonBox
            label="Submit"
            type="submit"
            className="bg-blue-800 hover:bg-blue-400 text-white font-bold py-3 px-8 rounded-full"
          />
          <ButtonBox
            label="Discard"
            onClick={handleDiscard}
            className="bg-blue-800 hover:bg-blue-400 text-white font-bold py-3 px-8 rounded-full"
          />
        </div>
      </form>
    </div>
    //   </div>
    // </div>
  );
};

export default AddExecutive;
