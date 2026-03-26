import Chart from "./chart";
import { LuWallet } from "react-icons/lu";
import { CiMenuKebab } from "react-icons/ci";
import { IoPieChartOutline } from "react-icons/io5";
import { LiaPeopleCarrySolid } from "react-icons/lia";
import { BsPersonVcard } from "react-icons/bs";
import { BsPersonBoundingBox } from "react-icons/bs";
import { BsFillClipboard2PulseFill } from "react-icons/bs";
import { styled, useTheme } from "@mui/material/styles";
import { CiTimer } from "react-icons/ci";
import event from "./../../Images/event.png";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "../SideBar/SideBar";
import "./Dashboard.css";
import React, { useEffect, useState } from 'react';
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));
const Dashboard = () => {
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  const [totalEnquiries, setTotalEnquiries] = useState(0);

  useEffect(() => {
    // Fetch Total Events Count
    const fetchTotalEvents = async () => {
      try {
        const response = await fetch('https://demo.internsbee.in/api/enquiry/confirm');
        const data = await response.json();
        setTotalEvents(data.result.length);
      } catch (error) {
        console.error('Error fetching total events:', error);
      }
    };

    // Fetch Total Clients Count
    const fetchTotalClients = async () => {
      try {
        const response = await fetch('https://demo.internsbee.in/api/clients');
        const data = await response.json();
        setTotalClients(data.result.length);
      } catch (error) {
        console.error('Error fetching total clients:', error);
      }
    };

    // Fetch Total Enquiries Count
    const fetchTotalEnquiries = async () => {
      try {
        const response = await fetch('https://demo.internsbee.in/api/enquiry');
        const data = await response.json();
        setTotalEnquiries(data.result.length);
      } catch (error) {
        console.error('Error fetching total enquiries:', error);
      }
    };

    fetchTotalEvents();
    fetchTotalClients();
    fetchTotalEnquiries();
  }, []);



  return (
    <div className="flex">
      <Sidebar />

      <div className="w-full md:h-full lg:h-full bg-indigo-100 flex justify-center flex-grow ">
        <div className=" p-4 w-full  flex flex-col  ">
          <DrawerHeader />
          <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4  gap-4 m-4">
            <motion.div
              className="flex flex-col justify-center items-center w-full h-40 bg-indigo-200 dark:bg-slate-900/50 p-6 rounded-xl shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Link
                to={"/clientcontainer"}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <img src={event} alt="event" width="140px" />
                <motion.div
                  initial={{ opacity: 0, x: -20 }} // Text slides in from the left
                  animate={{ opacity: 1, x: 0 }} // Final position
                  transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }} // Delay to sync with the number animation
                  className="text-indigo-950 dark:text-slate-400 text-xl  font-bold gradient-text"
                >
                  Create Client
                </motion.div>{" "}
              </Link>
            </motion.div>
            <motion.div
              className="flex flex-col justify-between w-full h-40 bg-white dark:bg-slate-900/50 p-6 rounded-xl shadow-lg "
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              {" "}
              <div className="flex w-full items-center justify-between">
                <motion.div
                  initial={{
                    rotate: 0,
                    color: ["#4A90E2", "#50E3C2", "#F5A623", "#D0021B"],
                  }} // Initial rotation state on page load
                  animate={{ rotate: 360 }} // Rotating the icon on page load
                  transition={{
                    rotate: { duration: 2, ease: "linear", repeat: 0 }, // Continuous rotation
                    color: { duration: 2, repeat: Infinity, ease: "linear" }, // Continuous color change
                    scale: { duration: 0.2, ease: "easeInOut" }, // Smooth scaling
                  }}
                >
                <Link to="/eventcontainer">
                  <IoPieChartOutline className="text-4xl" />
                  </Link>
                </motion.div>
                {/* <div className="flex items-center justify-center w-10 h-10 dark:text-slate-400 bg-indigo-200 dark:bg-slate-900/50 rounded-full">
                  <CiMenuKebab />
                </div> */}
              </div>
              <motion.div
                initial={{ opacity: 0, x: -20 }} // Text slides in from the left
                animate={{ opacity: 1, x: 0 }} // Final position
                transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }} // Delay to sync with the number animation
                className="text-indigo-950 dark:text-slate-400 text-4xl  font-bold gradient-text"
              >
                {" "}
                {totalEvents}
              </motion.div>{" "}
              <div>
              <Link to="/eventcontainer">
                <motion.div
                  initial={{ opacity: 0, x: -20 }} // Text slides in from the left
                  animate={{ opacity: 1, x: 0 }} // Final position
                  transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }} // Delay to sync with the number animation
                  className="text-indigo-950 dark:text-slate-400 text-xl font-bold  gradient-text"
                >
                  {" "}
                  Total Events
                </motion.div>{" "}
                </Link>
              </div>
            </motion.div>
            <motion.div
              className="flex flex-col justify-between w-full h-40 bg-white dark:bg-slate-900/50 p-6 rounded-xl shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              {" "}
              <div className="flex w-full items-center justify-between">
                <motion.div
                  initial={{
                    rotate: 0,
                    color: ["#4A90E2", "#50E3C2", "#F5A623", "#D0021B"],
                  }} // Initial rotation state on page load
                  animate={{ rotate: 360 }} // Rotating the icon on page load
                  transition={{
                    rotate: { duration: 2, ease: "linear", repeat: 0 }, // Continuous rotation
                    color: { duration: 2, repeat: Infinity, ease: "linear" }, // Continuous color change
                    scale: { duration: 0.2, ease: "easeInOut" }, // Smooth scaling
                  }}
                >
                <Link to="/ViewClient">
                  <LiaPeopleCarrySolid className="text-4xl text-indigo-950 dark:text-slate-400" />
                  </Link>
                </motion.div>{" "}
                
                {/* <div className="flex items-center justify-center dark:text-slate-400 w-10 h-10 bg-indigo-200 dark:bg-slate-900 rounded-full">
                  <CiMenuKebab />
                </div> */}
              </div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }} // Text slides in from the left
                animate={{ opacity: 1, x: 0 }} // Final position
                transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }} // Delay to sync with the number animation
                className="text-indigo-950 dark:text-slate-400 text-4xl  font-bold gradient-text"
              >
                {" "}
                {totalClients}
              </motion.div>{" "}
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }} // Text slides in from the left
                  animate={{ opacity: 1, x: 0 }} // Final position
                  transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }} // Delay to sync with the number animation
                  className="text-indigo-950 dark:text-slate-400 text-xl font-bold  gradient-text"
                >
                <Link to="/ViewClient">
                  Total Clients
                  </Link>
                </motion.div>
              </div>
              
            </motion.div>{" "}
            <motion.div
              className="flex flex-col justify-between w-full h-40 bg-white dark:bg-slate-900/50 p-6 rounded-xl shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              {" "}
              <div className="flex w-full items-center justify-between">
                <motion.div
                  initial={{
                    rotate: 0,
                    color: ["#6a82fb", "#fc5c7d", "#F5A623", "#D0021B"],
                  }} // Initial rotation state on page load
                  animate={{ rotate: 360 }} // Rotating the icon on page load
                  transition={{
                    rotate: { duration: 2, ease: "linear", repeat: 0 }, // Continuous rotation
                    color: { duration: 2, repeat: Infinity, ease: "linear" }, // Continuous color change
                    scale: { duration: 0.2, ease: "easeInOut" }, // Smooth scaling
                  }}
                >
                  {" "}
                  <BsPersonVcard className="text-4xl text-indigo-950 dark:text-slate-400" />
                </motion.div>{" "}
              </div>
              <motion.div
                initial={{ opacity: 0, x: -20 }} // Text slides in from the left
                animate={{ opacity: 1, x: 0 }} // Final position
                transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }} // Delay to sync with the number animation
                className="text-indigo-950 dark:text-slate-400 text-4xl  font-bold gradient-text"
              >
                {" "}
               64
              </motion.div>{" "}
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }} // Text slides in from the left
                  animate={{ opacity: 1, x: 0 }} // Final position
                  transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }} // Delay to sync with the number animation
                  className="text-indigo-950 dark:text-slate-400 text-xl font-bold  gradient-text"
                >
                  New Clients
                </motion.div>
              </div>
            </motion.div>{" "}
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4  gap-4 m-4">
            <motion.div
              className="flex flex-col justify-between w-full h-40 bg-white dark:bg-slate-900/50 p-6 rounded-xl shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex w-full items-center justify-between">
                <motion.div
                  initial={{
                    rotate: 0,
                    color: ["#6a82fb", "#fc5c7d", "#F5A623", "#D0021B"],
                  }} // Initial rotation state on page load
                  animate={{ rotate: 360 }} // Rotating the icon on page load
                  transition={{
                    rotate: { duration: 2, ease: "linear", repeat: 0 }, // Continuous rotation
                    color: { duration: 2, repeat: Infinity, ease: "linear" }, // Continuous color change
                    scale: { duration: 0.2, ease: "easeInOut" }, // Smooth scaling
                  }}
                >
                  {" "}
                  <BsPersonBoundingBox className="text-4xl text-indigo-950 dark:text-slate-400" />
                </motion.div>{" "}
              </div>
              <motion.div
                initial={{ opacity: 0, x: -20 }} // Text slides in from the left
                animate={{ opacity: 1, x: 0 }} // Final position
                transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }} // Delay to sync with the number animation
                className="text-indigo-950 dark:text-slate-400 text-4xl  font-bold gradient-text"
              >
                {" "}
                64
              </motion.div>{" "}
              <div className="flex items-center justify-between w-full">
                <motion.div
                  initial={{ opacity: 0, x: -20 }} // Text slides in from the left
                  animate={{ opacity: 1, x: 0 }} // Final position
                  transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }} // Delay to sync with the number animation
                  className="text-indigo-950 dark:text-slate-400 text-xl font-bold  gradient-text"
                >
                 Todays Ongoing Events
                </motion.div>
              </div>
            </motion.div>{" "}
            <div className=" md:col-span-3 row-span-2 bg-white dark:bg-slate-900/50 rounded-xl shadow-lg">
              <Chart />
            </div>
            <motion.div
              className="flex flex-col justify-between w-full h- bg-white dark:bg-slate-900/50 p-6 rounded-xl shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex w-full items-center justify-between">
                <motion.div
                  initial={{
                    rotate: 0,
                    color: ["#6a82fb", "#fc5c7d", "#F5A623", "#D0021B"],
                  }} // Initial rotation state on page load
                  animate={{ rotate: 360 }} // Rotating the icon on page load
                  transition={{
                    rotate: { duration: 2, ease: "linear", repeat: 0 }, // Continuous rotation
                    color: { duration: 2, repeat: Infinity, ease: "linear" }, // Continuous color change
                    scale: { duration: 0.2, ease: "easeInOut" }, // Smooth scaling
                  }}
                >
                  {" "}
                  <BsFillClipboard2PulseFill className="text-4xl text-indigo-950 dark:text-slate-400" />
                </motion.div>{" "}
              </div>
              <motion.div
                initial={{ opacity: 0, x: -20 }} // Text slides in from the left
                animate={{ opacity: 1, x: 0 }} // Final position
                transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }} // Delay to sync with the number animation
                className="text-indigo-950 dark:text-slate-400 text-4xl  font-bold gradient-text"
              >
                {" "}
                6
              </motion.div>{" "}
              <div className="flex items-center justify-between w-full">
                <motion.div
                  initial={{ opacity: 0, x: -20 }} // Text slides in from the left
                  animate={{ opacity: 1, x: 0 }} // Final position
                  transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }} // Delay to sync with the number animation
                  className="text-indigo-950 dark:text-slate-400 text-xl font-bold  gradient-text"
                >
                  Enquiry Report
                </motion.div>
              </div>
            </motion.div>{" "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
