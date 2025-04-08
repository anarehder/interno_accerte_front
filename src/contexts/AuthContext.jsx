import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSharePointData, getUserProfile } from "../services/graph";
import { useMsal } from "@azure/msal-react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { instance, accounts } = useMsal();
  const [user, setUser] = useState(null);
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  // useEffect(() => {
  //   async function fetchData() {
  //     if (accounts.length > 0) {
  //       await getData();
  //     }
  //   }
  //   fetchData();
  // }, [accounts, instance]);

  async function getData() {
    if (accounts.length > 0) {
      try {
        if (!user) {
          const user = await getUserProfile(instance, accounts);
          setUser(user);
        }
        if (!dados) {
          const dados = await getSharePointData(instance, accounts);
          setDados(dados);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setCarregando(false);
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, dados, instance, carregando, getData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
