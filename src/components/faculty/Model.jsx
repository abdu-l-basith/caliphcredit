// Modal.js
import React from 'react';
import './Model.css';

const Modal = ({ title, children, onClose }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <h2>{title}</h2>
        <div className="modal-content">{children}</div>
        <button onClick={onClose} className="close-button">Close</button>
      </div>
    </div>
  );
};

export default Modal;
