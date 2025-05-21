import React, { useState } from 'react';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config"; // Make sure your Firestore instance is exported from here
import './FacultyLogin.css';
import { useNavigate } from 'react-router-dom';
import {useAuth, userAuth} from "../../App"

const FacultyLogin = () => {
  const [userName,setUserName] = useState()
  const [password,setPassword] = useState()
  const navigate = useNavigate();
  const {login} = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    // 1. Check in Faculties
    const facultyRef = collection(db, "faculties");
    const facultyQuery = query(facultyRef, where("Username", "==", userName));
    const facultySnapshot = await getDocs(facultyQuery);

    if (!facultySnapshot.empty) {
      const userDoc = facultySnapshot.docs[0].data();
      if (userDoc.Password === password) {
        login({ userName, role: "faculty" });
        navigate("/");
      } else {
        alert("Incorrect password");
      }
      return;
    }

    // 2. Check in Directors
    const directorRef = collection(db, "directors");
    const directorQuery = query(directorRef, where("Username", "==", userName));
    const directorSnapshot = await getDocs(directorQuery);

    if (!directorSnapshot.empty) {
      const userDoc = directorSnapshot.docs[0].data();
      if (userDoc.Password === password) {
        login({ userName, role: "director" });
        navigate("/admin");
      } else {
        alert("Incorrect password");
      }
      return;
    }

    // 3. Not found in either
    alert("User not found");

  } catch (error) {
    console.error("Login error:", error);
    alert("Something went wrong during login");
  }
    
    // if (userName === "faculty1" && password === "pass123") {
    //   login({ userName, role: "faculty" });
    //   navigate("/");
    // } else if (userName === "director1" && password === "pass123") {
    //   login({ userName, role: "director" });
    //   navigate("/admin");
    // } else {
    //   alert("Invalid credentials");
    // }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Caliph Credit</h1>
        <input type="text" placeholder="Username" onChange={(e)=>setUserName(e.target.value)} className="login-input" />
        <input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} className="login-input" />
        <button className="login-button" onClick={handleSubmit}>Login</button>
        <p className="forgot-password">Forgot password?</p>
      </div>
    </div>
  );
};

export default FacultyLogin;
