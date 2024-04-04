import React, { createContext, useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import { jwtDecode } from "jwt-decode";
const AuthState = (props) => {
  const [user, setUser] = useState(null); // User state, initially null

  const [loading, setLoading] = useState(true);
  const login = (userData) => {
    setUser(userData);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userData = {
          role: decodedToken.user["role"],
          id: decodedToken.user["id"],
          department: decodedToken.user["department"],
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

  return (
    <AuthContext.Provider
      value={{
        user,
        login, // Function to set user data
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
