// import { PublicClientApplication } from "@azure/msal-browser";

// const redirectUri = import.meta.env.VITE_REDIRECT_URI;
    
// export const msalConfig = {
//     auth: {
//       authority: import.meta.env.VITE_API_URL,
//       clientId: import.meta.env.VITE_APP_CLIENT,
//       redirectUri: window.location.origin,
//     },
//     cache: {
//       cacheLocation: "sessionStorage",
//       storeAuthStateInCookie: true,
//     },
//     system: {
//         windowHashTimeout: 9000, // Applies just to popup calls - In milliseconds
//         iframeHashTimeout: 9000, // Applies just to silent calls - In milliseconds
//         loadFrameTimeout: 9000, // Applies to both silent and popup calls - In milliseconds
//     },
//   };
  
// export const msalInstance = new PublicClientApplication(msalConfig);
