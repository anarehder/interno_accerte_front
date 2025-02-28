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

function App() {

  return (
    <AppContainer>
      <BrowserRouter>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/portal" element={<UserPortalPage />} />
                <Route path="/equipamentos" element={<EquipmentsPage/>} />
                <Route path="/assinatura" element={<SignatureEmailPage/>} />
                <Route path="/certificacoes" element={<CertificationsPage/>} />
                <Route path="/ferias" element={<VacationsPage/>} />
                <Route path="/chat/relatorios" element={<ChatReportsPage />} />
                <Route path="/intranet" element={<HomeIntranetPage />} />
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