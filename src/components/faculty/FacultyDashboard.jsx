import React, { useState } from 'react';
import './FacultyDashboard.css';
import AcademicPerformanceModal from './AcademicPerformanceForm';

function FacultyDashboard({ isSidebarOpen }) {
  const [modalData, setModalData] = useState(null);
  const handleOpenModal = (data) => {
    setModalData(data);
  };
  
  const handleCloseModal = () => setModalData(null);
  return (
    
    <div className={`container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      
      <div className="item" onClick={() => handleOpenModal({ title: "Academic Performance", credit: 3 })}>
        <div className="card-container">
          <div className="icon-circle">
            <i className="fa-solid fa-graduation-cap"></i>
          </div>
          <p className="card-title">Academic Perfromance</p>
        </div>
      </div>

      <div className="item" >
      <div className="card-container">
      <div className="icon-circle">
      <i className="fa-solid fa-user-graduate"></i>
      </div>
      <p className="card-title">OverAll Perfromance</p>
    </div>
      </div>

      <div className="item" >
      <div className="card-container">
      <div className="icon-circle">
      <i className="fa-solid fa-clipboard-user"></i>
      </div>
      <p className="card-title">Attendance</p>
    </div>
      </div>

      <div className="item" >
      <div className="card-container">
      <div className="icon-circle">
      <i className="fa-solid fa-trophy"></i>
      </div>
      <p className="card-title">Program Winner</p>
    </div>
      </div>

      <div className="item" >
      <div className="card-container">
      <div className="icon-circle">
      <i className="fa-solid fa-people-group"></i>
      </div>
      <p className="card-title">Program Winner - Group</p>
    </div>
      </div>

      <div className="item" >
      <div className="card-container">
      <div className="icon-circle">
      <i className="fa-solid fa-medal"></i>
      </div>
      <p className="card-title">Outside Program</p>
    </div>
      </div>

      <div className="item" >
      <div className="card-container">
      <div className="icon-circle">
      <i className="fa-solid fa-bars-progress"></i>
      </div>
      <p className="card-title">Summer Task</p>
    </div>
      </div>

      <div className="item" >
      <div className="card-container">
      <div className="icon-circle">
      <i className="fa-solid fa-puzzle-piece"></i>
      </div>
      <p className="card-title">Add-on Course</p>
    </div>
      </div>

      <div className="item" >
      <div className="card-container">
      <div className="icon-circle">
      <i className="fa-solid fa-handshake"></i>
      </div>
      <p className="card-title">Serving in Committees</p>
    </div>
      </div>

      <div className="item" >
      <div className="card-container">
      <div className="icon-circle">
      <i className="fa-solid fa-building-ngo"></i>
      </div>
      <p className="card-title">Serving in Unions</p>
    </div>
      </div>
      
      <div className="item" >
      <div className="card-container">
      <div className="icon-circle">
      <i className="fa-solid fa-person"></i>
      </div>
      <p className="card-title">Serving as Leaders</p>
    </div>
      </div>

      <div className="item" >
      <div className="card-container">
      <div className="icon-circle">
      <i className="fa-solid fa-briefcase"></i>
      </div>
      <p className="card-title">Startup</p>
    </div>
      </div>

      <div className="item" >
      <div className="card-container">
      <div className="icon-circle">
      <i className="fa-solid fa-city"></i>
      </div>
      <p className="card-title">Inititation</p>
    </div>
      </div>

      <div className="item" >
      <div className="card-container">
      <div className="icon-circle">
      <i className="fa-solid fa-certificate"></i>
      </div>
      <p className="card-title">Certification</p>
    </div>
      </div>

      {/* Modal must be inside the return and below useState */}
      {modalData && (
  <AcademicPerformanceModal
    isOpen={!!modalData}
    onClose={() => setModalData(null)}
    title={modalData.title}
    credit={modalData.credit}
  />
)}

    </div>
  );
}

export default FacultyDashboard;
