// src/services/graph.js
import { loginRequest } from "./authConfig";

export async function getUserProfile(instance, accounts) {
  if (accounts.length === 0) return null;

  try {
    const response = await instance.acquireTokenSilent({
      ...loginRequest,
      account: accounts[0],
    });

    const graphResponse = await fetch("https://graph.microsoft.com/v1.0/me", {
      headers: {
        Authorization: `Bearer ${response.accessToken}`,
      },
    });

    return await graphResponse.json();
  } catch (error) {
    console.error("Erro ao obter dados do usuário:", error);
    return null;
  }
}

export async function getUsersList(instance, accounts) {
  if (accounts.length === 0) return null;

  try {
    const response = await instance.acquireTokenSilent({
      ...loginRequest, // Certifique-se de que "loginRequest" inclui a permissão correta
      account: accounts[0],
    });

    const graphResponse = await fetch("https://graph.microsoft.com/v1.0/users", {
      headers: {
        Authorization: `Bearer ${response.accessToken}`,
      },
    });

    const data = await graphResponse.json();
    return data.value; // Retorna a lista de usuários
  } catch (error) {
    console.error("Erro ao obter lista de usuários:", error);
    return null;
  }
}