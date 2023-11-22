import React, { createContext, useState, useEffect } from 'react';
import AuthContext from './AuthContext';

const AuthState = (props) => {
  const [user, setUser] = useState(null); // User state, initially null
  const login = (userData) => {
    setUser(userData);
    console.log(userData)
  };

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
