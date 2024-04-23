import React, { useContext,useEffect,useState } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from './context/AuthContext';
import {jwtDecode }from 'jwt-decode';
import DeptContext from './context/DepartmentContext';
const ProtectedRoute = ({ element, allowedRoles }) => {
  const { user,login } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      const userData = {
        role: decodedToken.user['role'],
        id: decodedToken.user['id'],
        department :decodedToken.user['department'] 
      };
       login(userData);
    } catch (error) {
      console.error("Invalid or expired token", error);
      // Handle invalid or expired token
    } finally {
      setLoading(false);
    }
  } else {
    setLoading(false);
  }
}, []);

if (loading) {
  return <div>Loading...</div>;
}

  // Check if the user has one of the allowed roles
  if (user && allowedRoles.includes(user.role)) {

    return element;
  } else {
    // Redirect to a login page or another route

    return <Navigate to="/" />;
  }
};

export default ProtectedRoute;