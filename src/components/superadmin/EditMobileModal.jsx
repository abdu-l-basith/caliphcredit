import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import './EditMobileModal.css'; // optional for styling

const EditMobileModal = ({ directorId, currentMobile, onClose, onUpdate }) => {
  const [mobile, setMobile] = useState(currentMobile);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'directors', directorId);
      await updateDoc(docRef, { Mobile: mobile });
      alert('Mobile number updated!');
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
    <div className="edit-mobile-modal-overlay">
      <div className="edit-mobile-modal">
        <h3>Edit Mobile Number</h3>
        <input
          type="text"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          placeholder="Enter new mobile number"
        />
        <div className="edit-mobile-modal-actions">
          <button onClick={handleUpdate} disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </button>
          <button className="edit-mobile-cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditMobileModal;
