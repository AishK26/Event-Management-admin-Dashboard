import React, { useState } from "react";
import SideBar from "../../Components/SideBar/SideBar";
import { styled } from "@mui/material/styles";
import AddEvent1 from "../Master/AddEvent";
import ViewEvent1 from "../Master/ViewEvent1";
import AddVendor from "../AddVendor/AddVendor";
import ViewVendor from "../ViewVendor/ViewVendor";
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));  

const Master = () => {
  const [activeSection, setActiveSection] = useState("Add Event");

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
    <div className="flex h-full md:max-xl:h-screen  w-full">
      <SideBar />
    
      <div className=" h-full w-full bg-indigo-100 flex justify-center flex-grow ">
        <div className=" p-4 w-full  flex flex-col  ">
          <DrawerHeader />

          <div className="items-center flex justify-start  gap-2 bg-indigo-200 border-b-2 border-white ">
            <p
              className={getTabClasses("Add Event")}
              onClick={() => handleOpen("Add Event")}
            >
              Add Event
            </p>
            <p
              className={getTabClasses("Add Vendor")}
              onClick={() => handleOpen("Add Vendor")}
            >
              Add Vendor{" "}
            </p>
            <p
              className={getTabClasses("View Event")}
              onClick={() => handleOpen("View Event")}
            >
              View Event{" "}
            </p>
            <p
              className={getTabClasses("View Vendor")}
              onClick={() => handleOpen("View Vendor")}
            >
              View Vendor{" "}
            </p>
          </div>

          <div
            className="bg-indigo-200 flex items-start justify-center p-6 shadow-2xl border border-transparent rounded-md "
            // style={{ height: "80vh" }}
          >
            {activeSection === "Add Event" && <AddEvent1 />}
            {activeSection === "Add Vendor" && <AddVendor />}
            {activeSection === "View Event" && <ViewEvent1 />}
            {activeSection === "View Vendor" && <ViewVendor />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Master;
