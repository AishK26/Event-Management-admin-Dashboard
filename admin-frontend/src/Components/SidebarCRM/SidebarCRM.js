import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SideBarCRM.css';
import { FaBars, FaThLarge, FaUser, FaListUl, FaSearch, FaTasks, FaRegListAlt, FaSignOutAlt } from 'react-icons/fa';

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
    <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        <FaBars />
      </button>

      <div className="menu">
        <Link to="/" className="menu-item">
          {!isExpanded && <FaThLarge />}
          {isExpanded && <span className="menu-text">Add Client</span>}
        </Link>

        <div className="menu-item" onClick={() => toggleDropdown('add')}>
          {!isExpanded && <FaUser />}
          {isExpanded && <span className="menu-text">View Client</span>}
          {isExpanded && dropdownOpen === 'add' && (
            <div className="dropdown-menu">
              <Link to="/addmanager" className="dropdown-item">Edit Details</Link>
            </div>
          )}
        </div>

        <Link to="/addenquiry" className="menu-item">
          {!isExpanded && <FaListUl />}
          {isExpanded && <span className="menu-text">View History</span>}
        </Link>

      </div>
    </div>
  );
};

export default Sidebar;