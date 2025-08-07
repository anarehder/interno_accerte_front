import styled from 'styled-components';
import { useState } from 'react';
import HeaderNewComponent from '../components/basic/HeaderNewComponent';
import CriarDadosCertificacaoComponent from '../components/certifications/CriarDadosCertificacaoComponent';
import CriarFunCertComponent from '../components/certifications/CriarFunCertComponent';

function CertificationsAdminPage() {
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
            <HeaderNewComponent pageTitle={"Certificações - Administrador"}/>
            <ButtonsContainer>
                <Button onClick={() => handleClick("Dados")}>Criar Dados de Certificação</Button>
                <Button onClick={() => handleClick("NovoCert")}>Inserir Certificado Funcionário</Button>
                <Button onClick={() => handleClick("Filtrar")}>Filtrar Certificado Funcionário</Button>
            </ButtonsContainer>
            {activeButton === "Dados" && <CriarDadosCertificacaoComponent />}
            {activeButton === "NovoCert" && <CriarFunCertComponent handleClick={handleClick}/>}
            {activeButton === "Filtrar" && <h1>Filtrar</h1>}
        </PageContainer>
    )
}

export default CertificationsAdminPage;

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