import React from 'react';
import './DirectorSidebar.css';
import { useAuth } from '../../App';
import { useNavigate } from 'react-router-dom';

function DirectorSidebar({ isOpen, closeSidebar, setCurrentPage }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <ul>
        <li onClick={() => { setCurrentPage('dashboard'); closeSidebar(); }}>Dashboard</li>
        <li onClick={() => { setCurrentPage('students'); closeSidebar(); }}>Students</li>
        <li onClick={() => { setCurrentPage('menters'); closeSidebar(); }}>Menters</li>
        <li onClick={() => { setCurrentPage('credits'); closeSidebar(); }}>Credits</li>      
        <li onClick={() => { setCurrentPage('logs'); closeSidebar(); }}>Logs</li>
        <li onClick={() => { setCurrentPage('profile'); closeSidebar(); }}>Profile</li>        
        <li onClick={handleLogout}>Logout</li>
      </ul>
    </div>
  );
}

export default DirectorSidebar;
