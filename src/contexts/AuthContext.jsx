import React, { createContext, useContext, useEffect, useState } from 'react';
import { getUserProfile } from "../services/graph";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from '../services/authConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { instance, accounts } = useMsal();
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log(accounts);
    if (accounts.length > 0) {
      getUserProfile(instance, accounts).then(setUser);
    }
  }, [accounts, instance]);

  function getData(){
    if (accounts.length > 0) {
      getUserProfile(instance, accounts).then(setUser);
    }
  }

  return (
    <AuthContext.Provider value={{ user, instance, getData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
