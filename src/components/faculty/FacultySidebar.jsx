import React from 'react';
import './FacultySidebar.css';
import { useAuth } from '../../App';
import { useNavigate } from 'react-router-dom';

function FacultySidebar({ isOpen, closeSidebar, setCurrentPage }) {
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
      </ul>
      <div className="faculty-topbar-logout-container">
        <button onClick={handleLogout} className='faculty-siderbar-logout-button'>Logout</button>
      </div>
      
    </div>
  );
}

export default FacultySidebar;
