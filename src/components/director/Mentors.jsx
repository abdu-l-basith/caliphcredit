// Mentors.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  addDoc,
  serverTimestamp,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';
import './Mentors.css';
import { auth } from '../../firebase/config';
import { useAuth } from '../../App';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './../../firebase/config';
import { v4 as uuidv4 } from 'uuid';

const Mentors = () => {
   const {user} = useAuth();
  const [mentors, setMentors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const mentorsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState('');
  const [action, setAction] = useState('');
  const [selectedMentorIds, setSelectedMentorIds] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [editMentorData, setEditMentorData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    email: '',
    mobile: '',
    userName: '',
    password: '',
    accessto: '',
  });

  useEffect(() => {
    const fetchMentors = async () => {
      const mentorSnapshot = await getDocs(collection(db, 'faculties'));
      const mentorList = mentorSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMentors(mentorList);
    };
    fetchMentors();
  }, [refresh]);

  const openEditModal = (mentor) => {
    setEditMentorData({
      id: mentor.id,
      designation: mentor.Designation,
      mobile: mentor.Mobile,
      auth: mentor.Auth,
    });
    setIsEditModalOpen(true);
  };

  const handleActionChange = async (e) => {
    const selectedAction = e.target.value;
    setAction(selectedAction);

    if (selectedAction === "Delete") {
      for (let id of selectedMentorIds) {
        const mentor = mentors.find(m => m.id === id);
        await handleActionDelete(id, mentor?.ProfilePicURL);
      }
      setSelectedMentorIds([]);
      setAction("");
      setRefresh(prev => !prev);
    }

    if (selectedAction === "Edit") {
      if (selectedMentorIds.length === 1) {
        const mentorToEdit = mentors.find(s => s.id === selectedMentorIds[0]);
        if (mentorToEdit) {
          openEditModal(mentorToEdit);
        }
      } else {
        alert("Please select exactly one mentor to edit.");
      }
      setAction("");
    }
  };

  const handleActionDelete = async (id, profilePicURL) => {
    // eslint-disable-next-line no-restricted-globals
if (!confirm("Are you sure you want to delete this mentor?")) {
  return
}

    try {
      if (profilePicURL) {
        const fileRef = ref(storage, profilePicURL);
        await deleteObject(fileRef).catch(() => {
          console.warn("Image not found in storage.");
        });
      }
      const docRef = doc(db, "faculties", id);
      const docSnap = await getDoc(docRef);
      await setDoc(doc(db, "trash-faculties", id), docSnap.data());
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const handleCheckboxChange = (e, id) => {
    if (e.target.checked) {
      setSelectedMentorIds(prev => [...prev, id]);
    } else {
      setSelectedMentorIds(prev => prev.filter(mid => mid !== id));
    }
  };

  const filteredMentors = mentors.filter(mentor =>
    mentor.Name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * mentorsPerPage;
  const indexOfFirst = indexOfLast - mentorsPerPage;
  const currentMentors = filteredMentors.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredMentors.length / mentorsPerPage);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateMentor = async () => {
    try {
      const docRef = doc(db, "faculties", editMentorData.id);
      await updateDoc(docRef, {
        Designation: editMentorData.designation,
        Mobile: editMentorData.mobile,
        Auth: Number(editMentorData.auth),
      });
      setIsEditModalOpen(false);
      setSelectedMentorIds([]);
      setRefresh(prev => !prev);
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!user) return alert("Not logged in");
    console.log("hello : ", auth.currentUser)
    const { name, designation, mobile, email, userName, password, accessto } = formData;
    if (!name || !designation || !mobile || !email || !userName || !password || accessto === '') {
      alert("Please fill all fields");
      return;
    }
    try {
      let profilePicURL = "";
      if (image) {
        const imageRef = ref(storage, `faculties/${uuidv4()}_${image.name}`);
        await uploadBytes(imageRef, image);
        profilePicURL = await getDownloadURL(imageRef);
      }
      await addDoc(collection(db, 'faculties'), {
        Name: name,
        Auth: Number(accessto),
        Designation: designation,
        Email: email,
        Mobile: mobile,
        Mentees: [],
        Username: userName,
        Password: password,
        Role: 'User',
        ProfilePicURL: profilePicURL,
        createdBy: user?.id,
        createdAt: serverTimestamp(),
      });
      setShowModal(false);
      setRefresh(prev => !prev);
      setFormData({
        name: '',
        designation: '',
        email: '',
        mobile: '',
        userName: '',
        password: '',
        accessto: '',
      });
    } catch (err) {
      console.error("Error adding mentor:", err);
    }
  };

  return (
    <div className="students-container">
      <div className="students-header">
        <h2>Mentors <span>{mentors.length}</span></h2>
        <div className="search-add-section">
          <input type="text" placeholder="Search..." className="search-box" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <button className="filter-btn">🔍</button>
          <button className="add-btn" onClick={() => setShowModal(true)}>Add Mentor</button>
        </div>
      </div>

      <div className="action-row">
        <select className="action-select" value={action} onChange={handleActionChange}>
          <option value="">Action</option>
          <option value="Delete">Delete</option>
          <option value="Edit">Edit</option>
        </select>
      </div>

      <table className="students-table">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Designation</th>
            <th>Mobile</th>
            <th>Username</th>
            <th>Access to</th>
          </tr>
        </thead>
        <tbody>
          {currentMentors.map((mentor) => (
            <tr key={mentor.id}>
              <td><input type="checkbox" checked={selectedMentorIds.includes(mentor.id)} onChange={(e) => handleCheckboxChange(e, mentor.id)} /></td>
              <td>{mentor.Name}</td>
              <td>{mentor.Designation}</td>
              <td>{mentor.Mobile}</td>
              <td>{mentor.Username}</td>
              <td>{mentor.Auth === 0 ? "Mentees Only" : mentor.Auth === 1 ? "All Students" : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>{'<'}</button>
        <span>{currentPage} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>{'>'}</button>
      </div>

      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="edit-mentor-container">
            <div className="edit-mentor-wrapper">
          <h3 style={{ color: "black" }}>Edit Mentor</h3>
        
          <input className='edit-mentor-input' value={editMentorData.designation} onChange={(e) => setEditMentorData({ ...editMentorData, designation: e.target.value })} placeholder="Designation" />
          <input className='edit-mentor-input' value={editMentorData.mobile} onChange={(e) => setEditMentorData({ ...editMentorData, mobile: e.target.value })} placeholder="Mobile" />
<select className='edit-mentor-input' value={editMentorData.Auth} onChange={(e) => setEditMentorData({ ...editMentorData, Auth: e.target.value })}>
            <option value={0}>Mentees Only</option>
            <option value={1}>All Students</option>
          </select>
          <div className='edit-mentor-actions'>
            <button className='modal-cancel-button' onClick={() => setIsEditModalOpen(false)}>Close</button>
          <button className='modal-submit-button' onClick={handleUpdateMentor}>Update</button>
          
          </div>
          
            </div>
          
          </div>
          
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add Mentor</h3>
            <form onSubmit={handleSubmit} className="modal-form">
              <input type="text" name="name" placeholder="Mentor Name" value={formData.name} onChange={handleChange} required />
              <input type="text" name="designation" placeholder="Designation" value={formData.designation} onChange={handleChange} required />
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
              <input type="text" name="mobile" placeholder="Mobile" value={formData.mobile} onChange={handleChange} required />
              <input type="text" name="userName" placeholder="Username" value={formData.userName} onChange={handleChange} required />
              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
              <select name="accessto" value={formData.accessto} onChange={handleChange} required>
                <option value="">Access to:</option>
                <option value={0}>Only Mentees</option>
                <option value={1}>All Students</option>
              </select>
              <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
              <div className="metors-modal-action-buttons">
                <button className='modal-cancel-button' type="button" onClick={() => setShowModal(false)}>Cancel</button>
              <button className='modal-submit-button' type="submit">Submit</button>
              
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mentors;
