// StudentsTable.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config'; // adjust the path if needed
import { collection, getDocs,doc,setDoc,deleteDoc } from 'firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';
import './ClassList.css';
import AddClassModal from './AddClassModel';
import EditClassName from './EditClassName';

const ClassList = () => {
  const [classes, setClasses] = useState([]);
    const [addClassModel, setAddClassModel] = useState(false);
    const [showClassEdit, setShowClassEdit] = useState(true)
    const [selectedClass, setSelectedClass] = useState(null)
  // 🔽 Fetch students from Firestore
  const fetchClasses = async () => {
    

    // Then fetch Director
    const classSnapshot = await getDocs(collection(db, 'classes'));
    const classList = classSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
      };
    });

    setClasses(classList);
  };
  useEffect(() => {
 fetchClasses();
}, []);
const handleDelete = async (data) => {
  const confirmDelete = window.confirm('Are you sure you want to delete this class?');
  if (!confirmDelete) return;

  try {
    // Create a reference in "trash-director" collection with same ID
    const trashRef = doc(db, 'trash-class', data.id);

    // Copy the data with a deletedAt timestamp
    await setDoc(trashRef, {
      ...data,
      deletedAt: serverTimestamp(),
    });

    // Then delete from "directors"
    await deleteDoc(doc(db, 'classes', data.id));

    alert('Class moved to trash and deleted.');
    fetchClasses(); // Refresh table
  } catch (err) {
    console.error('Failed to delete and archive:', err);
    alert('Error occurred while deleting.');
  }
};
const handleEdit = (data)=>{
    setSelectedClass(data)
}

  return (
    <div className="class-list-container">
      

      <div className="class-list-action-row">
        <span onClick={()=>{setAddClassModel(true)}} className='class-list-action-select'>Add New Class</span>
      </div>

      <table className="class-list-students-table">
        <thead>
          <tr>
            <th>Sl No</th>
            <th>Class</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {classes.map((data, index) => (
            <tr key={index}>
              <td>{index+1}</td>
              <td>{data.class}</td>
              <td onClick={()=>handleEdit(data)}  className='class-list-edit-action'>EDIT</td>
              <td onClick={()=>handleDelete(data)} className='class-list-delete-action'>DELETE</td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedClass && (
        <EditClassName
          classId={selectedClass.id}
          currentClassName={selectedClass.class}
          onClose={() => setSelectedClass(null)}
          onUpdate={fetchClasses} // ✅ Function reference, not call
        />
      )}
{addClassModel && <AddClassModal onClose={() => setAddClassModel(false)} onUpdate ={fetchClasses} />}
      
    </div>
  );
};

export default ClassList;