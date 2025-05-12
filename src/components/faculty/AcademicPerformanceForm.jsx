import React from 'react';
import './AcademicPerformanceForm.css';

const AcademicPerformanceModal = ({ isOpen, onClose, title, credit }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>

        <h2 className="form-title">{title?.toUpperCase()}</h2>
        <div className="info-bar">
          <span className="info-icon">ℹ️</span>
          <p>This scheme provides {credit} credits to students</p>
        </div>

        <select className="student-select">
          <option value="">Select Student</option>
          <option value="Faisal Zainy">Faisal Zainy</option>
          <option value="Ali Raza">Ali Raza</option>
        </select>

        <div className="grade-buttons">
          <button className="grade-button">A PLUS</button>
          <button className="grade-button">A GRADE</button>
        </div>

        <textarea className="remarks-box" placeholder="Remarks....." />

        <p className="credits-message">
          Faisal Zainy got 3 credits for academic performance
        </p>

        <button className="approve-button">APPROVE</button>
      </div>
    </div>
  );
};

export default AcademicPerformanceModal;
