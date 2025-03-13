import { PublicClientApplication } from "@azure/msal-browser";

const isLocal = window.location.hostname.includes("localhost");
const redirectUri = isLocal 
  ? "http://localhost:5177/" 
  : `https://green-island-0683d5710.6.azurestaticapps.net/`;
    
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
  
export const msalInstance = new PublicClientApplication(msalConfig);
