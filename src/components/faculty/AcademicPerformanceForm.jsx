import React, { useState, useEffect } from 'react';
import './AcademicPerformanceForm.css';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import SliderWithLabels from './Slider';
import CreditSelect from './CreditSelect';
import SingleCredit from './SingleCredit';



const AcademicPerformanceModal = ({ isOpen, onClose, title, credit, description }) => {
  const [students, setStudents] = useState([]);
const [selectedStudent, setSelectedStudent] = useState('');

const handleApprove = async () => {
  if (!selectedStudent || selectedCredit === null) {
    alert('Please select a student and a credit value.');
    return;
  }

  const newCredit = {
    student: selectedStudent,
    credit: selectedCredit,
    title: title,
    remark: remark,
    date: serverTimestamp(), // auto timestamp
  };

  try {
    await addDoc(collection(db, 'credits'), newCredit);
    alert('Credit approved and added to Firestore!');
    onClose(); // optionally close modal
    // Optionally reset fields here
    setSelectedStudent('');
    setSelectedCredit(null);
    setRemark('');
  } catch (error) {
    console.error('Error adding credit:', error);
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
      try {
        const querySnapshot = await getDocs(collection(db, 'students'));
        const studentList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().Name
        }));
        setStudents(studentList);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  // ✅ Only return null after all hooks are declared
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>

        <h2 className="form-title">{title?.toUpperCase()}</h2>
        <div className="info-bar">
          <span className="info-icon">ℹ️</span>
          <p>{description}</p>
        </div>
        {renderCreditType(credit)}.
        <select className="student-select" value={selectedStudent} onChange={handleStudentChange}>
  <option value="">Select Student</option>
  {students.map((student) => (
    <option key={student.id} value={student.name}>
      {student.name}
    </option>
  ))}
</select>


        <textarea
        className="remarks-box"
        placeholder="Remarks....." 
        value={remark}
        onChange={handleRemark} 
        />

        {selectedStudent && (
  <>
    {/* <p className="credits-message">
  {typeof credit === "number" ? (
    `${selectedStudent} got ${credit} credits for academic performance`
  ) : Array.isArray(credit) ? (
    <>
      {selectedStudent} got the following credits:
      <ul>
        {credit.map((item, index) => (
          <li key={index}>
            {item.Title}: {item.Credit}
          </li>
        ))}
      </ul>
    </>
  ) : (
    'No credit data available.'
  )}
</p> */}
{/* <p className='credit-message'>{selectedStudent} got {selectedCredit} credits for {title}</p> */}


    <button className="approve-button" onClick={handleApprove}>APPROVE</button>
  </>
)}

        {/* <button className="approve-button">APPROVE</button> */}
      </div>
    </div>
  );
};

export default AcademicPerformanceModal;
