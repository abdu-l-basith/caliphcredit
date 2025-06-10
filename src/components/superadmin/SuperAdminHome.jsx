// FinishSignIn.jsx
import React, {useState} from 'react';
import './SuperAdminHome.css'
import DirectorList from './DirectorList';
import ClassList from './ClassList';
import GroupList from './GroupList';
import SuperAdminLogs from './SuperAdminLogs';
import hackerBg from './bg.jpg';


const SuperAdminHome = () => {
  
  const [selectedTab, setSelectedTab] = useState('Directors');

  const renderContent = () => {
    switch (selectedTab) {
      case 'Directors':
        return <DirectorList />;
      case 'Classes':
        return <ClassList />;
      case 'Groups':
        return <GroupList />;
      case 'Logs':
        return <SuperAdminLogs />;
      default:
        return null;
    }
  };

  return (
    <div className="super-admin-home-page-container" style={{ backgroundImage: `url(${hackerBg})`, }}>
        <h4 className='super-admin-home-page-title'>I'm Super Admin..</h4>
    <div className="super-admin-home-tab-container">
      <div className="super-admin-home-tab-header">
        {['Directors', 'Classes', 'Groups'].map(tab => (
          <div
            key={tab}
            className={`super-admin-home-tab ${selectedTab === tab ? 'super-admin-home-tab-active' : ''}`}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      <div className="super-admin-home-tab-body">
        {renderContent()}
        
      </div>
    </div>
    <div className="super-admin-home-tab-footer">
          <span onClick={()=>{setSelectedTab('Logs')}} className="super-admin-home-footer-link">View Logs</span>
          <span className="super-admin-home-footer-link">SignOut</span>
        </div>
    </div>
  );
};

export default SuperAdminHome;
