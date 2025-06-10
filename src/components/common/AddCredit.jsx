import React, { useState, useEffect } from 'react';
import './AddCredit.css';
import { db } from '../../firebase/config';
import { collection, getDocs, getDoc, addDoc, serverTimestamp, updateDoc, arrayUnion, increment, doc } from 'firebase/firestore';
import SliderWithLabels from './CreditSlider';
import CreditSelect from './MultiCreditSelecter';
import SingleCredit from './SingleCredit';
import { useAuth } from '../../App';
// user.id = faculty's firestore doc ID



const AddCredit = ({ isOpen, onClose, title, credit, description, creditId}) => {
  
  const [students, setStudents] = useState([]);
const [selectedStudent, setSelectedStudent] = useState('');
const { user } = useAuth();

const handleApprove = async () => {
  if (!selectedStudent || selectedCredit === null) {
    alert('Please select a student and a credit value.');
    return;
  }
  const newCredit = {
    student: selectedStudent,
    credit: Number(selectedCredit) ,
    title: creditId,
    remark: remark,
    date: serverTimestamp(),
    approvedBy: user?.id || 'Unknown'
  };

  try {
    // Step 1: Add credit to 'credits' collection
    const creditRef = await addDoc(collection(db, 'credits'), newCredit);

    // Step 2: Reference the student document
    const studentRef = doc(db, 'students', selectedStudent);

    // Step 3: Update student's doc: push credit ID + increment totalCredits
    await updateDoc(studentRef, {
      credits: arrayUnion(creditRef.id), // Add credit ID to array
      totalCredits: increment(selectedCredit) // Add credit score to total
    });

    alert('Credit approved, added to Firestore, and student updated!');
    onClose();

    // Reset fields
    setSelectedStudent('');
    setSelectedCredit(null);
    setRemark('');
  } catch (error) {
    console.error('Error approving credit:', error);
    alert('Failed to approve credit. Please try again.');
  }
};

const handleStudentChange = (e) => {
  setSelectedStudent(e.target.value);
};
const [selectedCredit, setSelectedCredit] = useState(null);
const renderCreditType = (credit) => {
    // if (credit.type === 'credit') return <h1>Credit</h1>;
    
    if (credit.type === 'max') return <SliderWithLabels credit={credit.value} onCreditFix={setSelectedCredit}></SliderWithLabels>
    if (credit.type === 'categories') return <CreditSelect credit={credit.value} onCreditFix={setSelectedCredit}></CreditSelect>
    if (credit.type === 'credit') return <SingleCredit credit={credit.value} onCreditFix={setSelectedCredit} />;
    return null;
  };
  const [remark,setRemark] = useState('')
  const handleRemark = (e)=>{
    setRemark(e.target.value);
  }
  
 useEffect(() => {
  const fetchStudents = async () => {
    if (!user?.id) {
      console.error("No faculty user ID found");
      return;
    }

    try {
      // Step 1: Get current faculty doc
      const facultyRef = doc(db, 'faculties', user.id);
      const facultySnap = await getDoc(facultyRef);

      if (!facultySnap.exists()) {
        console.error("Faculty document not found");
        return;
      }

      const facultyData = facultySnap.data();
      const authLevel = facultyData.Auth; // 0 or 1

      if (authLevel === 1) {
        // If Auth = 1, fetch all students
        const querySnapshot = await getDocs(collection(db, 'students'));
        const allStudents = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name
        }));
        setStudents(allStudents);
      } else {
        // If Auth = 0, fetch only allowedStudents
        const allowedStudentIds = facultyData.Mentees || [];

        if (allowedStudentIds.length === 0) {
          setStudents([]); // No allowed students
          return;
        }

        const studentPromises = allowedStudentIds.map(studentId =>
          getDoc(doc(db, 'students', studentId))
        );

        const studentDocs = await Promise.all(studentPromises);

        const allowedStudents = studentDocs
          .filter(docSnap => docSnap.exists())
          .map(docSnap => ({
            id: docSnap.id,
            name: docSnap.data().name
          }));

        setStudents(allowedStudents);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  fetchStudents();
}, [user]);


  // ✅ Only return null after all hooks are declared
  if (!isOpen) return null;

  return (
    <div className="add-credit-modal-overlay">
      <div className="add-credit-modal-content">
        <button className="add-credit-close-button" onClick={onClose}>×</button>
        <h2 className="add-credit-form-title">{title?.toUpperCase()}</h2>
        <div className="add-credit-info-bar">
          <span className="add-credit-info-icon"><i class="fa-solid fa-circle-info"></i></span>
          <p>{description}</p>
        </div>
        {renderCreditType(credit)}.
        <select className="add-credit-student-select" value={selectedStudent} onChange={handleStudentChange}>
  <option value="">Select Student</option>
  {students.map((student) => (
    <option key={student.id} value={student.id}>
      {student.name}
    </option>
  ))}
</select>


        <textarea
        className="add-credit-remarks-box"
        placeholder="Remarks....." 
        value={remark}
        onChange={handleRemark} 
        />

        {selectedStudent && (
  <>
  



    <button className="add-credit-approve-button" onClick={handleApprove}>APPROVE</button>
  </>
)}

      
      </div>
    </div>
  );
};

export default AddCredit;
