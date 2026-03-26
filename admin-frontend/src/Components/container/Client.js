import React, { useState } from "react";
import SideBar from "../../Components/SideBar/SideBar";
import { styled } from "@mui/material/styles";
import AddClient from "../CRM/AddClient";
import ViewClient from "../CRM/ViewClient";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Client = () => {
  const [activeSection, setActiveSection] = useState("Add Client");

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
    <div className="flex min-h-screen bg-indigo-100">
    <SideBar />

    <div className="w-full h-full flex-grow bg-indigo-100 flex flex-col">
      <DrawerHeader />
        

          <div className="items-center flex justify-start gap-4 bg-indigo-200 border-b-2 border-white ">
            <p
              className={getTabClasses("Add Client")}
              onClick={() => handleOpen("Add Client")}
            >
              Add Client
            </p>
            <p
              className={getTabClasses("View Client")}
              onClick={() => handleOpen("View Client")}
            >
              View Client
            </p>
          </div>

          <div className="bg-indigo-200 flex items-start justify-center  shadow-2xl border border-transparent rounded-md ">
            {activeSection === "Add Client" && <AddClient />}
            {activeSection === "View Client" && <ViewClient />}
          </div>
        
      </div>
    </div>
  );
};

export default Client;
