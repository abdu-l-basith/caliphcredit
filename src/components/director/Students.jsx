import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebase/config'; // adjust auth import
import {
  collection,
  getDocs,
  updateDoc,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  getFirestore, arrayUnion
} from 'firebase/firestore';
import './Students.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useAuth } from '../../App';


const Students = () => {
  const {user} = useAuth();
  const [students, setStudents] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [classes, setClasses] = useState([]);
  const [groups, setGroups] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]); // Store selected IDs
  const [action, setAction] = useState(""); // for select value
const [refresh, setRefresh] = useState(false); // to reload
const [selectedStudentIds, setSelectedStudentIds] = useState([]);
const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [editStudentData, setEditStudentData] = useState(null);

const openEditModal = (student) => {
  setEditStudentData({
    id: student.id,
    name: student.name,
    rollNumber: student.rollNumber,
    mentorId: student.mentorId,
    classId: student.classId,
    groupId: student.groupId,
  });
  setIsEditModalOpen(true);
};



  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    mentorId: '',
    classId: '',
    groupId: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState('');

  const handleCheckboxChange = (studentId, isChecked) => {
  setSelectedStudentIds(prev =>
    isChecked
      ? [...prev, studentId]
      : prev.filter(id => id !== studentId)
  );
};
  // 🔽 Fetch dropdown options
  const fetchDropdowns = async () => {
    const [mentorSnap, classSnap, groupSnap] = await Promise.all([
      getDocs(collection(db, 'faculties')),
      getDocs(collection(db, 'classes')),
      getDocs(collection(db, 'groups')),
    ]);

    setMentors(mentorSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setClasses(classSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setGroups(groupSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  // 🔽 Fetch students
  const fetchStudentsWithClasses = async () => {
    const classSnapshot = await getDocs(collection(db, 'classes'));
    const classMap = {};
    classSnapshot.forEach(doc => {
      classMap[doc.id] = doc.data().class;
    });

    const studentSnapshot = await getDocs(collection(db, 'students'));
    const studentList = studentSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        className: classMap[data.classId] || 'Unknown',
      };
    });

    setStudents(studentList);
  };

  useEffect(() => {
    fetchStudentsWithClasses();
    fetchDropdowns();
  }, []);

  // 🔽 Search logic
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * studentsPerPage;
  const indexOfFirst = indexOfLast - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!user) return alert("Not logged in");

  try {
    // 1. Add student
    const studentRef = await addDoc(collection(db, 'students'), {
      name: formData.name,
      rollNumber: formData.rollNumber,
      mentorId: formData.mentorId,
      classId: formData.classId,
      groupId: formData.groupId,
      totalCredits: 0,
      createdBy: user?.id,
      createdAt: serverTimestamp(),
    });

    // 2. Add student ID to mentor's 'mentees' array
    const mentorRef = doc(db, 'faculties', formData.mentorId);
    await updateDoc(mentorRef, {
      mentees: arrayUnion(studentRef.id),
    });

    // 3. Reset & close modal
    setShowModal(false);
    setFormData({
      name: '',
      rollNumber: '',
      mentorId: '',
      classId: '',
      groupId: '',
    });
    fetchStudentsWithClasses(); // refresh list

  } catch (error) {
    console.error("Error submitting student:", error);
    alert("Failed to add student");
  }
};
  const handleActionChange = async (e) => {
  const selectedAction = e.target.value;
  setAction(selectedAction);

  if (selectedAction === "Delete") {
    await handleActionDelete();
    setSelectedStudentIds([]); // clear selection
    setAction("");
    setRefresh(prev => !prev);
  }
if (selectedAction === "Export") {
  handleExportStudents();
  setAction(""); // reset dropdown
}

  if (selectedAction === "Edit") {
    if (selectedStudentIds.length === 1) {
      const studentToEdit = students.find(s => s.id === selectedStudentIds[0]);
      if (studentToEdit) {
        openEditModal(studentToEdit);
      }
    } else {
      alert("Please select exactly one student to edit.");
    }
    setAction("");
  }
};

const handleExportStudents = async() => {
  const selected = students.filter(student => selectedStudentIds.includes(student.id));
  if (selected.length === 0) {
    alert("No students selected for export.");
    return;
  }

  const data = [];

for (const student of selected) {
  // Add main student row
  data.push({
    'Name': student.name,
    'Roll Number': student.rollNumber,
    'Class': student.className || '',
    'Total Credits': student.totalCredits || 0,
  });

  // Fetch credit data for this student
  const creditDocs = await Promise.all(
    (student.credits || []).map(async (creditId) => {
      const creditDoc = await getDoc(doc(db, 'credits', creditId));
      return creditDoc.exists() ? creditDoc.data() : null;
    })
  );

  let totalCredit = 0;

  for (const credit of creditDocs.filter(Boolean)) {
    totalCredit += credit.credit || 0;
    data.push({
      'Date': credit.date || '',
      'Title': credit.title || '',
      'Credit': credit.credit || 0,
    });
  }

  if (creditDocs.length > 0) {
    // Add total row after listing all credits
    data.push({
      'Title': 'Total',
      'Credit': totalCredit,
    });
  }

  // Add an empty row for spacing
  data.push({});
}


  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

  saveAs(blob, 'selected_students.xlsx');
};

const handleActionDelete = async () => {
  try {
    const db = getFirestore();

    for (const id of selectedStudentIds) {
      const studentRef = doc(db, "students", id);
      const studentSnap = await getDoc(studentRef);

      if (studentSnap.exists()) {
        // Move to trash-student
        await setDoc(doc(db, "trash-student", id), studentSnap.data());

        // Delete from students
        await deleteDoc(studentRef);
        fetchStudentsWithClasses();
      }
    }

    console.log("Selected students deleted.");
  } catch (error) {
    console.error("Error deleting students:", error);
  }
};
const handleUpdateStudent = async () => {
  try {
    const docRef = doc(db, "students", editStudentData.id);
    await updateDoc(docRef, {
  name: editStudentData.name,
  rollNumber: editStudentData.rollNumber,
  classId: editStudentData.classId,
  groupId: editStudentData.groupId,
  mentorId: editStudentData.mentorId,
});

    setIsEditModalOpen(false);
    setSelectedStudentIds([]);
    // refresh list
  } catch (error) {
    console.error("Error updating student:", error);
  }
};
  return (
    <div className="students-container">
      <div className="students-header">
        <h2>Students <span>{students.length}</span></h2>
        <div className="search-add-section">
          <input
            type="text"
            placeholder="Search..."
            className="search-box"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="filter-btn">&#x1F50D;</button>
          <button className="add-btn" onClick={() => setShowModal(true)}>Add Student</button>
        </div>
      </div>

      <div className="action-row">
       <select className="action-select" value={action} onChange={handleActionChange}>
  <option value="">Action</option>
  <option value="Delete">Delete</option>
  <option
  onClick={() => {
    const studentToEdit = students.find(s => s.id === selectedStudentIds[0]);
    if (studentToEdit) openEditModal(studentToEdit);
  }}
>
  Edit
</option>

  {/* <option value="Export">Export</option> */}
</select>
      </div>

      <table className="students-table">
        <thead>
          <tr>
            <th></th>
            <th>Roll No.</th>
            <th>Name</th>
            <th>Class</th>
            <th>Credits</th>
          </tr>
        </thead>
        <tbody>
          {currentStudents.map((student, index) => (
            <tr key={index}>
              <td><input
  type="checkbox"
  onChange={(e) => handleCheckboxChange(student.id, e.target.checked)}
/></td>
              <td>{student.rollNumber}</td>
              <td>{student.name}</td>
              <td>{student.className}</td>
              <td>{student.totalCredits || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}>{'<'}</button>
        <span>{currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}>{'>'}</button>
      </div>

      {/* 🔽 Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add Student</h3>
            <form onSubmit={handleSubmit} className="modal-form">
              <input
                type="text"
                name="name"
                placeholder="Student Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="rollNumber"
                placeholder="Roll Number"
                value={formData.rollNumber}
                onChange={handleChange}
                required
              />
              <select name="mentorId" value={formData.mentorId} onChange={handleChange} required>
                <option value="">Select Mentor</option>
                {mentors.map(mentor => (
                  <option key={mentor.id} value={mentor.id}>{mentor.Name}</option>
                ))}
              </select>
              <select name="classId" value={formData.classId} onChange={handleChange} required>
                <option value="">Select Class</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.class}</option>
                ))}
              </select>
              <select name="groupId" value={formData.groupId} onChange={handleChange} required>
                <option value="">Select Group</option>
                {groups.map(grp => (
                  <option key={grp.id} value={grp.id}>{grp.Name}</option>
                ))}
              </select>
              <div className="modal-buttons">
                <button className='modal-cancel-button' type="button" onClick={() => setShowModal(false)}>Cancel</button>
                <button className='modal-submit-button' type="submit">Add</button>
                
              </div>
            </form>
          </div>
        </div>
      )}
      {isEditModalOpen && editStudentData && (
  <div className="modal-overlay">
    <div className="modal">
      <h2>Edit Student</h2>
      <div>
        <label htmlFor="name">Name</label>
<input
        value={editStudentData.name}
        onChange={(e) =>
          setEditStudentData({ ...editStudentData, name: e.target.value })
        }
        placeholder="Name"
      />
      </div>
      <div>
        <label htmlFor="rollnum">Roll Nuber</label>
        <input
        value={editStudentData.rollNumber}
        onChange={(e) =>
          setEditStudentData({ ...editStudentData, rollNo: e.target.value })
        }
        placeholder="Roll No"
      />
      </div>
      <div>
        <div className='edit-student-input-wrapper'>
          <label htmlFor="mentor">Mentor</label>
          <select
  value={editStudentData.mentorId}
  onChange={(e) =>
    setEditStudentData({ ...editStudentData, mentorId: e.target.value })
  }
>
  <option value="">Select Mentor</option>
  {mentors.map((mentor) => (
    <option key={mentor.id} value={mentor.id}>{mentor.Name}</option>
  ))}
</select>
        </div>
        <div className='edit-student-input-wrapper'>
          <label htmlFor="class">Class</label>
<select
  value={editStudentData.classId}
  onChange={(e) =>
    setEditStudentData({ ...editStudentData, classId: e.target.value })
  }
>
  <option value="">Select Class</option>
  {classes.map((cls) => (
    <option key={cls.id} value={cls.id}>{cls.class}</option>
  ))}
</select>
        </div>
      </div>
      

<div className='edit-student-input-wrapper'>
  <label htmlFor="group">Group</label>
  <select
  value={editStudentData.groupId}
  onChange={(e) =>
    setEditStudentData({ ...editStudentData, groupId: e.target.value })
  }
>
  <option value="">Select Group</option>
  {groups.map((grp) => (
    <option key={grp.id} value={grp.id}>{grp.Name}</option>
  ))}
</select>
</div>
<div className='metors-modal-action-buttons'>
<button className='modal-cancel-button' onClick={() => setIsEditModalOpen(false)}>Cancel</button>
<button className='modal-submit-button' onClick={handleUpdateStudent}>Update</button>
      
</div>


      
    </div>
  </div>
)}

    </div>
  );
};

export default Students;
