import React, { createContext, useContext, useEffect, useState } from 'react';
import apiService from "../services/apiService";

const FuncionariosContext = createContext();

export const FuncionariosProvider = ({ children }) => {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      const [funcionariosRes, gestoresRes] = await Promise.all([
        apiService.buscarFuncionarioAtivo(),
        apiService.buscarGestoresInfo(),
      ]);
      const novosDados = {
        funcionarios: funcionariosRes.data,
        gestores: gestoresRes.data,
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
