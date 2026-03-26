import React, { useState } from "react";
import SideBar from "../../Components/SideBar/SideBar";
import { styled } from "@mui/material/styles";
import AddEnquiry from "../Enquiry/AddEnquiry";
import ViewEnquiry from "../Enquiry/ViewEnquiry";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Enquiry = () => {
  const [activeSection, setActiveSection] = useState("Add Enquiry");

  const handleOpen = (section) => {
    setActiveSection(section);
  };

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

        <div className="flex items-center justify-start gap-4 bg-indigo-200 border-b-2 border-white">
          <p
            className={getTabClasses("Add Enquiry")}
            onClick={() => handleOpen("Add Enquiry")}
          >
            Add Enquiry
          </p>
          <p
            className={getTabClasses("View Enquiry")}
            onClick={() => handleOpen("View Enquiry")}
          >
            View Enquiry
          </p>
        </div>

        <div
          className="flex-grow bg-indigo-200 flex items-start justify-center p-6 shadow-2xl border border-transparent rounded-md"
          style={{ minHeight: "80vh" }}
        >
          {activeSection === "Add Enquiry" && <AddEnquiry />}
          {activeSection === "View Enquiry" && <ViewEnquiry />}
        </div>
      </div>
    </div>
  );
};

export default Enquiry;
