// src/components/EditFacultyModal.jsx

import React, { useState } from 'react';
import './EditFacultyModal.css'; // You can customize this or use the same FacultyProfile.css
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase/config';

const EditFacultyModal = ({
  initialValues,
  facultyId,
  onClose,
  onUpdated
}) => {
  const [name, setName] = useState(initialValues.name);
  const [email, setEmail] = useState(initialValues.email);
  const [mobile, setMobile] = useState(initialValues.mobile);
  const [username, setUsername] = useState(initialValues.username);
  const [newProfilePic, setNewProfilePic] = useState(null);

  const handleProfilePicChange = (e) => {
    if (e.target.files[0]) {
      setNewProfilePic(e.target.files[0]);
    }
  };

  const handleUpdate = async () => {
    try {
      const docRef = doc(db, 'faculties', facultyId);
      let profilePicURLToUpdate = initialValues.profilePicURL;

      if (newProfilePic) {
        const storageRef = ref(storage, `faculties/${facultyId}/profile.jpg`);
        await uploadBytes(storageRef, newProfilePic);
        profilePicURLToUpdate = await getDownloadURL(storageRef);
      }

      await updateDoc(docRef, {
        Name: name,
        Email: email,
        Mobile: mobile,
        Username: username,
        ProfilePicURL: profilePicURLToUpdate,
      });

      onUpdated({
        name,
        email,
        mobile,
        username,
        profilePicURL: profilePicURLToUpdate,
      });

      onClose();
    } catch (error) {
      console.error('Error updating faculty profile:', error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Edit Account Info</h3>

        <label>Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>Mobile Number</label>
        <input type="text" value={mobile} onChange={(e) => setMobile(e.target.value)} />

        <label>Username</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />

        <label>Profile Picture</label>
        <input type="file" onChange={handleProfilePicChange} />

        <div className="modal-actions">
          <button className="btn success" onClick={handleUpdate}>Update</button>
          <button className="btn danger" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditFacultyModal;
