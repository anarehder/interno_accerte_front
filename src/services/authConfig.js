import { PublicClientApplication } from "@azure/msal-browser";

export const msalConfig = {
    auth: {
      authority: import.meta.env.VITE_API_URL,
      clientId: import.meta.env.VITE_APP_CLIENT,
      redirectUri: "http://localhost:5177",
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
