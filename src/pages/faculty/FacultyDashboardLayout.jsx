import React, { useState } from 'react';
import TopBar from '../../components/common/TopBar';
import Sidebar from '../../components/faculty/FacultySidebar';
import './FacultyDashboardLayout.css';
import Footer from '../../components/common/Footer';
import FacultyDashboard from '../../components/common/AddCreditMenus';
import Profile from '../../components/faculty/FacultyProfile';


function FacultyDashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard'); // This drives renderContent

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <FacultyDashboard />;
      case 'profile':
        return <Profile />;
      case 'history':
        return <div><h1>history</h1></div>;
      case 'settings':
        return <div><h1>settings</h1></div>;
      default:
        return <FacultyDashboard />;
    }
  };

  return (
    <div className="dashboard-layout">
      <TopBar toggleSidebar={toggleSidebar} />
      <Sidebar
        isOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
        setCurrentPage={setCurrentPage} // 👈 Pass this down
      />
      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)}></div>}
      <main className="dashboard-content">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
}

export default FacultyDashboardLayout;
