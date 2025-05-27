import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import HeaderGGComponent from "../components/HeaderGGComponent";
import UserComponent from "../components/UserComponent";
import apiService from "../services/apiService";
import NewVacationComponent from "../components/NewVacationComponent";
import NewLicenseComponent from "../components/NewLicenseComponent";
import VacationsFilterComponent from "../components/VacationsFilterComponent";
import ScalePage from "./ScalePage";
import ScaleTableComponent from "../components/ScaleTableComponent";
import UsuariosAdminComponent from "../components/admin-components/UsuariosAdminComponent";
import FeriasAdminComponent from "../components/admin-components/FeriasAdminComponent";
import EscalasAdminComponent from "../components/admin-components/EscalasAdminComponent";

const AdminPage = () => {{
    const { dados, user, carregando, getData } = useAuth();
    const [activeButton, setActiveButton] = useState("");
    const [inicioSemana, setInicioSemana] = useState('');
    const [fimSemana, setFimSemana] = useState('');
    const [type, setType] = useState("");

    return (
        <Container>
            <HeaderGGComponent pageTitle={"RH  Painel Admin"} />
            <ButtonsContainer>
                <Button onClick={() => setActiveButton("Usuarios")} $active={activeButton === "User" ? "show" : ""}>Usuários</Button>
                <Button onClick={() => setActiveButton("Ferias")} $active={activeButton === "Filtrar" ? "show" : ""}>Férias</Button>
                <Button onClick={() => setActiveButton("Escalas")} $active={activeButton === "Escala" ? "show" : ""}>Escalas</Button>
            </ButtonsContainer>

            {activeButton === "Usuarios" && !carregando && <UsuariosAdminComponent />}
            {activeButton === "Ferias" && !carregando && <FeriasAdminComponent />}
            {activeButton === "Escalas" && !carregando && <EscalasAdminComponent />}
        </Container>
    );
  };
}

export default AdminPage;
  

const Container = styled.div`
    flex-direction: column;
    border-radius: 8px;
    align-items: center;
    
`;

const ButtonsContainer = styled.div`
    justify-content: center;
    flex-wrap: wrap;
    margin: 30px 0 40px 0;
    gap: 50px;
`
  
const Button = styled.button`
    text-align: center;
    width: 150px;
    justify-content: center;
    font-weight: 700;
    background-color: ${({ $active }) => ($active  === 'show' ? "#ff5843" : "transparent")};
    color: ${({ $active }) => ($active === 'show' ? "white" : "#ff5843")};
    border: ${({ $active }) => ($active === 'show' ? "3px solid #ff5843" : "3px solid #ff5843")};
    &:hover {
        background-color: ${({ active }) => (active === 'show' ? "#ff5843" : "white")
    };
`;

const EscalaContainer = styled.div`
    width: 750px;
    margin-top: 20px;
    justify-content: space-between;
    align-items: center;
    justify-content: center;
    gap: 30px;
    height: 100px;
    div{
        width: 40%;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
`