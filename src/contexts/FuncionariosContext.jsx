import React, { createContext, useContext, useEffect, useState } from 'react';
import { useMsal } from "@azure/msal-react";
import apiService from "../services/apiService";

const FuncionariosContext = createContext();

export const FuncionariosProvider = ({ children }) => {
  const { accounts, inProgress } = useMsal();
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Só busca depois que o MSAL terminou de inicializar/processar o login.
    // Buscando antes disso, getAllAccounts() (usado em getAuthHeaders) ainda
    // está vazio, o request sai sem token válido e o backend responde 401
    // "Token Inválido".
    if (inProgress !== 'none') return;
    if (accounts.length === 0) {
      setCarregando(false);
      return;
    }
    getData();
  }, [inProgress, accounts]);

  async function getData() {
    try {
      const [funcionariosRes, gestoresRes, areasRes] = await Promise.all([
        apiService.buscarFuncionarioAtivo(),
        apiService.buscarGestoresInfo(),
        apiService.buscarAreas(),
      ]);
      const novosDados = {
        funcionarios: funcionariosRes.data,
        gestores: gestoresRes.data,
        areas: areasRes.data,
      };
      setDados(novosDados);
    } catch (error) {
      console.error("Erro em getData (FuncionariosContext):", error);
    } finally {
      setCarregando(false);
    }
  }

  // Rebusca só a lista de gestores (rota /gestores), sem refazer a busca de
  // funcionários. Usado após criar/editar/excluir um gestor.
  async function getGestores() {
    try {
      const gestoresRes = await apiService.buscarGestoresInfo();
      setDados((prevDados) => ({
        ...(prevDados ?? {}),
        gestores: gestoresRes.data,
      }));
    } catch (error) {
      console.error("Erro em getGestores (FuncionariosContext):", error);
    }
  }

  return (
    <FuncionariosContext.Provider value={{ dados, carregando, getData, getGestores }}>
      {children}
    </FuncionariosContext.Provider>
  );
};

export const useFuncionarios = () => useContext(FuncionariosContext);
