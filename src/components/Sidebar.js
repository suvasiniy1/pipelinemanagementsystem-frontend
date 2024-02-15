import React from 'react';
import leadIcon from '../images/icons_252197.svg';
import dealsIcon from '../images/deal-svgrepo-com.svg'; // Update the path to where your icons are saved
import activitiesIcon from '../images/my-activities-3.svg';
import contactsIcon from '../images/211605_contact_icon.svg';
import insightsIcon from '../images/insight-svgrepo-com.svg';
import './Sidebar.css'; // Assuming Sidebar.css is in the same directory as Sidebar.js

// Import other icons similarly
const SidebarItem = ({ icon, text }) => {
    return (
      <li className="sidebar-item" data-tooltip={text}>
        <img src={icon} alt={text} />
      </li>
    );
  };
  
const Sidebar = () => {
  return (
    <nav className="sidebar">
      <ul>
        <SidebarItem icon={leadIcon} text="Lead" />
        <SidebarItem icon={dealsIcon} text="Deal" />
        <SidebarItem icon={activitiesIcon} text="Activities" />
        <SidebarItem icon={contactsIcon} text="Contacts" />
        <SidebarItem icon={insightsIcon} text="Insights" />
      </ul>
    </nav>
  );
};

export default Sidebar;
