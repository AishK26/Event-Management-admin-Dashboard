import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./Components/SignUp/SignUp";
import CreateTask from "./Components/ViewEvent/CreateTask";
import LogIn from "./Components/LogIn/LogIn";
import ViewEnquiry from "./Components/Enquiry/ViewEnquiry";
import ManagerDetails from "./Components/UserDetails/ManagerDetails";
import InputField from "./Components/InputField/InputField";
import ManagerProfile from "./Components/UserProfile/ManagerProfile";
import AddEnquiry from "./Components/Enquiry/AddEnquiry";
import ManagerTask from "./Components/ViewTask/ManagerTask";
import AdminProfile from "./Components/AdminProfile/AdminProfile";
import ChangePassword from "./Components/ChangePassword/ChangePassword";
import ExecutiveProfile from "./Components/UserProfile/ExecutiveProfile";
import ExecutiveDetails from "./Components/UserDetails/ExecutiveDetails";
import AddManager from "./Components/Manager/AddManager";
import AddExecutive from "./Components/Executive/AddExecutive";
import Sidebar from "./Components/SideBar/SideBar";
import Dashboard from "./Components/Dashboard/Dashboard";
import AddClient from "./Components/CRM/AddClient";
import AddStocks from "./Components/AddStocks/AddStocks";
import Proposal from "./Components/Proposal/Proposal";
import AddVendor from "./Components/AddVendor/AddVendor";
import EventReport from "./Components/Reports/EventReport";
import EnquiryReport from "./Components/Reports/EnquiryReport";
import ForgotPassword from "./Components/ForgotPass/ForgotPass";
import AddBlogs from "./Components/AddBlogs/AddBlogs";
import Add from "./Components/Add/Add";
import View from "./Components/View/View";
import ViewVendor from "./Components/ViewVendor/ViewVendor";
import ExecutiveTask from "./Components/ViewTask/ExecutiveTask";
import EventDetails from "./Components/ViewEvent/EventDetails";
import CreateProposal from "./Components/Proposal/CreateProposal";

import Feedback from "./Components/Feedback/Feedback";
import AddVenue from "./Components/AddVenue/AddVenue";
import AddEvent from "./Components/AddEvent/AddEvent";
import ViewBlogs from "./Components/AddBlogs/ViewBlogs";
import ViewEvents from "./Components/AddEvent/ViewEvent";
import ViewVenue from "./Components/AddVenue/ViewVenue";

import AddPayment from "./Components/PaymentDetails/AddPayment";
import ViewPayment from "./Components/PaymentDetails/ViewPayment";
import Notifications from "./Components/Notifications/Notification";

import AddEvent1 from "./Components/Master/AddEvent";
import ViewEvent1 from "./Components/Master/ViewEvent1";
import ViewClient from "./Components/CRM/ViewClient";
import ClientDetails from "./Components/CRM/ClientDetails";
import PaymentReport from "./Components/Reports/PaymentReport";
import ApprovedEvent from "./Components/ViewEvent/ApprovedEvent";
import ViewProposal from "./Components/Proposal/ViewProposal";
import User from "./Components/container/User";
import Task from "./Components/container/Task";
import Master from "./Components/container/Master";
import Event from "./Components/container/Event";
import PaymentCont from "./Components/container/PaymentCont";
import ProposalCont from "./Components/container/ProposalCont";
import Enquiry from "./Components/container/Enquiry";
import Client from "./Components/container/Client";
import ReportCont from "./Components/container/ReportCont";
import EditProposal from "./Components/Proposal/EditProposal";
import PageNotFound from "./Components/PageNotFound/PageNotFound";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<SignUp />} /> */}
        <Route path="/" element={<LogIn />} />
        <Route path="/manager-profile/:_id" element={<ManagerProfile />} />
        <Route path="/addmanager" element={<AddManager />} />
        <Route path="/addexecutive" element={<AddExecutive />} />
        <Route path="/executive-profile/:_id" element={<ExecutiveProfile />} />
        <Route path="/managerdetails" element={<ManagerDetails />} />
        <Route path="/executivedetails" element={<ExecutiveDetails />} />
        <Route path="/createtask" element={<CreateTask />} />
        <Route path="/viewenquiry" element={<ViewEnquiry />} />
        <Route path="/managertask" element={<ManagerTask />} />
        <Route path="/addenquiry" element={<AddEnquiry />} />
        <Route path="/Sidebar" element={<Sidebar />} />
        <Route path="/adminprofile" element={<AdminProfile />} />
        <Route path="/changepassword" element={<ChangePassword />} />
        <Route path="/addblog" element={<AddBlogs />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/addclient" element={<AddClient />} />
        {/* <Route path="/addstock" element={<AddStocks />} /> */}
        <Route path="/proposal" element={<Proposal />} />
        <Route path="/addvendor" element={<AddVendor />} />
        <Route path="/proposal/:id" element={<Proposal />} />
        <Route path="/eventreport" element={<EventReport />} />
        <Route path="/enquiryreport" element={<EnquiryReport />} />
        <Route path="/viewvendor" element={<ViewVendor />} />
        <Route path="/add" element={<Add />} />
        <Route path="/view" element={<View />} />
        <Route path="/executivetask" element={<ExecutiveTask />} />
        <Route path="/eventdetails" element={<EventDetails />} />
        <Route path="/createproposal" element={<CreateProposal />} />
        <Route path="/advancepayment" element={<AddPayment />} />
        <Route path="/viewadvancepayment" element={<ViewPayment />} />
        <Route path="/addBlogs" element={<AddBlogs />} />
        <Route path="/AddVendor" element={<AddVendor />} />
        <Route path="/viewVendor" element={<ViewVendor />} />
        <Route path="/Feedback" element={<Feedback />} />
        <Route path="/addVenue" element={<AddVenue />} />
        <Route path="/addEvent" element={<AddEvent />} />
        <Route path="/viewBlogs" element={<ViewBlogs />} />
        <Route path="/viewEvents" element={<ViewEvents />} />
        <Route path="/viewVenue" element={<ViewVenue />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/paymentreport" element={<PaymentReport />} />
        <Route path="/addevent1" element={<AddEvent1 />} />
        <Route path="/viewevent1" element={<ViewEvent1 />} />
        <Route path="/ViewClient" element={<ViewClient />} />
        <Route path="/client/:clientId" element={<ClientDetails />} />
        <Route path="/approvedevent" element={<ApprovedEvent />} />
        <Route path="/viewproposal" element={<ViewProposal />} />
        <Route path="/edit-proposal/:id" component={EditProposal} />
        <Route path="/tasks" element={<Task />} />
        <Route path="/usermanagement" element={<User />} />
        <Route path="/master" element={<Master />} />
        <Route path="/eventcontainer" element={<Event />} />
        <Route path="/paymentcontainer" element={<PaymentCont />} />
        <Route path="/proposalcontainer" element={<ProposalCont />} />
        <Route path="/enquirycontainer" element={<Enquiry />} />
        <Route path="/clientcontainer" element={<Client />} />
        <Route path="/reportcontainer" element={<ReportCont />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
