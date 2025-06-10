import React, { useState } from 'react';
import TopBar from '../../components/common/TopBar';
import Sidebar from '../../components/faculty/FacultySidebar';
import './FacultyDashboardLayout.css';
import Footer from '../../components/common/Footer';
import FacultyDashboard from '../../components/common/AddCreditMenus';
import Profile from '../../components/faculty/FacultyProfile';
import FacultyHistory from '../../components/faculty/FacultyHistory';


function FacultyDashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard'); // This drives renderContent

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <FacultyDashboard />;
      case 'profile':
        return <Profile setCurrentPage={setCurrentPage} />;
      case 'history':
        return <FacultyHistory />;
      default:
        return <FacultyDashboard />;
    }
  };

  return (
    <div className="faculty-dashboard-layout">
      <TopBar toggleSidebar={toggleSidebar} />
      <div className="faculty-dashboard-main-wrapper">
      <Sidebar
        isOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
        setCurrentPage={setCurrentPage} // 👈 Pass this down
      />
      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)}></div>}
      <main className="faculty-dashboard-content">
        {renderContent()}
      </main>
      </div>
      <Footer />
    </div>
  );
}

export default FacultyDashboardLayout;
