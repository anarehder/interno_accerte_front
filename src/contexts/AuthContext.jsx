// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import { msalInstance } from "../services/authConfig"; 
import { useNavigate  } from "react-router-dom";
import { useMsal } from "@azure/msal-react";

// Criando o contexto
const AuthContext = createContext();

// Provedor do contexto
export const AuthProvider = ({ children }) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState(storedUser || null);
  const navigate = useNavigate(); 
  const { instance, inProgress } = useMsal();

  useEffect(() => {
    const account = instance.getAllAccounts()[0];
    console.log(account);
    if (account) {
      const user_to_save = {
        name: account.name,
        email: account.username,
        token: account.idToken, // Pode ser undefined, então talvez precise do acquireTokenSilent()
      };
      setUser(user_to_save);
      localStorage.setItem("user", JSON.stringify(user_to_save));
      sessionStorage.setItem("user", JSON.stringify(user_to_save));
      navigate("/intranet/homepage");
    }
  }, [instance]);

  const login = async () => {
    const account = instance.getAllAccounts();
    if (account.length === 0 && inProgress === "none") {
      try {
        const request = { scopes: ["User.Read", "openid", "profile"] };
        const loginResponse = await msalInstance.loginPopup();
        await msalInstance.acquireTokenPopup(request);
        // const loginResponse = await instance.loginRedirect({
        //   scopes: ["User.Read"], // Permissão para ler o perfil do usuário
        // });
        if (loginResponse) {
          const accessToken = loginResponse.accessToken; // Obtém o token
          console.log(loginResponse);
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
        console.error("Erro no login:", error);
      }
    } else {
      console.log("algo deu errado ao tentar abrir o login");
    }
  };

  const logout = () => {
    instance.logoutPopup() // Alternativamente, use logoutRedirect()
      .then(() => {
        setUser(null);
        sessionStorage.removeItem("user");
        localStorage.removeItem("user");
        navigate("/"); // Redireciona para a página de login após logout
      })
      .catch((error) => console.error("Erro no logout:", error));
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
