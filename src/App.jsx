import { BrowserRouter, Routes, Route } from "react-router-dom";
import styled from 'styled-components'
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import EquipmentsPage from "./pages/EquipmentsPage";
import UserPortalPage from "./pages/UserPortalPage";
import SignatureEmailPage from "./pages/SignatureEmailPage";
import CertificationsPage from "./pages/CertificationsPage";
import VacationsPage from "./pages/VacationsPage";
import ChatReportsPage from "./pages/ChatReportsPage";
import HomeIntranetPage from "./pages/HomeIntranetPage";
import IntranetPortalPage from "./pages/IntranetPortalPage";
import IntranetCertificationsPage from "./pages/IntranetCertificationsPage";
import VacationsAdminPage from "./pages/VacationsAdminPage";
import { msalInstance } from "./services/authConfig";
// import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import IntranetHomePage from "./pages/IntranetHomePage";
// import { msalConfig } from "./services/authConfig";

// const pca = new PublicClientApplication(msalConfig);

function App() {

  return (
    <MsalProvider instance={msalInstance}>
      <AppContainer>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/portal" element={<UserPortalPage />} />
            <Route path="/equipamentos" element={<EquipmentsPage />} />
            <Route path="/assinatura" element={<SignatureEmailPage />} />
            <Route path="/certificacoes" element={<CertificationsPage />} />
            <Route path="/ferias" element={<VacationsPage />} />
            <Route path="/chat/relatorios" element={<ChatReportsPage />} />
            <Route path="/intranet" element={<HomeIntranetPage />} />
            <Route path="/intranet/portal" element={<IntranetPortalPage />} />
            <Route path="/intranet/certificacoes" element={<IntranetCertificationsPage />} />
            <Route path="/intranet/ferias" element={<VacationsPage />} />
            <Route path="/intranet/admin" element={<VacationsAdminPage />} />
            <Route path="/" element={<IntranetHomePage />} />
          </Routes>
        </BrowserRouter >
      </AppContainer >
    </MsalProvider>
  )
}

export default App

const AppContainer = styled.main`
  width: 100vw;
  background-color: #F0F5F9;
`