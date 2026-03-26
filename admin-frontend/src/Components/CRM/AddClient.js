import React, { useState } from "react";
import ButtonBox from "../ButtonBox/ButtonBox";
import InputField from "../InputField/InputField";
import { createClient } from "../../Services/CRM";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../SideBar/SideBar";

const AddClient = () => {
  const [client, setClient] = useState({
    full_name: "",
    email: "",
    contact_number: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Validate full name (only alphabets and spaces)
    if (!client.full_name.trim()) {
      newErrors.full_name = "Full Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(client.full_name)) {
      newErrors.full_name = "Full Name should contain only letters and spaces";
    }

    // Validate email
    if (!client.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/.test(client.email)
    ) {
      newErrors.email = "Invalid email address";
    }

    // Validate contact number (10 digits)
    if (!client.contact_number.trim()) {
      newErrors.contact_number = "Contact Number is required";
    } else if (!/^\d{10}$/.test(client.contact_number)) {
      newErrors.contact_number = "Contact Number should be a 10-digit number";
    }

    // Validate address (required)
    if (!client.address.trim()) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);

    // If no errors, return true, otherwise return false
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // First, validate the form
    if (!validateForm()) {
      console.log("Validation failed");
      return; // Stop further execution if validation fails
    }
    console.log(client);
    // If validation passes, proceed with form submission
    setLoading(true);
    try {
      const response = await createClient(client); // Make sure `createClient` uses the correct data
      console.log("Client created Successfully", response);
      alert("Client created Successfully");
      setClient({
        full_name: "",
        email: "",
        contact_number: "",
        address: "",
      });
    } catch (error) {
      console.error("Error creating Client:", error);
      alert("Error creating Client: " + error.message); // Correct usage of alert
    } finally {
      setLoading(false); // Ensure loading state is updated regardless of success or failure
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    // <div className="flex">
    //   <Sidebar />
    //   <div className="h-screen flex justify-center bg-indigo-100 w-full ">
    //     <div className=" flex max-w-3xl px-4 m-7 mt-7 justify-center">
    //       <div className=" flex justify-center align-middle items-center">
    <div className="w-full h-screen max-w-3xl px-4 ">
      <h1 className="text-4xl font-bold mb-7 text-center ">Add Client</h1>
      <form className="w-full" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-7 md:flex-row md:space-x-4 mb-4">
          <InputField
            label="Full Name"
            name="full_name"
            type="text"
            value={client.full_name}
            onChange={handleChange}
            required
            error={errors.full_name}
          />
          <InputField
            label="Email"
            name="email"
            type="email"
            value={client.email}
            onChange={handleChange}
            required
            error={errors.email}
          />
        </div>
        <div className="flex flex-col gap-7 md:flex-row md:space-x-4 mt-7 mb-4">
          <InputField
            label="Contact Number"
            name="contact_number"
            type="text"
            value={client.contact_number}
            onChange={handleChange}
            required
            error={errors.contact_number}
          />
          <InputField
            label="Address"
            name="address"
            type="text"
            value={client.address}
            onChange={handleChange}
            required
            error={errors.address}
          />
        </div>

        <div className="flex justify-end">
          <ButtonBox
            label="Add Client"
            className="p-4 rounded-full"
            type="submit"
          />
        </div>
      </form>
    </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default AddClient;
