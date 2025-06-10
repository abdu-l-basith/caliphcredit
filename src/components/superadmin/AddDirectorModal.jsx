import React, { useState } from 'react';
import { db, storage } from '../../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './AddDirectorModal.css';

const AddDirectorModal = ({ onClose, onUpdate }) => {
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async () => {
    try {
      setUploading(true);
      console.log("enterd to packet")
      let profilePicURL = '';

      if (profilePic) {
        const imageRef = ref(storage, `directors/${Date.now()}_${profilePic.name}`);
        await uploadBytes(imageRef, profilePic);
        profilePicURL = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, 'directors'), {
        Name: name,
        Designation: designation,
        Email: email,
        Mobile: mobile,
        Username: username,
        Password: password,
        ProfilePicURL: profilePicURL,
        CreatedAt: new Date(),
        Role: "Admin",
        Auth: 1
      });

      alert('Director added successfully!');
      onClose();
      onUpdate();
       // close modal
    } catch (err) {
      console.error('Error adding director:', err);
      alert('Failed to add director.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="add-director-modal-overlay">
      <div className="add-director-modal">
        <h2>Add Director</h2>

        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input type="text" placeholder="Designation" value={designation} onChange={e => setDesignation(e.target.value)} />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="text" placeholder="Mobile" value={mobile} onChange={e => setMobile(e.target.value)} />
        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <input type="file" onChange={e => setProfilePic(e.target.files[0])} />

        <div className="add-director-modal-actions">
          <button onClick={handleSubmit} disabled={uploading}>
            {uploading ? 'Adding...' : 'Add Director'}
          </button>
          <button className="add-director-cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddDirectorModal;
