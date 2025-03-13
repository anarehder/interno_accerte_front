import { PublicClientApplication } from "@azure/msal-browser";

const redirectUri = window.location.hostname === 'localhost' 
    ? 'http://localhost:5177/' // URI para desenvolvimento
    : 'https://green-island-0683d5710.6.azurestaticapps.net/'; // URI para produção
    
export const msalConfig = {
    auth: {
      authority: import.meta.env.VITE_API_URL,
      clientId: import.meta.env.VITE_APP_CLIENT,
      redirectUri: redirectUri,
    },
    cache: {
      cacheLocation: "sessionStorage",
      storeAuthStateInCookie: false,
    },
  };
  
  // export const loginRequest = {
  //   scopes: ["User.Read"],
  // };
  
  
export const msalInstance = new PublicClientApplication(msalConfig);
