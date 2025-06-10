import React, { useState, useRef } from 'react';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../App";
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const facultyRef = collection(db, "faculties");
      const facultyQuery = query(facultyRef, where("Username", "==", userName));
      const facultySnapshot = await getDocs(facultyQuery);

      if (!facultySnapshot.empty) {
        const docSnap = facultySnapshot.docs[0];
        const userDoc = docSnap.data();
        if (userDoc.Password === password) {
          login({ userName, role: "faculty", id: docSnap.id });
          navigate("/");
        } else {
          alert("Incorrect password");
        }
        return;
      }

      const directorRef = collection(db, "directors");
      const directorQuery = query(directorRef, where("Username", "==", userName));
      const directorSnapshot = await getDocs(directorQuery);

      if (!directorSnapshot.empty) {
        const directorSnap = directorSnapshot.docs[0];
        const userDoc = directorSnapshot.docs[0].data();
        if (userDoc.Password === password) {
          login({ userName, role: "director", id: directorSnap.id });
          navigate("/admin");
        } else {
          alert("Incorrect password");
        }
        return;
      }

      alert("User not found");
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong during login");
    }
  };

  return (
    <div className="user-login-container">
      <form className="user-login-box" onSubmit={handleSubmit}>
        <h1>Login</h1>

        <input
          type="text"
          placeholder="Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="user-login-input"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              passwordRef.current?.focus();
            }
          }}
        />

        <div className="password-boxed">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            ref={passwordRef}
            onChange={(e) => setPassword(e.target.value)}
            className="user-login-input password-input"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit(e);
              }
            }}
          />
          <div className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
        </div>

        <button type="submit" className="user-login-button">Login</button>
        <p className="user-forgot-password">Forgot password?</p>
      </form>
    </div>
  );
};

export default Login;
