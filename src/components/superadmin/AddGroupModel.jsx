import React, { useState } from 'react';
import { db } from '../../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import './AddGroupModel.css';

const AddGroupModal = ({ onClose, onUpdate }) => {
  const [groupName,setGroupName] = useState('');
  

  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, 'groups'), {
        Name: groupName,
        CreatedAt: new Date()
      });

      alert('New Group Added Successfully');
      onClose();
      onUpdate();
       // close modal
    } catch (err) {
      console.error('Error adding Group:', err);
      alert('Failed to add class');
    } 
  };

  return (
    <div className="add-group-modal-overlay">
      <div className="add-group-modal">
        <h2>Add Group</h2>

        <input type="text" placeholder="Name" value={groupName} onChange={e => setGroupName(e.target.value)} />

        <div className="add-group-modal-actions">
          <button onClick={handleSubmit}>Submit
            
          </button>
          <button className="add-group-cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddGroupModal;
