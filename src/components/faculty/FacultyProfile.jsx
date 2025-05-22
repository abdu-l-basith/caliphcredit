import React, {useEffect, useState} from 'react';
import './FacultyProfile.css';
import { collection, getDocs,doc, getDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';

const FacultyProfile = () => {
    const [name,setName] = useState();
    const [designation, setDesignation] = useState();
    const [email,setEmail] = useState();
    const [number, setNumber] = useState();
    const [userName, setUserName] = useState();
    const [mentees, setMentees] = useState([])

    useEffect(() => {
    const fetchProfile = async () => {
      try {
       const docRef = doc(db, 'faculties', 'UJJILhxxgYcByLZb7OKl');
      const docSnap = await getDoc(docRef);
      setName(docSnap.data().Name);
      setDesignation(docSnap.data().Designation);
      setEmail(docSnap.data().Email);
      setNumber(docSnap.data().Mobile);
      setUserName(docSnap.data().Username);
      setMentees(docSnap.data().Mentees);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Profile Card */}
      <div className="card profile-card">
        <img
          src="https://img.freepik.com/premium-vector/male-face-avatar-icon-set-flat-design-social-media-profiles_1281173-3806.jpg?semt=ais_hybrid&w=740"
          alt="Profile"
          className="profile-img"
        />
        <h3>My Profile</h3>
        <p><strong>Name: {name}</strong></p>
        <p>Designation: {designation}</p>
        <p>Email: {email}</p>
        <p>Mobile: {number}</p>
        <p>User Name: {userName}</p>
        <button className="btn danger" onClick={()=>{console.log('Name')}}>Edit Account Info</button>
      </div>

      {/* eBay Accounts */}
      <div className="card accounts-card">
        <h3>My History</h3>
        <ul>
          <li>
            Jazeel Rahman
            <span className="tag active">Academic Perfomance</span>
          </li>
          <li>
            Ahmed Majid
            <span className="tag inactive">OutSide Program</span>
          </li>
        </ul>
      </div>

      {/* Bills Card */}
      <div className="card bills-card">
        <h3>My Mentees</h3>
        <ul>
          <li>
            AbduRahman <span className="tag success">5</span>
          </li>
          <li>
            Amal Zayan <span className="tag warning">3</span>
          </li>
          <li>
            Afreed P <span className="tag success">7</span>
          </li>
          <li>
            Javad K <span className="tag error">6</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FacultyProfile;
