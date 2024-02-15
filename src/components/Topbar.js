import React, { useState } from 'react';
import './Topbar.css'; // Make sure you create this CSS file
import { FaSearch, FaEllipsisV } from 'react-icons/fa'; // Importing the dropdown icon


const Topbar = () => {
      // State to manage dropdown visibility
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  // Function to toggle dropdown visibility
  const toggleDropdown = () => setIsDropdownVisible(!isDropdownVisible);

  return (
    <div className="topbar">
      <div className="search-container">
        <FaSearch className="search-icon" />
        <input type="search" placeholder="Search" className="search-bar" />
       <FaEllipsisV className="dropdown-icon" onClick={toggleDropdown} />

      </div>
      {/* Add additional buttons or profile icon here */}
    </div>
  );
};

export default Topbar;
