import styled from 'styled-components';
import { useState } from 'react';
import CriarEmissorComponent from './CriarEmissorComponent';
import CriarNivelComponent from './CriarNivelComponent';
import CriarCertificacaoComponent from './CriarCertificacaoComponent';
import CriarVersaoCertComponent from './CriarVersaoCertComponent';

function CriarDadosCertificacaoComponent() {
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
                <Button onClick={() => handleClick("Emissor")}>Criar Emissor</Button>
                <Button onClick={() => handleClick("Nivel")}>Criar Nivel</Button>
                <Button onClick={() => handleClick("Certificacao")}>Criar Certificação</Button>
                <Button onClick={() => handleClick("Versao")}>Criar Versão</Button>
            </ButtonsContainer>
            {activeButton === "Emissor" && <CriarEmissorComponent />}
            {activeButton === "Nivel" && <CriarNivelComponent />}
            {activeButton === "Certificacao" && <CriarCertificacaoComponent/>}
            {activeButton === "Versao" && <CriarVersaoCertComponent /> }
        </PageContainer>
    )
}

export default CriarDadosCertificacaoComponent;

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