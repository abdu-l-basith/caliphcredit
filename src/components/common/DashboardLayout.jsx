import React, { useState } from 'react';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import './DashboardLayout.css';
import Footer from './Footer';

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="dashboard-layout">
      <TopBar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)}></div>}
      <main className="dashboard-content">
        {
          // Inject isSidebarOpen into children
          React.cloneElement(children, { isSidebarOpen: sidebarOpen })
        }
      </main>
      <Footer></Footer>
    </div>
  );
}

export default DashboardLayout;
