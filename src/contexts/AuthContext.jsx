import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSharePointData, getUserProfile } from "../services/graph";
import { useMsal } from "@azure/msal-react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { instance, accounts } = useMsal();
  const [user, setUser] = useState(null);
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  
  useEffect(() => {
    async function fetchData() {
      if (accounts.length > 0) {
        await getData(); 
      }
      setCarregando(false);
    }
    fetchData();
  }, [accounts, instance]);

  async function getData() {
    if (accounts.length > 0) {
      try {
        if (!user) {
          const userSalvo = localStorage.getItem("userMSAL");
          if (userSalvo) {
            const userMSAL = JSON.parse(userSalvo);
            setUser(userMSAL);
            // console.log("busquei user localmente");
            // usar os dados
          } else {
            const user = await getUserProfile(instance, accounts);
            setUser(user);
            // console.log("busquei user");
          }
        }
        if (!dados) {
          const dadosSalvos = sessionStorage.getItem("sharePoint");
          if (dadosSalvos) {
            const dados = JSON.parse(dadosSalvos);
            setDados(dados);
          } else {
            const dados = await getSharePointData(instance, accounts);
            setDados(dados);
          }
        }
        setCarregando(false);
      } catch (error) {
        console.error("Erro em getData:", error);
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
