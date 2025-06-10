import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import './EditGroupName.css'; // optional for styling

const EditGroupName = ({ groupId, currentGroupName, onClose, onUpdate }) => {
  const [groupName, setGroupName] = useState(currentGroupName);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'groups', groupId);
      await updateDoc(docRef, {Name: groupName });
      alert('Group Name updated!');
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
    <div className="edit-group-modal-overlay">
      <div className="edit-group-modal">
        <h3>Edit Group Name</h3>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Enter new group name"
        />
        <div className="edit-group-modal-actions">
          <button onClick={handleUpdate} disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </button>
          <button className="edit-group-cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditGroupName;
