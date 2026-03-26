import React, { useState } from "react";
import SideBar from "../SideBar/SideBar";
import ButtonBox from "../ButtonBox/ButtonBox";
import { styled } from "@mui/material/styles";
import All from "../Notifications/All";
const events = [
  {
    id: 1,
    title: "[DEMO EVENT] TECH.CONF 2020 TOKYO",
    date: "2018/12/01 (Sat) 10:00",

    status: "Live",
    premium: true,
    received: "Executive",
  },
  {
    id: 2,
    title: "[DEMO EVENT] Secret Premium Party",
    date: "2018/12/01 (Sat) 19:00",

    status: "completed",
    premium: true,
    received: "manager",
  },
  {
    id: 3,
    title: "[DEMO EVENT] Birthday Party",
    date: "2018/12/01 (Sat) 19:00",

    status: "Upcoming",
    premium: true,
    received: "client",
  },
  {
    id: 4,
    title: "[DEMO EVENT] Anniversary",
    date: "2018/12/01 (Sat) 19:00",

    status: "Upcoming",
    premium: true,
    received: "client",
  },
  // Add more events as necessary
];

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Notification = () => {
  const [activeSection, setActiveSection] = useState("All");

  const handleOpen = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="flex">
      <SideBar />

      <div className="w-full h-screen bg-indigo-100 flex justify-center flex-grow">
        <div className="w-full p-4  flex flex-col gap-2">
          <DrawerHeader />
          <div className="items-center flex gap-4">
            <ButtonBox
              label="All"
              className="p-2"
              onClick={() => handleOpen("All")}
              isActive={activeSection === "All"}
            />
            <ButtonBox
              label="Manager"
              className="p-2"
              onClick={() => handleOpen("Manager")}
              isActive={activeSection === "Manager"}
            />
            <ButtonBox
              label="Executive"
              className="p-2"
              onClick={() => handleOpen("Executive")}
              isActive={activeSection === "Executive"}
            />
            <ButtonBox
              label="Client"
              className="p-2"
              onClick={() => handleOpen("Client")}
              isActive={activeSection === "Client"}
            />
          </div>
          <div className="space-y-4">
            <div className="mt-5">
              {activeSection === "All" && <All />}
              {activeSection === "Manager" && <All />}
              {activeSection === "Executive" && <All />}
              {activeSection === "Client" && <All />}
            </div>
          </div>
        </div>
        {/* <section className="mt-5 ">
        
          <div className="items-center flex gap-4">
            <div>
              <ButtonBox
                label="All"
                className="p-2"
                onClick={() => handleOpen("All")}
                isActive={activeSection === "All"}
              />
            </div>
            <ButtonBox
              label="Manager"
              className="p-2"
              onClick={() => handleOpen("Manager")}
              isActive={activeSection === "Manager"}
            />
            <ButtonBox
              label="Executive"
              className="p-2"
              onClick={() => handleOpen("Executive")}
              isActive={activeSection === "Executive"}
            />
            <ButtonBox
              label="Client"
              className="p-2"
              onClick={() => handleOpen("Client")}
              isActive={activeSection === "Client"}
            />
          </div>

        
        </section> */}
      </div>
    </div>
  );
};

export default Notification;
