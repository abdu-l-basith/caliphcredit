import React, { useState } from 'react';
import TopBar from '../../components/common/TopBar';
import DirectorSidebar from '../../components/director/DirectorSidebar';
import './DirectorDashboardLayout.css';
import Footer from '../../components/common/Footer';
import FacultyDashboard from '../../components/common/AddCreditMenus';
import Profile from '../../components/faculty/FacultyProfile';
import DirectorDashboard from '../../components/director/DirectorDashboard';
import DirectorProfile from '../../components/director/DirectorProfile';
import Students from '../../components/director/Students';
import Mentors from '../../components/director/Mentors';
import AddCredit from '../../components/common/AddCredit';
import DirectorLogs from '../../components/director/DirectorLogs';
import AddCreditMenus from '../../components/common/AddCreditMenus';
import Credits from '../../components/director/Credits';


function DirectorDashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard'); // This drives renderContent

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DirectorDashboard />;
      case 'students':
        return <Students />;
      case 'menters':
        return <Mentors /> ;
        case 'profile':
        return <DirectorProfile />;
        case 'credits':
        return <Credits />;
        case 'logs':
        return <DirectorLogs /> ;
      default:
        return <DirectorDashboard />;
    }
  };

  return (
    <div className="director-dashboard-layout">
      <TopBar toggleSidebar={toggleSidebar} />
      <div className="director-dashboard-main-wrapper">
      <DirectorSidebar
        isOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
        setCurrentPage={setCurrentPage} // 👈 Pass this down
      />
      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)}></div>}
      <main className="director-dashboard-content">
        {renderContent()}
      </main>
      </div>
      <Footer />
    </div>
  );
}

export default DirectorDashboardLayout;
