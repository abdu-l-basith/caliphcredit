import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TopBar from './components/common/TopBar';
import HeaderBar from './components/common/HeaderBar';
import Footer from './components/common/Footer';
import FacultyDashboard from './components/faculty/FacultyDashboard';
import AcademicPerformanceForm from './components/faculty/AcademicPerformanceForm';
import DashboardLayout from './components/common/DashboardLayout';
import FacultyLogin from './components/faculty/FacultyLogin';
import SuperAdminLogin from './components/superadmin/SuperAdminLogin'
import SuperAdminHome from './components/superadmin/SuperAdminHome'
import DirectorLogin from './components/director/DirectorLogin';
import DirectorDashboardLayout from './components/director/DirectorDashboardLayout';


function App() {
  return (
    <div className='app-container'>
    {/* <BrowserRouter>
      <Routes>
        <Route path="/" element={<FacultyLogin />} />
        <Route path="/dashboard" element={<DashboardLayout />} />
        <Route path="/basith-login" element={<SuperAdminLogin />} />
        <Route path="/basith-home" element={<SuperAdminLogin />} />
        <Route path="/admin" element={<DirectorLogin />} />
        <Route path="/director" element={<DirectorDashboardLayout />} />
      </Routes>
    </BrowserRouter> */}
    <DashboardLayout></DashboardLayout>
   
    </div>
  
  );
}

export default App;
