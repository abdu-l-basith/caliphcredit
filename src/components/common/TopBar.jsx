import React from 'react';
import './TopBar.css';
import { FaBars } from 'react-icons/fa';
import { useAuth } from '../../App'

function TopBar({ toggleSidebar }) {
  const {user} = useAuth(); 
  return (
    <div className="topbar">
      <div className="topbar-left">
        <img src="/images/logo.png" alt="Logo" className="logo" />
      </div>
      <div className="topbar-right">
        <div className="topbar-dashboard-text">
          <span>{user.userName}'s</span>
          <p>Dashboard</p>
        </div>
        <FaBars className="topbar-menu-icon" onClick={toggleSidebar} />
      </div>
    </div>
  );
}

export default TopBar;
