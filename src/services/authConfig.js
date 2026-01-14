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
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);
// Initialize MSAL instance
msalInstance.initialize();
export const loginRequest = {
  // scopes: ["User.Read", "User.Read.All"],
  scopes: ["User.Read", "Sites.Read.All", "Files.Read.All", "User.ReadBasic.All", "User.Read.All", "Sites.ReadWrite.All", "Files.ReadWrite.All"],
};
