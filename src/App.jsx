import { BrowserRouter, Routes, Route } from "react-router-dom";
import styled from 'styled-components'
import VacationsPage from "./pages/VacationsPage";
import IntranetPortalPage from "./pages/IntranetPortalPage";
import IntranetCertificationsPage from "./pages/IntranetCertificationsPage";
import VacationsAdminPage from "./pages/VacationsAdminPage";
import IntranetHomePage from "./pages/IntranetHomePage";
import IntranetLoginPage from "./pages/IntranetLoginPage";

function App() {

  return (
    <AppContainer>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/login" element={<LoginPage />} />
          <Route path="/portal" element={<UserPortalPage />} />
          <Route path="/equipamentos" element={<EquipmentsPage />} />
          <Route path="/assinatura" element={<SignatureEmailPage />} />
          <Route path="/certificacoes" element={<CertificationsPage />} />
          <Route path="/ferias" element={<VacationsPage />} />
          <Route path="/chat/relatorios" element={<ChatReportsPage />} /> */}
          {/* <Route path="/intranet" element={<HomeIntranetPage />} /> */}
          <Route path="/intranet/portal" element={<IntranetPortalPage />} />
          <Route path="/intranet/certificacoes" element={<IntranetCertificationsPage />} />
          <Route path="/intranet/ferias" element={<VacationsPage />} />
          <Route path="/intranet/admin" element={<VacationsAdminPage />} />
          <Route path="/intranet/homepage" element={<IntranetHomePage />} />
          <Route path="/" element={<IntranetLoginPage />} />
        </Routes>
      </BrowserRouter >
    </AppContainer >
  )
}

export default App

const AppContainer = styled.main`
  width: 100vw;
  background-color: #F0F5F9;
`