import React, { useState } from "react";
import SideBar from "../../Components/SideBar/SideBar";
import { styled } from "@mui/material/styles";

import CreateProposal from "../Proposal/CreateProposal";
import ViewProposal from "../Proposal/ViewProposal";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Event = () => {
  const [activeSection, setActiveSection] = useState("Create Proposal");

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
      {/* Make sure the SideBar has 100% height */}
      <SideBar className="h-full" />

      {/* Adjust flex-grow and h-full for main content to ensure full height */}
      <div className="w-full h-full bg-indigo-100 flex justify-center flex-grow">
        <div className="p-4 w-full flex flex-col h-full">
          <DrawerHeader />

          {/* Tab section */}
          <div className="items-center flex justify-start gap-4 bg-indigo-200 border-b-2 border-white">
            <p
              className={getTabClasses("Create Proposal")}
              onClick={() => handleOpen("Create Proposal")}
            >
              Create Proposal
            </p>
            <p
              className={getTabClasses("View Proposal")}
              onClick={() => handleOpen("View Proposal")}
            >
              View Proposal
            </p>
          </div>

          {/* Content section */}
          <div
            className="bg-indigo-200 flex items-start justify-center p-6 shadow-2xl border border-transparent rounded-md flex-grow"
            // Remove hardcoded height, let flex layout take over
          >
            {activeSection === "Create Proposal" && <CreateProposal />}
            {activeSection === "View Proposal" && <ViewProposal />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Event;
