import React, { useEffect, useState } from 'react';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const AddStudentCreditModal = ({ isOpen, onClose }) => {
  const [students, setStudents] = useState([]);
  const [credits, setCredits] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCreditId, setSelectedCreditId] = useState('');
  const [creditDetail, setCreditDetail] = useState(null);
  const [selectedCredit, setSelectedCredit] = useState(null);
  const [sliderValue, setSliderValue] = useState(0);
  const [remarks, setRemarks] = useState('');
  const [selectedButton, setSelectedButton] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const studentSnap = await getDocs(collection(db, 'students'));
      const menuSnap = await getDocs(collection(db, 'menus'));
      setStudents(studentSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setCredits(menuSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    if (isOpen) fetchData();
  }, [isOpen]);

  useEffect(() => {
    if (selectedCreditId) {
      const credit = credits.find(c => c.id === selectedCreditId);
      setCreditDetail(credit);
      setSliderValue(0);
      setSelectedButton(null);
    }
  }, [selectedCreditId]);

  const handleSubmit = async () => {
    if (!selectedStudent || !selectedCreditId) return;

    let creditValue = 0;
    if (creditDetail?.Credit) {
      creditValue = creditDetail.Credit;
    } else if (creditDetail?.MaxCredit) {
      creditValue = sliderValue;
    } else if (creditDetail?.Credits && selectedButton !== null) {
  creditValue = creditDetail.Credits[selectedButton]?.Credit || 0;
}
    await setDoc(doc(db, 'credits', `${Date.now()}_${selectedStudent}`), {
      studentId: selectedStudent,
      creditId: selectedCreditId,
      title: creditDetail?.Title || '',
      credit: creditValue,
      remarks,
      createdAt: new Date()
    });

    // Reset
    setSelectedStudent('');
    setSelectedCreditId('');
    setRemarks('');
    setSelectedButton(null);
    setSliderValue(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Credit to Student</h2>

        <label>Select Student</label>
        <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)}>
          <option value="">-- Select --</option>
          {students.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <label>Select Credit</label>    
        <select value={selectedCreditId} onChange={e => setSelectedCreditId(e.target.value)}>
          <option value="">-- Select --</option>
          {credits.map(c => (
            <option key={c.id} value={c.id}>{c.Title}</option>
          ))}
        </select>

        {creditDetail?.Credit !== undefined && (
          <p>Credit: <strong>{creditDetail.Credit}</strong></p>
        )}

        {creditDetail?.MaxCredit !== undefined && (
          <>
            <label>Credit (0 to {creditDetail.MaxCredit})</label>
            <input
              type="range"
              min={0}
              max={creditDetail.MaxCredit}
              value={sliderValue}
              onChange={e => setSliderValue(Number(e.target.value))}
            />
            <p>Selected: {sliderValue}</p>
          </>
        )}

        {Array.isArray(creditDetail?.Credits) && (
  <div className="credit-buttons">
    {creditDetail.Credits.map((item, index) => (
      <button
        key={index}
        className={selectedButton === index ? 'selected' : ''}
        onClick={() => setSelectedButton(index)}
      >
        {item.Title} ({item.Credit})
      </button>
    ))}
  </div>
)}


        <label>Remarks</label>
        <textarea value={remarks} onChange={e => setRemarks(e.target.value)} />

        <div className="modal-actions">
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={onClose} className="cancel">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddStudentCreditModal;
