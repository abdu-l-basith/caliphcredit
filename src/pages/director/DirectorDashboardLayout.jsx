import React from 'react'
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../App';

function DirectorDashboardLayout() {
    const { logout } = useAuth()
    const navigate = useNavigate()
    const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <div>
        <h1>DirectorDashboardLayout</h1>
        <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default DirectorDashboardLayout