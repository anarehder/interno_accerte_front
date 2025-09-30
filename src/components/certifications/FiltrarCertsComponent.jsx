import styled from 'styled-components';
import { useState } from 'react';
import ListarCertsAdminComponent from './ListarCertsAdminComponent';
import ListarFuncCertsAdminComponent from './ListasFuncCertsAdminComponent';
import ListaBonificacoesComponent from './ListaBonificacaoesComponent';

function FiltrarCertsComponent() {
    const [activeButton, setActiveButton] = useState("");

    const handleClick = (label) => {
      if (activeButton === label){
        setActiveButton("");
      } else{
        setActiveButton(label);
      }
    };

    return (
        <PageContainer>
            <ButtonsContainer>
                <Button onClick={() => handleClick("Certificacoes")}>Lista Certificações</Button>
                <Button onClick={() => handleClick("Funcionarios")}>Lista Funcionarios</Button>
                <Button onClick={() => handleClick("Bonificacoes")}>Lista Bonificações</Button>
            </ButtonsContainer>
            {activeButton === "Certificacoes" && <ListarCertsAdminComponent />}
            {activeButton === "Funcionarios" && <ListarFuncCertsAdminComponent />}
            {activeButton === "Bonificacoes" && <ListaBonificacoesComponent />}
        </PageContainer>
    )
}

export default FiltrarCertsComponent;

const PageContainer = styled.div`
    width: 100%;
    height: 100%;
    min-height: 100vh;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    color: rgb(75, 74, 75);
`

const Button = styled.button`
    height: 65px;
    width: 240px;
    justify-content: center;
    border: none;
    margin: 10px 0;
    border-radius: 10px;
    cursor: pointer;
    color: white;
    box-shadow: 0px 4px 4px 0px #00000040;
    background: linear-gradient(to right,#205fdd, #001143);
`;

const ButtonsContainer = styled.div`
    width: 80%;
    gap: 15px;
    margin: 0 auto;
    align-items: center;
    justify-content: center;
`