import React from 'react';
import './TopBar.css';
import { FaBars } from 'react-icons/fa';

function TopBar({ toggleSidebar }) {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <img src="/images/logo.png" alt="Logo" className="logo" />
      </div>
      <div className="topbar-right">
        <div className="dashboard-text">
          <span>Dashboard</span>
          <p>Name</p>
        </div>
        <FaBars className="menu-icon" onClick={toggleSidebar} />
      </div>
    </div>
  );
}

export default TopBar;
