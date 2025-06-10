import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import './EditClassName.css'; // optional for styling

const EditClassName = ({ classId, currentClassName, onClose, onUpdate }) => {
  const [className, setClassName] = useState(currentClassName);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'classes', classId);
      await updateDoc(docRef, {class: className });
      alert('Class Name updated!');
      onUpdate(); // refresh the table or data
      onClose();  // close modal
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-class-modal-overlay">
      <div className="edit-class-modal">
        <h3>Edit Class Name</h3>
        <input
          type="text"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          placeholder="Enter new class name"
        />
        <div className="edit-class-modal-actions">
          <button onClick={handleUpdate} disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </button>
          <button className="edit-class-cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditClassName;
