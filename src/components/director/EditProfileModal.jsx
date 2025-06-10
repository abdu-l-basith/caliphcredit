// EditProfileModal.jsx
import React, { useState, useEffect } from 'react';
import './EditProfileModal.css';

const EditProfileModal = ({ isOpen, onClose, profile, onSave }) => {
  const [formData, setFormData] = useState(profile);

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'Photo' && files.length > 0) {
      setFormData({ ...formData, Photo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="Name" value={formData.Name} onChange={handleChange} placeholder="Name" />
          <input type="text" name="Designation" value={formData.Designation} onChange={handleChange} placeholder="Designation" />
          <input type="text" name="Mobile" value={formData.Mobile} onChange={handleChange} placeholder="Mobile" />
          <input type="email" name="Email" value={formData.Email} onChange={handleChange} placeholder="Email" />
          <label>Change Profile Picture:</label>
          <input type="file" name="Photo" onChange={handleChange} />
          <div className="modal-actions">
            <button type="submit" className='director-profile-page-button '>Update</button>
            <button type="button" onClick={onClose} className="director-profile-page-button-cancel ">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
