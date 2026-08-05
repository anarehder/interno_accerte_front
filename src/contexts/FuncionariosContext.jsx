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

  return (
    <FuncionariosContext.Provider value={{ dados, carregando, getData }}>
      {children}
    </FuncionariosContext.Provider>
  );
};

export const useFuncionarios = () => useContext(FuncionariosContext);
