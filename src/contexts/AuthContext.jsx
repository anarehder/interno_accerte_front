import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSharePointData, getUserProfile } from "../services/graph";
import { useMsal } from "@azure/msal-react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { instance, accounts } = useMsal();
  const [user, setUser] = useState(null);
  const [dados, setDados] = useState(null);

  useEffect(() => {
    if (accounts.length > 0) {
      getUserProfile(instance, accounts).then(setUser);
      getSharePointData(instance, accounts).then(setDados);
    }
  }, [accounts, instance]);

  function getData(){
    if (accounts.length > 0) {
      getUserProfile(instance, accounts).then(setUser);
      getSharePointData(instance, accounts).then(setDados);
    }
  }

  return (
    <AuthContext.Provider value={{ user, dados, instance, getData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
