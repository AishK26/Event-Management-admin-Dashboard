import axios from "axios";
import React, { useState } from "react";
import ButtonBox from "../ButtonBox/ButtonBox";
import InputField from "../InputField/InputField";
import Navbar from "../Navbar/Navbar";
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

const AddEvent1 = () => {
  const [formData, setFormData] = useState({
    event_name: "",
  });

  const navigate = useNavigate();

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to add the event
      const response = await axios.post(
        "https://demo.internsbee.in/api/event/add",
        formData
      );

      // Check if the response indicates success
      if (response.status === 200) {
        alert("Event added successfully!");
        setFormData({ event_name: "" }); // Clear form data
        // Optionally redirect to another page
        // navigate('/events'); // Redirect to events page or another relevant route
      }
    } catch (error) {
      // Handle errors such as validation failures or server errors
      alert(
        "Failed to add event: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleCharInput = (e) => {
    e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
  };

  return (
    <>
      {/* <div className="w-full max-w-3xl px-4 "> */}
      {/* <Sidebar /> */}
      {/* <div className="p-4 flex-grow-1 w-full"> */}
      <div className="w-full max-w-3xl px-4 ">
        <h1 className="text-4xl font-bold mb-6 text-center">Add Event</h1>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-7 md:flex-row md:space-x-4 mb-4 items-center justify-center">
            <InputField
              label="Add Event"
              name="event_name"
              type="text"
              placeholder="Enter event name"
              required
              value={formData.event_name}
              onChange={handleInputChange}
              onInput={handleCharInput}
            />
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center md:items-center space-y-4 md:space-y-0">
            <div className="flex justify-between gap-4 md:gap-7">
              <ButtonBox
                type="submit"
                label={"Add Event"}
                // className="bg-red-400 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full"
              />
              {/* <ButtonBox
                label="Discard"
                onClick={() => {
                  setFormData({ event_name: "" }); // Clear form data
                }}
                // className="bg-red-400 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full"
              /> */}
            </div>
          </div>
        </form>
      </div>
      {/* </div> */}
    </>
  );
};

export default AddEvent1;