import React from 'react';
import './Sidebar.css';

function Sidebar({ isOpen, closeSidebar }) {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <ul>
        <li onClick={closeSidebar}>Profile</li>
        <li onClick={closeSidebar}>History</li>
        <li onClick={closeSidebar}>Settings</li>
        <li onClick={closeSidebar}>Logout</li>
      </ul>
    </div>
  );
}

export default Sidebar;
