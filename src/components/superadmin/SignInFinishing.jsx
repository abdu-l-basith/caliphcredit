import React from 'react'
import { useEffect } from 'react';
import { auth } from '../../firebase/config';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
function SignInFinishing() {
    const navigate = useNavigate();
    
      useEffect(() => {
        const email = window.localStorage.getItem('emailForSignIn');
    
        if (!email) {
          console.error("Email not found in localStorage.");
          return;
        }
    
        if (isSignInWithEmailLink(auth, window.location.href)) {
          signInWithEmailLink(auth, email, window.location.href)
            .then((result) => {
                const user = result.user;
                // Save session info
    sessionStorage.setItem("user", JSON.stringify({
      uid: user.uid,
      email: user.email,
    }));
              
              window.localStorage.removeItem('emailForSignIn');
              navigate('/superadmin'); // 🔥 Redirect to your protected page
            })
            .catch((error) => {
              console.error("Sign-in failed", error);
            });
        }
      }, [navigate]);
    
  return (
    <div>SignInFinishing</div>
  )
}

export default SignInFinishing