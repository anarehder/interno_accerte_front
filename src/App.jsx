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
import ContactsPage from "./pages/ContactsPage";

function App() {

  return (
    <AppContainer>
      <MsalProvider instance={msalInstance}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<IntranetLoginPage />} />
              <Route path="/homepage" element={<IntranetHomePage />} />
              <Route path="/equipamentos" element={<EquipmentsPage />} />
              <Route path="/assinatura" element={<SignatureEmailPage />} />
              <Route path="/certificacoes" element={<IntranetCertificationsPage />} />
              <Route path="/ferias" element={<VacationsPage />} />
              <Route path="/admin" element={<VacationsAdminPage />} />
              <Route path="/contatos" element={<ContactsPage />} />
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
  overflow: hidden;
  background-color: #F0F5F9;
`