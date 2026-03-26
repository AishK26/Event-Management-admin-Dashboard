import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SideBar.css";
import {
  FaBars,
  FaThLarge,
  FaUser,
  FaListUl,
  FaSearch,
  FaTasks,
  FaRegListAlt,
  FaSignOutAlt,
} from "react-icons/fa";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleDropdown = (menu) => {
    setDropdownOpen(dropdownOpen === menu ? null : menu);
  };

  return (
    <div className={`sidebar ${isExpanded ? "expanded" : "collapsed"}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        <FaBars />
      </button>

      <div className="menu">
        <Link to="/Dashboard" className="menu-item">
          {!isExpanded && <FaThLarge />}
          {isExpanded && <span className="menu-text">Dashboard</span>}
        </Link>

        <div className="menu-item" onClick={() => toggleDropdown("add")}>
          {!isExpanded && <FaUser />}
          {isExpanded && <span className="menu-text">User Management</span>}
          {isExpanded && dropdownOpen === "add" && (
            <div className="dropdown-menu">
              <Link to="/add" className="dropdown-item">
                {" "}
                Add
              </Link>
              <Link to="/view" className="dropdown-item">
                View
              </Link>
              {/* <Link to="/addvendor" className="dropdown-item">Vendor</Link> */}
            </div>
          )}
        </div>

        <div className="menu-item" onClick={() => toggleDropdown("create")}>
          {!isExpanded && <FaListUl />}
          {isExpanded && <span className="menu-text">Create Enquiry</span>}
          {isExpanded && dropdownOpen === "create" && (
            <div className="dropdown-menu">
              <Link to="/addenquiry" className="dropdown-item">
                {" "}
                Add
              </Link>
              <Link to="/viewenquiry" className="dropdown-item">
                View
              </Link>
              {/* <Link to="/addvendor" className="dropdown-item">Vendor</Link> */}
            </div>
          )}
        </div>

        <Link to="/createproposal" className="menu-item">
          {!isExpanded && <FaSearch />}
          {isExpanded && <span className="menu-text">Proposal</span>}
        </Link>

        <div className="menu-item" onClick={() => toggleDropdown("event")}>
          {!isExpanded && <FaRegListAlt />}
          {isExpanded && <span className="menu-text">Event</span>}
          {isExpanded && dropdownOpen === "event" && (
            <div className="dropdown-menu">
              <Link to="/statusupdate" className="dropdown-item">
                Status Update
              </Link>
              <Link to="/assignevent" className="dropdown-item">
                Assign Event
              </Link>
              <Link to="/eventdetails" className="dropdown-item">
                Event Details
              </Link>
            </div>
          )}
        </div>

        <div className="menu-item" onClick={() => toggleDropdown("task")}>
          {!isExpanded && <FaListUl />}
          {isExpanded && <span className="menu-text">View Task</span>}
          {isExpanded && dropdownOpen === "task" && (
            <div className="dropdown-menu">
              <Link to="/managertask" className="dropdown-item">
                Manager Task
              </Link>
              <Link to="/executivetask" className="dropdown-item">
                Executive Task
              </Link>
              {/* <Link to="/addvendor" className="dropdown-item">Vendor</Link> */}
            </div>
          )}
        </div>

        <div className="menu-item" onClick={() => toggleDropdown("list")}>
          {!isExpanded && <FaTasks />}
          {isExpanded && <span className="menu-text">Master</span>}
          {isExpanded && dropdownOpen === "list" && (
            <div className="dropdown-menu">
              <Link to="/list/manager" className="dropdown-item">
                Add Event
              </Link>
              {/* <Link to="/addstock" className="dropdown-item">Add Stock</Link> */}
              {/* <Link to="/list/vendor" className="dropdown-item">Vendor</Link> */}
            </div>
          )}
        </div>

        <div className="menu-item" onClick={() => toggleDropdown("task")}>
          {!isExpanded && <FaListUl />}
          {isExpanded && <span className="menu-text">Report</span>}
          {isExpanded && dropdownOpen === "task" && (
            <div className="dropdown-menu">
              <Link to="/eventreport" className="dropdown-item">
                Event Report
              </Link>
              <Link to="/enquiryreport" className="dropdown-item">
                Enquiry Report
              </Link>
              {/* <Link to="/addvendor" className="dropdown-item">Vendor</Link> */}
            </div>
          )}
        </div>

        <Link to="/" className="menu-item">
          {!isExpanded && <FaSignOutAlt />}
          {isExpanded && <span className="menu-text">Log Out</span>}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
