// DirectorProfile.jsx
import React, { useState, useEffect } from 'react';
import './DirectorProfile.css';
import { collection, getDocs, doc, getDoc, addDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../App';
import EditProfileModal from './EditProfileModal';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../../firebase/config';

const DirectorProfile = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [profileData, setProfileData] = useState({});
  const { user } = useAuth();
  const [name, setName] = useState();
  const [designation, setDesignation] = useState();
  const [email, setEmail] = useState();
  const [mobile, setMobile] = useState();
  const [userName, setUserName] = useState();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showUserNameForm, setShowUserNameForm] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [confrimNewUserName, setConfrimNewUserName] = useState('');
  const [userError, setUserError] = useState('');
  const [userSuccess, setUserSuccess] = useState('');

  const handlePasswordUpdate = async () => {
    setError('');
    setSuccess('');
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const docRef = doc(db, 'directors', user.id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        setError('User not found.');
        return;
      }

      const data = docSnap.data();
      if (data.Password !== currentPassword) {
        setError('Current password is incorrect.');
        return;
      }

      if (newPassword !== confirmPassword) {
        setError('New passwords do not match.');
        return;
      }

      await setDoc(docRef, { Password: newPassword }, { merge: true });
      setSuccess('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setShowPasswordForm(false);
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError('Failed to update password.');
      console.error(err);
    }
  };

  const handleSave = async (updatedData) => {
    try {
      let photoURL = profileData.ProfilePicURL;

      if (updatedData.Photo && typeof updatedData.Photo !== 'string') {
        // Delete old image if exists
        if (photoURL) {
          const oldImageRef = ref(storage, photoURL);
          try {
            await deleteObject(oldImageRef);
            console.log('Old profile image deleted');
          } catch (deleteError) {
            console.warn('Failed to delete old profile image:', deleteError.message);
          }
        }

        const newImageRef = ref(storage, `directors/${user.id}_${Date.now()}`);
        await uploadBytes(newImageRef, updatedData.Photo);
        photoURL = await getDownloadURL(newImageRef);
      }

      const updatedProfile = {
        Name: updatedData.Name,
        Designation: updatedData.Designation,
        Mobile: updatedData.Mobile,
        Email: updatedData.Email,
        ProfilePicURL: photoURL,
      };

      await setDoc(doc(db, 'directors', user.id), updatedProfile, { merge: true });

      setProfileData(updatedProfile);
      setName(updatedProfile.Name);
      setDesignation(updatedProfile.Designation);
      setEmail(updatedProfile.Email);
      setMobile(updatedProfile.Mobile);
      setShowEditModal(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  const handleUserNameUpdate = async () => {
    setUserError('');
    setUserSuccess('');
    if (!newUserName || !confrimNewUserName) {
      setUserError('Please fill in all fields.');
      return;
    }

    try {
      const docRef = doc(db, 'directors', user.id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        setUserError('User not found.');
        return;
      }

      if (newUserName !== confrimNewUserName) {
        setUserError('New usernames do not match.');
        return;
      }

      await setDoc(docRef, { Username: newUserName }, { merge: true });
      setUserSuccess('Username updated successfully.');
      setNewUserName('');
      setConfrimNewUserName('');
      setTimeout(() => {
        setShowUserNameForm(false);
        setUserSuccess('');
      }, 2000);
    } catch (err) {
      setUserError('Failed to update username.');
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) {
        console.error("No user ID found");
        return;
      }

      try {
        const docRef = doc(db, 'directors', user.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.Name);
          setDesignation(data.Designation);
          setEmail(data.Email);
          setMobile(data.Mobile);
          setUserName(data.Username);
          setProfileData(data);
        } else {
          console.error("Faculty document not found");
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [user]);

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={profileData.ProfilePicURL || "https://via.placeholder.com/150"}
          alt="Profile"
          className="profile-image"
        />
        <div className="profile-info">
          <h2>{name}</h2>
          <p>{designation}</p>
        </div>
        <button className='director-profile-page-button' onClick={() => setShowEditModal(true)}>Update Profile</button>
        <EditProfileModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          profile={profileData}
          onSave={handleSave}
        />
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Mobile: {mobile}</label>
        </div>
        <div className="form-group">
          <label>Email: {email}</label>
        </div>
        <div className="form-group">
          <label>Username: {userName}</label>
        </div>
      </div>

      <div className="email-section">
        <div className='change-password-container'>
          <button
            className="director-profile-page-button"
            onClick={() => {
              setShowPasswordForm((prev) => !prev);
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
              setError('');
              setSuccess('');
            }}
          >
            Change Password
          </button>
          {showPasswordForm && (
            <div className="password-form">
              <input type="text" placeholder="Current Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
              <input type="text" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              <input type="text" placeholder="Confirm New Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              {error && <p className="error-msg">{error}</p>}
              {success && <p className="success-msg">{success}</p>}
              <button className="director-profile-page-button" onClick={handlePasswordUpdate}>Update Password</button>
            </div>
          )}
        </div>

        <div className='change-password-container'>
          <button
            className="director-profile-page-button"
            onClick={() => {
              setShowUserNameForm((prev) => !prev);
              setNewUserName('');
              setConfrimNewUserName('');
              setUserError('');
              setUserSuccess('');
            }}
          >
            Change Username
          </button>
          {showUserNameForm && (
            <div className="password-form">
              <input type="text" placeholder="New Username" value={newUserName} onChange={e => setNewUserName(e.target.value)} />
              <input type="text" placeholder="Confirm New Username" value={confrimNewUserName} onChange={e => setConfrimNewUserName(e.target.value)} />
              {userError && <p className="error-msg">{userError}</p>}
              {userSuccess && <p className="success-msg">{userSuccess}</p>}
              <button className="director-profile-page-button" onClick={handleUserNameUpdate}>Update Username</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DirectorProfile;
