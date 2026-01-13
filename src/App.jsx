import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MsalProvider } from '@azure/msal-react';
import { msalInstance } from "./services/authConfig";
import { AuthProvider } from "./contexts/AuthContext";
import styled from 'styled-components'
import VacationsPage from "./pages/VacationsPage";
import EquipmentsPage from "./pages/EquipmentsPage";
import NotFoundPage from "./pages/NotFoundPage";
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
import PainelGestoresPage from "./pages/PainelGestoresPage";
import BeneficiosPage from "./pages/BeneficiosPage";
import FAQPage from "./pages/FAQPage";
import ParceriaEducacionalPage from "./pages/ParceriaEducacionalPage";
import VagasAbertasPage from "./pages/VagasAbertasPage";
import PlantoesTIPage from "./pages/PlantoesTIPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ComunicadosPage from "./pages/ComunicadosPage";
import CertificationsAdminPage from "./pages/CertificationsAdminPage";
import SignatureEmail2025Page from "./pages/SignatureEmail2025Page";
import HumorGestoresPage from "./pages/painel-gestores-pages/HumorGestoresPage";
import CriarVagaPage from "./pages/painel-gestores-pages/CriarVagaPage";
import ListaVagasPage from "./pages/painel-gestores-pages/ListaVagasPage";
import AprovarFeriasPage from "./pages/painel-gestores-pages/AprovarFeriasPage";
import FiltrarFeriasPage from "./pages/painel-gestores-pages/FiltrarFeriasPage";
import UsuariosAdminPage from "./pages/painel-admin-pages/UsuariosAdminPage";
import AprovarFeriasAdminPage from "./pages/painel-admin-pages/AprovarFeriasAdminPage";
import EscalasAdminPage from "./pages/painel-admin-pages/EscalasAdminPage";
import CriarFeriasLicAdminPage from "./pages/painel-admin-pages/CriarFeriasLicAdminPage";
import FiltrarFeriasAdminPage from "./pages/painel-admin-pages/FiltrarFeriasAdminPage";
import ProtectedRoute from "./components/ProtectedRoute";
import NovoComunicadoPage from "./pages/NovoComunicadoPage";
import FeedbackGestorPage from "./pages/painel-gestores-pages/FeedbackGestorPage";
import ListaFeedbackGestorPage from "./pages/painel-gestores-pages/ListaFeedbackGestorPage";
import OrganogramaPage from "./pages/OrganogramaPage";
import PortifolioPage from "./pages/PortfolioPage";
import PortfolioPage from "./pages/PortfolioPage";
import PowerBIProjetos from "./pages/PowerBIDashs";

function App() {

  return (
    <AppContainer>
      <MsalProvider instance={msalInstance}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/homepage" element={<HomePage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/sobre" element={<AboutUsPage />} />
                <Route path="/equipamentos" element={<EquipmentsPage />} />
                <Route path="/assinatura" element={<SignatureEmail2025Page />} />
                <Route path="/certificacoes" element={<CertificationsPage />} />
                <Route path="/certificacoes/admin" element={<CertificationsAdminPage />} />
                <Route path="/ferias" element={<VacationsPage />} />
                <Route path="/contatos" element={<ContactsPage />} />
                <Route path="/aniversarios" element={<AnniversaryPage />} />
                <Route path="/calendario" element={<CalendarPage />} />
                <Route path="/politicas" element={<PolicyPage />} />
                <Route path="/compliance" element={<CompliancePage />} />
                <Route path="/escala" element={<ScalePage />} />
                <Route path="/links" element={<FastLinksPage />} />
                <Route path="/fiquepordentro" element={<UpdatesPage />} />
                <Route path="/dashprojetos" element={<PowerBIProjetos />} />
                <Route path="/painelgestores" element={<PainelGestoresPage />} />
                <Route path="/faqs" element={<FAQPage />} />
                <Route path="/parceriaeducacional" element={<ParceriaEducacionalPage />} />
                <Route path="/beneficios" element={<BeneficiosPage />} />
                <Route path="/vagasemaberto" element={<VagasAbertasPage />} />
                <Route path="/plantoes" element={<PlantoesTIPage />} />
                <Route path="/comunicados" element={<ComunicadosPage />} />
                <Route path="/feedback/onboarding" element={<FeedbackGestorPage />} />
                <Route path="/feedback/onboarding/lista" element={<ListaFeedbackGestorPage />} />
                <Route path="/humorequipe" element={<HumorGestoresPage />} />
                <Route path="/criarvaga" element={<CriarVagaPage />} />
                <Route path="/listavagas" element={<ListaVagasPage />} />
                <Route path="/aprovarferias" element={<AprovarFeriasPage />} />
                <Route path="/filtrarferias" element={<FiltrarFeriasPage />} />
                <Route path="/usuariosadmin" element={<UsuariosAdminPage />} />
                <Route path="/aprovarferias/admin" element={<AprovarFeriasAdminPage />} />
                <Route path="/escalas/admin" element={<EscalasAdminPage />} />
                <Route path="/criarferias/admin" element={<CriarFeriasLicAdminPage />} />
                <Route path="/filtrarferias/admin" element={<FiltrarFeriasAdminPage />} />
                <Route path="/criarcomunicado" element={<NovoComunicadoPage />} />
                <Route path="/organograma" element={<OrganogramaPage />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
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
  // background-color: #F0F5F9;
  background-color: white;
  min-height: 100vh;
`