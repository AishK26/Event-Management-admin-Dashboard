import React, { useState } from "react";
import SideBar from "../../Components/SideBar/SideBar";
import { styled } from "@mui/material/styles";

import ApprovedEvent from "../ViewEvent/ApprovedEvent";
import EventDetails from "../ViewEvent/EventDetails";
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Event = () => {
  const [activeSection, setActiveSection] = useState("Approved Events");

  const handleOpen = (section) => {
    setActiveSection(section);
  };

  // Define a function to check if a section is active and return the appropriate class
  const getTabClasses = (section) => {
    return activeSection === section
      ? "text-blue-700 border-b-2 border-blue-700 px-4 py-2 font-bold"
      : "text-black px-4 py-2 hover:border-b-2 hover:text-blue-700 cursor-pointer font-bold";
  };

  return (
    <div className="flex">
      <SideBar />

      <div className="w-full h-full bg-indigo-100 flex justify-center flex-grow ">
        <div className="  w-full  flex flex-col  ">
          <DrawerHeader />

          <div className="items-center flex justify-start  gap-4 bg-indigo-200 border-b-2 border-white ">
            <p
              className={getTabClasses("Approved Events")}
              onClick={() => handleOpen("Approved Events")}
            >
              Approved Events
            </p>
            <p
              className={getTabClasses("Event Details")}
              onClick={() => handleOpen("Event Details")}
            >
              Event Details
            </p>
          </div>

          <div
            className="bg-indigo-200 flex items-start justify-center h-full shadow-2xl border border-transparent rounded-md "
            // style={{ height: "100vh" }}
          >
            {activeSection === "Event Details" && <EventDetails />}
            {activeSection === "Approved Events" && <ApprovedEvent />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Event;
