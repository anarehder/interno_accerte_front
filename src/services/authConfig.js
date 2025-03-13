import { PublicClientApplication } from "@azure/msal-browser";

const redirectUri = import.meta.env.VITE_REDIRECT_URI;
    
export const msalConfig = {
    auth: {
      authority: import.meta.env.VITE_API_URL,
      clientId: import.meta.env.VITE_APP_CLIENT,
      redirectUri: window.location.origin,
    },
    cache: {
      cacheLocation: "sessionStorage",
      storeAuthStateInCookie: false,
    },
  };
  
export const msalInstance = new PublicClientApplication(msalConfig);
