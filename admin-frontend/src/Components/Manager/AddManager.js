import React, { useState } from "react";
import ButtonBox from "../ButtonBox/ButtonBox";
import InputField from "../InputField/InputField";
import PasswordInput from "../PasswordInput/PasswordInput";
import { createManager } from "../../Services/Auth";
import Sidebar from "../SideBar/SideBar";

const AddManager = () => {
  const [manager, setManager] = useState({
    fullname: "",
    email: "",
    contact: "",
    address: "",
    city: "",
    state: "",
    holder_name: "",
    account_number: "",
    IFSC_code: "",
    bank_name: "",
    branch_name: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setManager({
      ...manager,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createManager(manager); // Call the createManager API with the form data
      console.log("Manager created successfully:", response);
      alert(`${response.message}`);

      // Clear the form after successful submission
      setManager({
        fullname: "",
        email: "",
        contact: "",
        address: "",
        city: "",
        state: "",
        holder_name: "",
        account_number: "",
        IFSC_code: "",
        bank_name: "",
        branch_name: "",
        password: "",
      });
    } catch (error) {
      console.error("Error creating manager:", error);
      alert("An error occurred while creating the manager.");
    }
  };

  const handleDiscard = () => {
    // Clear the form data on discard
    setManager({
      fullname: "",
      email: "",
      contact: "",
      address: "",
      city: "",
      state: "",
      holder_name: "",
      account_number: "",
      IFSC_code: "",
      bank_name: "",
      branch_name: "",
      password: "",
    });
  };

  // Handle name, email, contact, Account No.,ifsc code input validations
  const handleCharInput = (e) => {
    e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
  };

  const handleContactNumberInput = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length > 10) {
      e.target.value = value.slice(0, 10);
    } else {
      e.target.value = value;
    }
  };

  const handleAccountNumberInput = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length > 17) {
      e.target.value = value.slice(0, 17);
    } else {
      e.target.value = value;
    }
  };

  const handleIFSCInput = (e) => {
    e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  };

  const handleEmailInput = (e) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(e.target.value)) {
      e.target.setCustomValidity("Please enter a valid email address");
    } else {
      e.target.setCustomValidity("");
    }
  };

  return (
    // <div className="flex ">
    //   {/* <Sidebar /> */}

    //   <div className="min-h-screen w-full flex justify-center flex-grow-1 items-center bg-indigo-100">
    <div className="w-full max-w-3xl px-4 ">
      <h1 className="text-4xl font-bold mb-7 text-center ">Add Manager</h1>
      <div className="">
        <form className="w-full" onSubmit={handleSubmit}>
          <div >
            <div>
              <div className="flex flex-col gap-7 md:flex-row md:space-x-4 mb-4">

                <InputField
                  label="Full Name"
                  name="fullname"
                  type="text"
                  onInput={handleCharInput}
                  value={manager.fullname}
                  onChange={handleChange}
                  required
                />
                <InputField
                  label="Email"
                  name="email"
                  type="email"
                  onInput={handleEmailInput}
                  value={manager.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col gap-7 md:flex-row md:space-x-4 mb-4">

                <InputField
                  label="Contact number"
                  name="contact"
                  type="text"
                  onInput={handleContactNumberInput}
                  value={manager.contact}
                  onChange={handleChange}
                  required
                />
                <PasswordInput
                  label="Password"
                  name="password"
                  value={manager.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col gap-7 md:flex-row md:space-x-4 mb-4">

                <InputField
                  label="Address"
                  name="address"
                  type="text"
                  value={manager.address}
                  onChange={handleChange}
                  required
                />
                <InputField
                  label="City"
                  name="city"
                  type="text"
                  onInput={handleCharInput}
                  value={manager.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col gap-7 md:flex-row md:space-x-4 mb-4">

                <InputField
                  label="State"
                  name="state"
                  type="text"
                  onInput={handleCharInput}
                  value={manager.state}
                  onChange={handleChange}
                  required
                />
                <InputField
                  label="Account Holder Name"
                  name="holder_name"
                  type="text"
                  onInput={handleCharInput}
                  value={manager.holder_name}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-7 md:flex-row md:space-x-4 mb-4">

                <InputField
                  label="Account Number"
                  name="account_number"
                  type="text"
                  onInput={handleAccountNumberInput}
                  value={manager.account_number}
                  onChange={handleChange}
                />
                <InputField
                  label="Bank Name"
                  name="bank_name"
                  type="text"
                  onInput={handleCharInput}
                  value={manager.bank_name}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-7 md:flex-row md:space-x-4 mb-4">

                <InputField
                  label="Branch Name"
                  name="branch_name"
                  type="text"
                  onInput={handleCharInput}
                  value={manager.branch_name}
                  onChange={handleChange}
                />
                <InputField
                  label="IFSC Code"
                  name="IFSC_code"
                  type="text"
                  onInput={handleIFSCInput}
                  value={manager.IFSC_code}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-7 mt-4">
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
    </div>
    //   </div>
    // </div>
  );
};

export default AddManager;
