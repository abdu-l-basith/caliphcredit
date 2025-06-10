// HackerLogin.jsx
import React from 'react';
import './SuperAdminLogin.css';
import hackerBg from './superadmin.jpg'; // ✅ Adjust the import path based on your file location
import { auth } from '../../firebase/config';
import { sendSignInLinkToEmail } from 'firebase/auth';


const SuperAdminLogin = () => {
  const email = 'vmabasith@gmail.com'
  const sendLoginLink = async () => {
  const actionCodeSettings = {
    url: 'http://localhost:3000/superadmin',  // 🔥 Must match authorized domain
    handleCodeInApp: true,
  };

  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem('emailForSignIn', 'vmabasith@gmail.com'); // store email
    alert("Login link sent!");
  } catch (error) {
    console.error("Error sending email link", error);
  }
};
  const loginButton = 'Login >>';
  return (
    <div className="super-admin-login-hacker-login" style={{ backgroundImage: `url(${hackerBg})` }}>
      <div className="super-admin-login-login-overlay">
        <p onClick={sendLoginLink} className="super-admin-login-login-link">{loginButton}</p>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
