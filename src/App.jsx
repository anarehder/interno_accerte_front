import { BrowserRouter, Routes, Route } from "react-router-dom";
import styled from 'styled-components'
import HomePage from "./pages/HomePage";
import UserPortalPage from "./pages/EquipmentsPage";
import EquipmentsPage from "./pages/EquipmentsPage";
import LoginPage from "./pages/LoginPage";

function App() {

  return (
    <AppContainer>
      <BrowserRouter>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/portal" element={<UserPortalPage />} />
                <Route path="/equipamentos" element={<EquipmentsPage/>} />
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