import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Logo from "../assets/LOGO-INTRANET-BRANCO.png";
import Fundo from "../assets/FUNDO-INTRANET.png"
import InstagramPicturesComponent from "../components/InstagramPicturesComponent";
import FooterComponent from "../components/FooterComponent";

const IntranetHomePage = () => {
    return (
        <Container>
            <HeaderContainer>
                <LogoContainer>
                    <img src={Logo} alt="ACCERTE" />
                    <h1>Olá, João.</h1>
                    <h1>Seja bem-vindo!</h1>
                </LogoContainer>
                <RightContainer>
                <MenuContainer>
                    <h1>On-boarding</h1>
                    <a href="https://accerte.sharepoint.com/:f:/s/AccerteTecnologiadaInformaoLtda/EhU76OelhAxMmiqJub4B-V4Bi_3D6qndYbq3TRqbC-SyvA?e=5fh8LN" target="_blank">
                    <h1>Políticas</h1></a>
                    <Link to={"/intranet/certificacoes"}>
                        <h1>Certificações</h1>
                    </Link>
                    <h1>RH</h1>
                </MenuContainer>
                <img src={Fundo} alt="OFFICE" />
                </RightContainer>
                
            </HeaderContainer>
            <ButtonsContainer>
                <div>
                    <Link to="/intranet/ferias">
                        Férias
                    </Link>
                </div>
                <div>
                    <Link to="/assinatura">
                        Assinatura <br />E-mail
                    </Link>
                </div>
                <div>
                    Documentos
                </div>
                <div>
                    <a href="https://accerte.sharepoint.com/:x:/r/sites/AccerteTecnologiadaInformaoLtda/_layouts/15/Doc.aspx?sourcedoc=%7B0F0F31DB-FC4D-4C65-B742-0CA1F231BF3B%7D&file=Escala%20Semanal.xlsx&action=default&mobileredirect=true" target="_blank">
                    Escala Semanal
                    </a>
                </div>
                <div>
                    Planilhas
                </div>
                <div>
                    Documentos
                </div>
                <div>
                    Planilhas
                </div>
                <div>
                    Documentos
                </div>
                
            </ButtonsContainer>
            <InstagramPicturesComponent/>
            <FooterComponent />
        </Container>
    );
};

export default IntranetHomePage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: #D9D9D9;
  gap: 50px;
  font-family: 'Conthrax', sans-serif;
`;

const HeaderContainer = styled.div`
    width: 90%;
    height: 50vh;
`

const LogoContainer = styled.div`
    flex-direction: column;
    width: 30%;
    background-color: #343434;
    justify-content: center;
    align-items: center;
    h1{
        font-size: 35px;
        color: white;
        font-family: 'Conthrax', sans-serif;
    }
    img{
        margin-bottom: 100px;
        width: 60%;
    }
`

const RightContainer = styled.div`
  background-color: #D9D9D9;
  width: 70%;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  position: relative;
  img{
        width: 100%;
        position: absolute;
        bottom: 0;
    }
`;

const MenuContainer = styled.div`
    align-items: center;
    justify-content: space-around;
    z-index:2;
    background-color: #D9D9D9;
    h1{
        color: #434343;
        font-family: 'Conthrax', sans-serif;
        font-size: 25px;
        line-height: 35px;
    }
`;

const ButtonsContainer = styled.div`
    width: 90%;
    height: 30vh;
    font-size: 28px;
    color: white;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 5%;
    div{
        background-color: #20273E;
        width: 20%;
        height: 45%;
        border-radius: 30px;
        align-items: center;
        justify-content: center;
        text-align: center;
        a {
            height: 100%;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
`

const ActivitiesContainer = styled.div`
    width: 90%;
    flex-direction: column;
    margin-bottom: 20px;
    gap: 40px;
    h2 {
        display: flex;
        align-items: center;
        font-size: 24px;
        svg {
            margin-right: 10px;
        }
    }
    .UpContainer {
        align-items: center;
        justify-content: center;
        gap: 50px;
        img {
                width: 65%; 
            }
    }
    .ButtonsContainer {
        flex-direction: column;
        gap: 25px;
        width: 200px;
        button{
            height: 100px;
        }
    }

    .ChartsContainer {
        display: flex;
        gap: 25px;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
        img{
            width: 300px;
        }
    }
`