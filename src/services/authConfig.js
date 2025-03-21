// src/services/authConfig.js
import { PublicClientApplication } from "@azure/msal-browser";

const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_APP_CLIENT,
    authority: import.meta.env.VITE_API_URL,
    redirectUri: window.location.origin,
    postLogoutRedirectUri: '/', // Indicates the page to navigate after logout.
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);

export const loginRequest = {
  scopes: ["User.Read"],
};
