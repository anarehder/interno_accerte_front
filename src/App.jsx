import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import styled from 'styled-components'
import VacationsPage from "./pages/VacationsPage";
import IntranetCertificationsPage from "./pages/IntranetCertificationsPage";
import VacationsAdminPage from "./pages/VacationsAdminPage";
import IntranetHomePage from "./pages/IntranetHomePage";
import IntranetLoginPage from "./pages/IntranetLoginPage";
import EquipmentsPage from "./pages/EquipmentsPage";

function App() {
  const [graphData, setGraphData] = useState(null);
  return (
    <AppContainer>
      <BrowserRouter>
        <Routes>
          <Route path="/intranet/equipamentos" element={<EquipmentsPage />} />
          <Route path="/intranet/assinatura" element={<SignatureEmailPage />} />
          <Route path="/intranet/certificacoes" element={<IntranetCertificationsPage />} />
          <Route path="/intranet/ferias" element={<VacationsPage />} />
          <Route path="/intranet/admin" element={<VacationsAdminPage />} />
          <Route path="/intranet/homepage" element={<IntranetHomePage graphData={graphData} setGraphData={setGraphData}/>} />
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