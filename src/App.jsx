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
import ScalePage from "./pages/ScalePage";
import AboutUsPage from "./pages/AboutUsPage";
import AdminPage from "./pages/AdminPage";
import UpdatesPage from "./pages/UpdatesPage";
import PowerBIDashs from "./pages/PowerBIDashs";
import PainelGestoresPage from "./pages/PainelGestoresPage";

function App() {

  return (
    <AppContainer>
      <MsalProvider instance={msalInstance}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<IntranetLoginPage />} />
              <Route path="/homepage" element={<IntranetHomePage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/sobre" element={<AboutUsPage />} /> 
              <Route path="/equipamentos" element={<EquipmentsPage />} />
              <Route path="/assinatura" element={<SignatureEmailPage />} />
              <Route path="/certificacoes" element={<CertificationsPage />} />
              <Route path="/ferias" element={<VacationsPage />} />
              <Route path="/contatos" element={<ContactsPage />} />
              <Route path="/aniversarios" element={<AnniversaryPage />} />
              <Route path="/calendario" element={<CalendarPage />} />
              <Route path="/politicas" element={<PolicyPage />} />
              <Route path="/compliance" element={<CompliancePage />} />
              <Route path="/escala" element={<ScalePage />} />
              <Route path="/links" element={<FastLinksPage />} />
              <Route path="/fiquepordentro" element={<UpdatesPage/>}/>
              <Route path="/gestaoavista" element={<PowerBIDashs />} />
              <Route path="/painelgestores" element={<PainelGestoresPage />} />
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
  min-height: 100vh;
`