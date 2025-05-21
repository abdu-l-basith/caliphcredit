import React from 'react';
import './Sidebar.css';
import { useAuth } from '../../App';
import { useNavigate } from 'react-router-dom';

function Sidebar({ isOpen, closeSidebar, setCurrentPage }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <ul>
        <li onClick={() => { setCurrentPage('dashboard'); closeSidebar(); }}>Home</li>
        <li onClick={() => { setCurrentPage('profile'); closeSidebar(); }}>Profile</li>
        <li onClick={() => { setCurrentPage('history'); closeSidebar(); }}>History</li>
        <li onClick={() => { setCurrentPage('settings'); closeSidebar(); }}>Settings</li>
        <li onClick={handleLogout}>Logout</li>
      </ul>
    </div>
  );
}

export default Sidebar;
