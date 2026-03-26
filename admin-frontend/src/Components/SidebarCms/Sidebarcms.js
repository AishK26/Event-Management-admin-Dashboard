import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebarcms.css';
import { FaBars, FaThLarge, FaUser, FaListUl, FaSearch, FaTasks, FaRegListAlt, FaSignOutAlt } from 'react-icons/fa';
import { MdOutlineLocationCity } from "react-icons/md";
import { MdEventNote } from "react-icons/md";
import { TbLogs } from "react-icons/tb";

const Sidebarcms = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleDropdown = (menu) => {
    setDropdownOpen(dropdownOpen === menu ? null : menu);
  };

  return (
    <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        <FaBars />
      </button>

      <div className="menu">

        <div className="menu-item" onClick={() => toggleDropdown('add')}>
          {!isExpanded && <MdEventNote size={25} />}
          {isExpanded && <span className="menu-text">Event</span>}
          {isExpanded && dropdownOpen === 'add' && (
            <div className="dropdown-menu">
              <Link to="/addEvent" className="dropdown-item">Add Event</Link>
              <Link to="/viewEvents" className="dropdown-item">view Event</Link>
            </div>
          )}
        </div>

        <div className="menu-item" onClick={() => toggleDropdown('add')}>
          {!isExpanded && <MdOutlineLocationCity size={25}/>}
          {isExpanded && <span className="menu-text">Venue</span>}
          {isExpanded && dropdownOpen === 'add' && (
            <div className="dropdown-menu">
              <Link to="/addVenue" className="dropdown-item">Add Venue</Link>
              <Link to="/viewVenue" className="dropdown-item">view Venue</Link>
            </div>
          )}
        </div>

        <div className="menu-item" onClick={() => toggleDropdown('add')}>
          {!isExpanded && <TbLogs  size={25}/>}
          {isExpanded && <span className="menu-text">Blog</span>}
          {isExpanded && dropdownOpen === 'add' && (
            <div className="dropdown-menu">
              <Link to="/addBlogs" className="dropdown-item">Add Blog</Link>
              <Link to="/viewBlogs" className="dropdown-item">view Blog</Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Sidebarcms;