import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MsalProvider } from '@azure/msal-react';
import styled from 'styled-components'
import VacationsPage from "./pages/VacationsPage";
import IntranetCertificationsPage from "./pages/IntranetCertificationsPage";
import VacationsAdminPage from "./pages/VacationsAdminPage";
import IntranetHomePage from "./pages/IntranetHomePage";
import IntranetLoginPage from "./pages/IntranetLoginPage";
import EquipmentsPage from "./pages/EquipmentsPage";
import SignatureEmailPage from "./pages/SignatureEmailPage";
import NotFoundPage from "./pages/NotFoundPage";
import { msalInstance } from "./services/authConfig";
import { AuthProvider } from "./contexts/AuthContext";

function App() {

  return (
    <AppContainer>
      <MsalProvider instance={msalInstance}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<IntranetLoginPage />} />
              <Route path="/intranet/homepage" element={<IntranetHomePage />} />
              <Route path="/intranet/equipamentos" element={<EquipmentsPage />} />
              <Route path="/intranet/assinatura" element={<SignatureEmailPage />} />
              <Route path="/intranet/certificacoes" element={<IntranetCertificationsPage />} />
              <Route path="/intranet/ferias" element={<VacationsPage />} />
              <Route path="/intranet/admin" element={<VacationsAdminPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter >
        </AuthProvider>
      </MsalProvider>
    </AppContainer >
  )
}

export default App

const AppContainer = styled.main`
  width: 100vw;
  background-color: #F0F5F9;
`