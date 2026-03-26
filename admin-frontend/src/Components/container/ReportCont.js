import React, { useState } from "react";
import SideBar from "../../Components/SideBar/SideBar";
import { styled } from "@mui/material/styles";
import EventReport from "../../Components/Reports/EventReport";
import EnquiryReport from "../../Components/Reports/EnquiryReport";
import PaymentReport from "../../Components/Reports/PaymentReport";
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const ReportCont = () => {
  const [activeSection, setActiveSection] = useState("Event Report");

  const handleOpen = (section) => {
    setActiveSection(section);
  };

  const getTabClasses = (section) => {
    return activeSection === section
      ? "text-blue-700 border-b-2 border-blue-700 px-4 py-2 font-bold"
      : "text-black px-4 py-2 hover:border-b-2 hover:text-blue-700 cursor-pointer font-bold";
  };
  return (
    <div className="flex">
      <SideBar />

      <div className="w-full h-screen bg-indigo-100 flex justify-center flex-grow ">
        <div className=" p-4 w-full  flex flex-col  ">
          <DrawerHeader />

          <div className="items-center flex justify-start gap-4 bg-indigo-200 border-b-2 border-white flex-wrap w-full">
            <p
              className={getTabClasses("Event Report")}
              onClick={() => handleOpen("Event Report")}
            >
              Event Report
            </p>
            <p
              className={getTabClasses("Enquiry Report")}
              onClick={() => handleOpen("Enquiry Report")}
            >
              Enquiry Report
            </p>
            <p
              className={getTabClasses("Payment Report")}
              onClick={() => handleOpen("Payment Report")}
            >
              Payment Report
            </p>
          </div>

          <div
            className="bg-indigo-200 flex items-start justify-center p-6 shadow-2xl border border-transparent rounded-md h-auto "
            // style={{ height: "82vh" }}
          >
            {activeSection === "Event Report" && <EventReport />}
            {activeSection === "Enquiry Report" && <EnquiryReport />}
            {activeSection === "Payment Report" && <PaymentReport />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCont;
