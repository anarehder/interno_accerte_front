import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import HeaderGGComponent from "../components/HeaderGGComponent";
import UserComponent from "../components/UserComponent";

const AdminPage = () => {{
    const { dados, user, carregando, getData } = useAuth();
    const [activeButton, setActiveButton] = useState("");
    console.log(dados);
    // useEffect(() => {
    //     async function fetchData() {
    //         if (!user || !dados) {
    //             await getData();
    //         }
    //     }
    //     fetchData();
    // }, []);
    console.log(user);
    return (
        <Container>
            <HeaderGGComponent pageTitle={"RH  Painel Admin"} />
            <ButtonsContainer>
                <Button onClick={() => setActiveButton("User")} active={activeButton === "User" ? "show" : ""}>Usuários</Button>
                <Button onClick={() => setActiveButton("Ferias")} active={activeButton === "Ferias" ? "show" : ""}>Gerenciar Férias</Button>
                <Button onClick={() => setActiveButton("Escala")} active={activeButton === "Escala" ? "show" : ""}>Gerenciar Escalas</Button>
            </ButtonsContainer>

            {activeButton === "User" && !carregando && <UserComponent />}
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
    margin: 30px 0;
    gap: 50px;
`
  
const Button = styled.button`
    text-align: center;
    width: 150px;
    justify-content: center;
    font-weight: 700;
    background-color: ${({ active }) => (active  === 'show' ? "#ff5843" : "transparent")};
    color: ${({ active }) => (active === 'show' ? "white" : "#ff5843")};
    border: ${({ active }) => (active === 'show' ? "3px solid #ff5843" : "3px solid #ff5843")};
    &:hover {
        background-color: ${({ active }) => (active === 'show' ? "#ff5843" : "white")
    };
`;