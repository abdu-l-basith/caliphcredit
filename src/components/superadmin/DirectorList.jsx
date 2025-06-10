// StudentsTable.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config'; // adjust the path if needed
import { collection, getDocs, deleteDoc, setDoc, doc } from 'firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';
import './DirectorList.css';
import AddDirectorModal from './AddDirectorModal';
import EditMobileModal from './EditMobileModal';

const DirectorList = () => {
  const [directors, setDirectors] = useState([]);
  const [addDirector, setAddDirector] = useState(false);
  const [selectedDirector, setSelectedDirector] = useState(null);

  // ✅ Move fetchDirectors outside useEffect
  const fetchDirectors = async () => {
    const directorSnapshot = await getDocs(collection(db, 'directors'));
    const directorList = directorSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setDirectors(directorList);
  };
  const handleDelete = async (director) => {
  const confirmDelete = window.confirm('Are you sure you want to delete this director?');
  if (!confirmDelete) return;

  try {
    // Create a reference in "trash-director" collection with same ID
    const trashRef = doc(db, 'trash-director', director.id);

    // Copy the data with a deletedAt timestamp
    await setDoc(trashRef, {
      ...director,
      deletedAt: serverTimestamp(),
    });

    // Then delete from "directors"
    await deleteDoc(doc(db, 'directors', director.id));

    alert('Director moved to trash and deleted.');
    fetchDirectors(); // Refresh table
  } catch (err) {
    console.error('Failed to delete and archive:', err);
    alert('Error occurred while deleting.');
  }
};

  // 🔁 Fetch once on mount
  useEffect(() => {
    fetchDirectors();
  }, []);

  const handleEditClick = (director) => {
    setSelectedDirector(director);
  };

  return (
    <div className="director-list-students-container">
      <div className="director-list-action-row">
        <span onClick={() => setAddDirector(true)} className='director-list-action-select'>
          Add Director
        </span>
      </div>

      <table className="director-list-students-table">
        <thead>
          <tr>
            <th>Sl No</th>
            <th>Name</th>
            <th>UserName</th>
            <th>Mobile</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {directors.map((director, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{director.Name}</td>
              <td>{director.Username}</td>
              <td>{director.Mobile}</td>
              <td onClick={() => handleEditClick(director)} className='director-list-edit-action'>EDIT</td>
              <td onClick={() => handleDelete(director)} className='director-list-delete-action'>DELETE</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Fix rendering modal */}
      {selectedDirector && (
        <EditMobileModal
          directorId={selectedDirector.id}
          currentMobile={selectedDirector.Mobile}
          onClose={() => setSelectedDirector(null)}
          onUpdate={fetchDirectors} // ✅ Function reference, not call
        />
      )}

      {addDirector && <AddDirectorModal onClose={() => setAddDirector(false)} onUpdate={fetchDirectors} />}
    </div>
  );
};


export default DirectorList;