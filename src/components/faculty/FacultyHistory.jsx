import React from 'react';
import './FacultyHistory.css';

const FacultyHistory = () => {
  const history = [
    {
      time: '08:00',
      title: 'Credit added: Seminar Coordination',
      subtitle: 'Academic Activity',
      type: 'scheduled'
    },
    {
      time: '07:40',
      title: 'Credit added: Library Duty',
      subtitle: 'Scheduled Contribution',
      type: 'scheduled'
    },
    {
      time: '07:23',
      title: 'Credit added: Class Representative Meeting',
      subtitle: 'Location: Admin Hall',
      type: 'entry'
    },
    {
      time: '06:12',
      title: 'Credit added: Extra Lecture',
      subtitle: 'Manually Added by Faculty',
      type: 'manual'
    }
  ];

  return (
    <div className="timeline-container">
      {history.map((item, index) => (
        <div className="timeline-item" key={index}>
          <div className={`timeline-icon ${item.type}`}></div>
          <div className="timeline-content">
            <span className="time">{item.time}</span>
            <h4 className="title">{item.title}</h4>
            <p className="subtitle">{item.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FacultyHistory;
