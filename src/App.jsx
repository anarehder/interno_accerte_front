import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MsalProvider } from '@azure/msal-react';
import styled from 'styled-components'
import VacationsPage from "./pages/VacationsPage";
import VacationsAdminPage from "./pages/VacationsAdminPage";
import IntranetHomePage from "./pages/IntranetHomePage";
import IntranetLoginPage from "./pages/IntranetLoginPage";
import EquipmentsPage from "./pages/EquipmentsPage";
import SignatureEmailPage from "./pages/SignatureEmailPage";
import NotFoundPage from "./pages/NotFoundPage";
import { msalInstance } from "./services/authConfig";
import { AuthProvider } from "./contexts/AuthContext";
import ContactsPage from "./pages/ContactsPage";
import AnniversaryPage from "./pages/AnniversaryPage";
import CalendarPage from "./pages/CalendarPage";
import PolicyPage from "./pages/PolicyPage";
import CertificationsPage from "./pages/CertificationsPage";
import CompliancePage from "./pages/CompliancePage";
import FastLinksPage from "./pages/FastLinksPage";

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
              <Route path="/certificacoes" element={<CertificationsPage />} />
              <Route path="/ferias" element={<VacationsPage />} />
              <Route path="/ferias/admin" element={<VacationsAdminPage />} />
              <Route path="/contatos" element={<ContactsPage />} />
              <Route path="/aniversarios" element={<AnniversaryPage />} />
              <Route path="/calendario" element={<CalendarPage />} />
              <Route path="/politicas" element={<PolicyPage />} />
              <Route path="/compliance" element={<CompliancePage />} />
              <Route path="/links" element={<FastLinksPage />} />
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