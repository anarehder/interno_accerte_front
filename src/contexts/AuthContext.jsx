// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import { msalInstance } from "../services/authConfig"; 
import { useNavigate  } from "react-router-dom";
import { useMsal } from "@azure/msal-react";

// Criando o contexto
const AuthContext = createContext();

// Provedor do contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); 
  const { instance, accounts } = useMsal();

  useEffect(() => {
    // Verifica se o usuário está logado na inicialização
    const account = msalInstance.getAllAccounts()[0];
    if (account) {
      const user_to_save = {
        name: account.name,
        email: account.username,
        token: account.idToken,
    };
      setUser(user_to_save);
      navigate("/intranet/homepage");
    } else {
      navigate("/"); // Redireciona para a página de login se não estiver logado
    }
  }, [msalInstance,history]);

  const login = async () => {
    try {
      const loginResponse = await instance.loginPopup({
                    scopes: ["User.Read"], // Permissão para ler o perfil do usuário
                });
      if (loginResponse) {
        const accessToken = loginResponse.accessToken; // Obtém o token
        console.log(loginResponse.account);
        const user_to_save = {
            name: loginResponse.account.name,
            email: loginResponse.account.username,
            token: accessToken,
        };
        setUser(user_to_save);
        // Salva os dados do usuário e o token no localStorage
        localStorage.setItem("user", JSON.stringify(user_to_save));
        sessionStorage.setItem("user", JSON.stringify(user_to_save));
        // Redireciona para a página após o login
        navigate("/intranet/homepage"); // Redireciona para a homepage após login
      }      
    } catch (error) {
      console.error(error);
    }
  };

  const logout = () => {
    // msalInstance.logout();
    setUser(null);
    sessionStorage.removeItem("user");
    localStorage.removeItem("user");
    navigate("/"); // Redireciona para a página de login
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acessar o contexto
export const useAuth = () => {
  return useContext(AuthContext);
};
