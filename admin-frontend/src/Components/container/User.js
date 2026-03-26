import React, { useState } from "react";
import SideBar from "../../Components/SideBar/SideBar";
import { styled } from "@mui/material/styles";
import AddManager from "../Manager/AddManager";
import AddExecutive from "../Executive/AddExecutive";
import ExecutiveDetails from "../UserDetails/ExecutiveDetails";
import ManagerDetails from "../UserDetails/ManagerDetails";
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const User = () => {
  const [activeSection, setActiveSection] = useState("Add Manager");

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

      <div className="w-full h-screen bg-indigo-100 flex justify-center flex-grow-1 lg:flex-1 ">
        <div className=" p-4 w-full  flex flex-col  ">
          <DrawerHeader />

          <div className="items-center flex justify-start h-auto gap-4 bg-indigo-200 border-b-2 border-white flex-wrap w-full">
            <p
              className={getTabClasses("Add Manager")}
              onClick={() => handleOpen("Add Manager")}
            >
              Add Manager
            </p>
            <p
              className={getTabClasses("Add Executive")}
              onClick={() => handleOpen("Add Executive")}
            >
              Add Executive
            </p>
            <p
              className={getTabClasses("View Manager")}
              onClick={() => handleOpen("View Manager")}
            >
              View Manager
            </p>
            <p
              className={getTabClasses("View Executive")}
              onClick={() => handleOpen("View Executive")}
            >
              View Executive
            </p>
          </div>

          <div
            className="bg-indigo-200 flex items-start justify-center p-6 shadow-2xl border border-transparent rounded-md "
            // style={{ height: "80vh" }}
          >
            {activeSection === "Add Manager" && <AddManager />}
            {activeSection === "Add Executive" && <AddExecutive />}
            {activeSection === "View Manager" && <ManagerDetails />}
            {activeSection === "View Executive" && <ExecutiveDetails />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
