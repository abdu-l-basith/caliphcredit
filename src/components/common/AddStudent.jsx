import React, { useEffect, useState } from 'react';
import './Addstudent.css';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

const AddStudent = () => {
  const [name, setName] = useState('');
  const [classList, setClassList] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [mentorList, setMentorList] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState('');
  const [groupList, setGroupList] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');

  useEffect(() => {
    const fetchDropdownData = async () => {
      const classesSnapshot = await getDocs(collection(db, 'classes'));
      const groupsSnapshot = await getDocs(collection(db, 'groups'));
      const facultiesSnapshot = await getDocs(collection(db, 'faculties'));

      setClassList(classesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setGroupList(groupsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setMentorList(facultiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchDropdownData();
  }, []);

  const handleAddStudent = async () => {
    if (!name || !selectedClass || !rollNumber || !selectedMentor || !selectedGroup) {
      alert('Please fill all fields.');
      return;
    }

    try {
      await addDoc(collection(db, 'students'), {
        name,
        classId: selectedClass,
        rollNumber,
        mentorId: selectedMentor,
        groupId: selectedGroup,
        totalCredits: 0,
        createdAt: serverTimestamp()
      });
      alert('Student added successfully');
      setName('');
      setSelectedClass('');
      setRollNumber('');
      setSelectedMentor('');
      setSelectedGroup('');
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Failed to add student.');
    }
  };

  return (
    <div className="add-student-container">
      <h2>ADD STUDENT</h2>
      <input
        type="text"
        placeholder="Name:"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div className="row">
        <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
          <option value="">Class</option>
          {classList.map(cls => (
            <option key={cls.id} value={cls.id}>{cls.class}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Roll Number:"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
        />
      </div>
      <select value={selectedMentor} onChange={(e) => setSelectedMentor(e.target.value)}>
        <option value="">Mentor</option>
        {mentorList.map(m => (
          <option key={m.id} value={m.id}>{m.Name}</option>
        ))}
      </select>
      <div className="row">
        <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
          <option value="">Group</option>
          {groupList.map(gr => (
            <option key={gr.id} value={gr.id}>{gr.Name}</option>
          ))}
        </select>
        <button className="addStudentBotton" onClick={handleAddStudent}>ADD STUDENT</button>
        
      </div>
    </div>
  );
};

export default AddStudent;
