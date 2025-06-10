import React, { useEffect, useState } from 'react';
import './FacultyProfile.css';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../App';
import EditFacultyModal from './EditFacultyModal'

const FacultyProfile = ({ setCurrentPage }) => {
  const [name, setName] = useState();
  const [designation, setDesignation] = useState();
  const [email, setEmail] = useState();
  const [number, setNumber] = useState();
  const [userName, setUserName] = useState();
  const [profilePicURL, setProfilePicURL] = useState(); // 👈 Add this state
  const [mentees, setMentees] = useState([]);
  const { user } = useAuth();
  const [menteeDetails, setMenteeDetails] = useState([]);
  const [history, setHistory] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
const [currentPassword, setCurrentPassword] = useState('');
const [newPassword, setNewPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [errorMsg, setErrorMsg] = useState('');


const handleProfileUpdate = (updatedData) => {
  setName(updatedData.name);
  setEmail(updatedData.email);
  setNumber(updatedData.mobile);
  setUserName(updatedData.username);
  setProfilePicURL(updatedData.profilePicURL);
};


  useEffect(() => {
  const fetchHistory = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "credits"));
      const matchedCredits = [];

      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        if (!data || !data.approvedBy || !data.student) continue;

        if (data.approvedBy === user?.id) {
          const studentRef = doc(db, "students", data.student);
          const studentSnap = await getDoc(studentRef);

          // Fetch title from menus collection
          let creditTitle = "Untitled";
          if (data.title) {
            const titleDoc = await getDoc(doc(db, "menus", data.title));
            if (titleDoc.exists()) {
              creditTitle = titleDoc.data().Title || "Untitled";
            }
          }

          matchedCredits.push({
            studentName: studentSnap.exists() ? studentSnap.data().name : "Unknown",
            title: creditTitle,
          });
        }
      }

      setHistory(matchedCredits);
    } catch (error) {
      console.error("Error fetching credit history:", error);
    }
  };

  if (user?.id) {
    fetchHistory();
  }
}, [user]);


  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;

      try {
        const docRef = doc(db, 'faculties', user.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log(data)
          setName(data.Name);
          setDesignation(data.Designation);
          setEmail(data.Email);
          setNumber(data.Mobile);
          setUserName(data.Username);
          setMentees(data.mentees);
          setProfilePicURL(data.ProfilePicURL); // 👈 Set the profile picture URL

          console.log(profilePicURL);
        } else {
          console.error("Faculty document not found");
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [user]);

  useEffect(() => {
    const fetchMenteeDetails = async () => {
      if (!mentees || mentees.length === 0) return;

      try {
        const menteeDataPromises = mentees.map(async (studentId) => {
          const docRef = doc(db, "students", studentId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            return {
              name: data.name || "Unnamed",
              totalCredits: data.totalCredits || 0,
            };
          } else {
            return { name: "Unknown", totalCredits: 0 };
          }
        });

        const resolvedMentees = await Promise.all(menteeDataPromises);
        setMenteeDetails(resolvedMentees);
      } catch (error) {
        console.error("Error fetching mentee data:", error);
      }
    };

    fetchMenteeDetails();
  }, [mentees]);

  return (
    <div className="faculty-profile-dashboard-container">
      {/* Profile Card */}
      <div className="faculty-profile-card profile-card">
        <div className="faculty-profile-car-profile-pic">
          <img
          src={profilePicURL || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} // 👈 Use the fetched URL
          alt="Profile image"
          className="faculty-profile-profile-img"
        />
        <h3 className='faculty-profile-head-line'>My Profile</h3>
        </div>
        <div className="faculty-profile-details-ptags">
        <p className='faculty-profile-name-details'><strong>Name: {name}</strong></p>
        <p className='faculty-profile-name-details'>Designation: {designation}</p>
        <p className='faculty-profile-name-details'>Email: {email}</p>
        <p className='faculty-profile-name-details'>Mobile: {number}</p>
        <p className='faculty-profile-name-details'>User Name: {userName}</p>
        <button className="faculty-profile-edit-info-button" onClick={() => setIsEditModalOpen(true)}>Edit Account Info</button>
        <p onClick={() => setIsPasswordModalOpen(true)} className='faculty-profile-forgot-password'>Change Password</p>
        </div>
      </div>

      {/* My History */}
      <div className="faculty-profile-card accounts-card">
        <div className="faculty-profile-my-histroy-full-wrapper">

        
        <h3>My History</h3>
        <div className='faculty-profile-my-history-wrapper'>
          {history.slice(0, 5).map((entry, index) => (
            <div className="faculty-profile-my-history-each-wrapper" key={index}>
            <h5 className='faculty-profile-history-head-line'>{entry.title}</h5>
            <p className='faculty-profile-history-description'>to: {entry.studentName}</p>
            </div>
          ))}
        </div>
        <div className='faculty-profile-more-histroy-button'>
          <button className="faculty-profile-edit-info-button" onClick={() => setCurrentPage('history')}>Full History</button>
          
          </div>
        </div>
      </div>

      {/* My Mentees */}
      <div className="faculty-profile-card bills-card">

        <h3>My Mentees</h3>
        <div className="faculty-profile-my-history-each-wrapper"></div>
        <ul className='faculty-profile-mentees-ul'>
          {menteeDetails.map((mentee, index) => (
            <li className='faculty-profile-mentees-li' key={index}>
              {mentee.name}{" "}
              <span
                className={`tag ${
                  mentee.totalCredits >= 50
                    ? "success"
                    : mentee.totalCredits >= 20
                    ? "warning"
                    : "error"
                }`}
              >
                {mentee.totalCredits}
              </span>
            </li>
          ))}
        </ul>
      </div>
      {isEditModalOpen && (
  <EditFacultyModal
    facultyId={user.id}
    initialValues={{
      name,
      email,
      mobile: number,
      username: userName,
      profilePicURL,
    }}
    onClose={() => setIsEditModalOpen(false)}
    onUpdated={handleProfileUpdate}
  />
)}
{isPasswordModalOpen && (
  <div className="modal-backdrop">
    <div className="modal">
      <h3>Change Password</h3>
      <input
        type="password"
        placeholder="Current Password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      {errorMsg && <p className="error">{errorMsg}</p>}
      <div className="modal-actions">
        <button className="btn success" onClick={async () => {
          try {
            setErrorMsg('');
            const facultyDocRef = doc(db, 'faculties', user.id);
            const docSnap = await getDoc(facultyDocRef);
            const existingPassword = docSnap.exists() ? docSnap.data().Password : null;

            if (existingPassword !== currentPassword) {
              setErrorMsg('Current password is incorrect.');
              return;
            }

            if (newPassword !== confirmPassword) {
              setErrorMsg('New passwords do not match.');
              return;
            }

            await updateDoc(facultyDocRef, { Password: newPassword });
            setIsPasswordModalOpen(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            alert('Password updated successfully.');
          } catch (err) {
            console.error('Error updating password:', err);
            setErrorMsg('Something went wrong. Try again.');
          }
        }}>
          Update
        </button>
        <button className="btn danger" onClick={() => {
          setIsPasswordModalOpen(false);
          setErrorMsg('');
        }}>
          Cancel``
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default FacultyProfile;
