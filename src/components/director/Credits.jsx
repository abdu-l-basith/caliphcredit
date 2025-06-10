// StudentsTable.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config'; // adjust the path if needed
import { collection, getDocs, getFirestore, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import './Mentors.css';
import AddCreditModal from './AddCreditModal';

const Credits = () => {
  const [credits, setCredits] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const CreditsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState('');
  const [action, setAction] = useState(""); 
  const [selectedCreditsIds, setSelectedCreditsIds] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [showModal, setShowModal] = useState(false);


  // 🔽 Fetch students from Firestore
  useEffect(() => {
  const fetchCredits = async () => {
    // Then fetch mentees
    const creditSnapshot = await getDocs(collection(db, 'menus'));
    const creditList = creditSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
      };
    });

    setCredits(creditList);
  };

  fetchCredits();
}, [refresh]);


  // Pagination logic
  const filteredCredits = credits.filter(credit =>
  credit.Title.toLowerCase().includes(searchTerm.toLowerCase())
);
const handleActionChange = async (e) => {
  const selectedAction = e.target.value;
  setAction(selectedAction);

  if (selectedAction === "Delete") {
    await handleActionDelete();
    setSelectedCreditsIds([]); // clear selection
    setAction("");
    setRefresh(prev => !prev);
  }

};
const handleActionDelete = async () => {
  try {
    const db = getFirestore();

    for (const id of selectedCreditsIds) {
      const creditRef = doc(db, "menus", id);
      const creditSnap = await getDoc(creditRef);

      if (creditSnap.exists()) {
        // Move to trash-student
        await setDoc(doc(db, "trash-menu", id), creditSnap.data());

        // Delete from students
        await deleteDoc(creditRef);
        
      }
    }

    console.log("Selected credit deleted.");
  } catch (error) {
    console.error("Error deleting credits:", error);
  }
};
const indexOfLast = currentPage * CreditsPerPage;
const indexOfFirst = indexOfLast - CreditsPerPage;
const currentCredits = filteredCredits.slice(indexOfFirst, indexOfLast);
const totalPages = Math.ceil(filteredCredits.length / CreditsPerPage);


  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  return (
    <div className="students-container">
      <div className="students-header">
        <h2>Total Credits <span>{credits.length}</span></h2>
        <div className="search-add-section">
          <input type="text" placeholder="Search..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} className="search-box" />
          <button className="filter-btn">&#x1F50D;</button>
          <button className="add-btn" onClick={() => setShowModal(true)}>
  Add a new Credit
</button>

        </div>
      </div>

      <div className="action-row">
        <select className="action-select" value={action} onChange={handleActionChange}>
          <option>Action</option>
          <option value="Delete">Move to Trash</option>
        </select>
      </div>

      <table className="students-table">
        <thead>
          <tr>
            <th></th>
            <th>Icon</th>
            <th>Title</th>
            <th>Credits</th>
          </tr>
        </thead>
        <tbody>
          {currentCredits.map((credit, index) => (
            <tr key={index}>
              <input 
  type="checkbox"
  checked={selectedCreditsIds.includes(credit.id)}
  onChange={(e) => {
    const isChecked = e.target.checked;
    setSelectedCreditsIds((prev) => {
      if (isChecked) return [...prev, credit.id];
      else return prev.filter(id => id !== credit.id);
    });
  }}
/>

              <td><i className= {credit.Image}></i></td>
              <td>{credit.Title}</td>
              {credit.Credit && <td>Sin: {credit.Credit}</td>}
              {credit.MaxCredit && <td>Max: {credit.MaxCredit}</td>}
              {credit.Credits && <td>Category Based</td>}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}>{'<'}</button>
        <span>{currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}>{'>'}</button>
      </div>
      <AddCreditModal isOpen={showModal}
      onClose={() => setShowModal(false)}
      triggerRefresh={() => setRefresh(prev => !prev)} />

    </div>
  );
};

export default Credits;