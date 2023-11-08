import React, { createContext, useState, useEffect } from 'react';
import AuthContext from './AuthContext';

const AuthState = (props) => {
  const [user, setUser] = useState(null); // User state, initially null
  const login = (userData) => {
    setUser(userData);
    console.log(userData)
  };

  // useEffect(() => {
  //   // You can add authentication logic here, e.g., checking for an existing token in local storage
  //   // Example:
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     // Fetch user data using the token and update the user state
  //     // You can use Axios or fetch for making an API request to verify the token and get user data
  //     // Example:
  //     // axios.get("/api/user", { headers: { Authorization: `Bearer ${token}` } })
  //     //   .then((response) => {
  //     //     const userData = response.data;
  //     //     loginUser(userData);
  //     //   })
  //     //   .catch((error) => {
  //     //     console.error("Error fetching user data:", error);
  //     //   });
  //   }
  // }, []);

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
