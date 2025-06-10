import React, { createContext, useState, useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import FacultyDashboard from "./components/common/AddCreditMenus";
import DashboardLayout from "./pages/faculty/FacultyDashboardLayout";
import FacultyLogin from "./components/common/Login";
import DirectorDashboardLayout from "./pages/director/DirectorDashboardLayout";
import SuperAdminLogin from "./components/superadmin/SuperAdminLogin";
import SuperAdminHome from "./components/superadmin/SuperAdminHome";
import SignInFinishing from "./components/superadmin/SignInFinishing";


const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading flag

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      console.log("Restored user from localStorage", JSON.parse(storedUser));
    }
    setLoading(false); // ✅ Wait for loading to finish
  }, []);
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    console.log("Saved user", userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // ✅ Show loading screen until session is loaded
  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  return useContext(AuthContext);
}



// const ProtectedRoute2 = ({ children }) => {
//   const user = sessionStorage.getItem("user");

//   if (!user) {
//     return <Navigate to="/basith-login" />;
//   }

//   return children;
// };



function ProtectedRoute({ allowedRoles, children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user.role)) {
    if (user.role === "faculty") return <Navigate to="/" replace />;
    if (user.role === "director") return <Navigate to="/admin" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    
      <Router>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={["faculty"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["director"]}>
                <DirectorDashboardLayout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/basith-login"
            element={
                <SuperAdminLogin />
            }
          />
          <Route 
          path="/superadmin" 
          element={
            // <ProtectedRoute2>
              <SuperAdminHome />
            // </ProtectedRoute2>
          } 
        />
          <Route
            path="/signing"
            element={
                <SignInFinishing ></SignInFinishing>
            }
          />
          <Route
            path="/login"
            element={
              <FacultyLogin />
              
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        </AuthProvider>
      </Router>
    
  );
}
