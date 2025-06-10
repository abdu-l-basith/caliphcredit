import React, { useState } from 'react';
import { db, storage } from '../../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import './AddClassModel.css';

const AddClassModal = ({ onClose, onUpdate }) => {
  const [className,setClassName] = useState();
  

  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, 'classes'), {
        class: className,
        CreatedAt: new Date()
      });

      alert('New Class Added Successfully');
      onClose();
      onUpdate();
       // close modal
    } catch (err) {
      console.error('Error adding director:', err);
      alert('Failed to add class');
    } 
  };

  return (
    <div className="add-class-modal-overlay">
      <div className="add-class-modal">
        <h2>Add Class</h2>

        <input type="text" placeholder="Name" value={className} onChange={e => setClassName(e.target.value)} />

        <div className="add-class-modal-actions">
          <button onClick={handleSubmit}>Submit
            
          </button>
          <button className="cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddClassModal;
