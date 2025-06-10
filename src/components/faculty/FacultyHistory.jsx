  import React, { useEffect, useState } from 'react';
  import { db, auth } from '../../firebase/config';
  import {
    collection,
    getDocs,updateDoc,
    doc,
    getDoc,setDoc,deleteDoc,
    query,
    where
  } from 'firebase/firestore';
  import './FacultyHistory.css';
  import { useAuth } from '../../App';


  const FacultyHistory = () => {
    const { user } = useAuth();
    const [credits, setCredits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const studentsPerPage = 10;

    

    useEffect(() => {
      const fetchCredits = async () => {
        if (!user) return;
        
        const q = query(collection(db, 'credits'), where('approvedBy', '==', user?.id));
        const snapshot = await getDocs(q);

        const creditPromises = snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();

          // Fetch student name
          const studentRef = doc(db, 'students', data.student);
          const studentSnap = await getDoc(studentRef);
          const studentName = studentSnap.exists() ? studentSnap.data().name : 'Unknown';

          // Fetch credit title
          const menuRef = doc(db, 'menus', data.title);
          const menuSnap = await getDoc(menuRef);
          const creditTitle = menuSnap.exists() ? menuSnap.data().Title : 'Unknown';

          // Format date
          const dateObj = data.date?.toDate();
          const formattedDate = dateObj
            ? `${dateObj.getFullYear()} ${dateObj.toLocaleString('default', { month: 'long' })} ${dateObj.getDate()}`
            : 'Invalid Date';

          return {
            id: docSnap.id,
            name: studentName,
            title: creditTitle,
            credit: data.credit,
            date: formattedDate
          };
        });

        const results = await Promise.all(creditPromises);
        setCredits(results);
        setLoading(false);
      };

      fetchCredits();
    }, [user.id]);

    const filteredCredits = credits.filter(item =>
  item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  item.title.toLowerCase().includes(searchTerm.toLowerCase())
);

const handleDelete = async (id) => {
  const docRef = doc(db, 'credits', id);
  const trashRef = doc(db, 'trash-credit', id);

  try {
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      alert("Credit not found!");
      return;
    }

    const creditData = snapshot.data();
    const studentId = creditData.student;
    const creditValue = creditData.credit || 0;

    // Move to trash
    await setDoc(trashRef, {
      ...creditData,
      deletedAt: new Date()
    });

    // Delete credit from original collection
    await deleteDoc(docRef);

    // Update student's credit array and totalCredit safely
    const studentRef = doc(db, 'students', studentId);
    const studentSnap = await getDoc(studentRef);

    if (studentSnap.exists()) {
      const studentData = studentSnap.data();

      const updatedCredits = (studentData.credits || []).filter(cid => cid !== id);
      const updatedTotalCredit = Math.max((studentData.totalCredits || 0) - creditValue, 0);

      await updateDoc(studentRef, {
        credits: updatedCredits,
        totalCredits: updatedTotalCredit
      });
    }

    // Update UI
    setCredits(prev => prev.filter(item => item.id !== id));
    alert("Credit deleted and student updated.");
  } catch (err) {
    console.error("Error deleting credit:", err);
    alert("Failed to delete credit.");
  }
};

    const indexOfLast = currentPage * studentsPerPage;
    const indexOfFirst = indexOfLast - studentsPerPage;
    const currentCredits = filteredCredits.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredCredits.length / studentsPerPage);

    return (
      <div className="faculty-history-container">
        <div className="faculty-history-header">
          <h2>My Contributions: <span>{credits.length}</span></h2>
          <div className="faculty-history-search-add-section">
            <input
              type="text"
              placeholder="Search..."
              className="faculty-history-search-box"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="faculty-history-filter-btn">&#x1F50D;</button>
          </div>
        </div>

        <table className="faculty-history-students-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Student</th>
              <th>For</th>
              <th>Credit</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5">Loading...</td></tr>
            ) : currentCredits.length === 0 ? (
              <tr><td colSpan="5">No contributions found</td></tr>
            ) : (
              currentCredits.map(item => (
                <tr key={item.id}>
                  <td>{item.date}</td>
                  <td>{item.name}</td>
                  <td>{item.title}</td>
                  <td>{item.credit}</td>
                 <td>
  <i
  className="fa-solid fa-trash"
  style={{ color: 'red', cursor: 'pointer' }}
  onClick={() => {
    if (window.confirm("Are you sure you want to delete this credit? This action cannot be undone.")) {
      handleDelete(item.id);
    }
  }}
></i>

</td>

                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="faculty-history-pagination">
          <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}>{'<'}</button>
          <span>{currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}>{'>'}</button>
        </div>
      </div>
    );
  };

  export default FacultyHistory;
