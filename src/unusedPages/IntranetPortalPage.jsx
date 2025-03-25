import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Logo from "../assets/LOGO-INTRANET-BRANCO.png";
import Fundo from "../assets/FUNDO-INTRANET.png"
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { IoIosArrowDropright } from "react-icons/io";

import PieChart from "../assets/PIE_CHART.png";
import InstagramPicturesComponent from "../components/InstagramPicturesComponent";
const IntranetPortalPage = () => {
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
                    <Link to={"/certificacoes"}>
                        <h1>Certificações</h1>
                    </Link>
                    <h1>RH</h1>
                </MenuContainer>
                <img src={Fundo} alt="OFFICE" />
                </RightContainer>
                
            </HeaderContainer>
            <ButtonsContainer>
                <div>
                    <Link to="/ferias">
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
            {/* <ActivitiesContainer>
                <h2>Atividades de Clientes</h2>
                <div className="UpContainer">
                    <img src={Plantoes} alt="Plantoes" />
                    <div className="ButtonsContainer">
                        <a href="https://accertetecnologia.atlassian.net/jira/servicedesk/projects/SUPORTE/summary">
                            <button>Lista Chamados JIRA</button>
                        </a>
                        <button>Lista Atividades/Período</button>
                        <button>Outros Recursos</button>
                    </div>
                </div>
                <div className="ChartsContainer">
                    <img src={PieChart} alt="Graficos" />
                    <img src={PieChart} alt="Graficos" />
                    <img src={PieChart} alt="Graficos" />
                </div>
            </ActivitiesContainer> */}
            <FooterContainer>
                <div className="left">
                    Accerte Tecnologia
                    www.accerte.com.br
                    <div className="icons">
                        <a href="https://www.instagram.com/accertetecnologia/">
                            <FaInstagram size={30} color="#E4405F"/>
                        </a>
                        <a href="https://www.linkedin.com/company/accerte-tecnologia/posts/?feedView=all">
                            <FaLinkedin  size={30} color="#0077B5"/>
                        </a>
                        <a href="https://wa.me/556239459510?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20os%20servi%C3%A7os%20de%20..." target="_blank">
                            <FaWhatsapp  size={30} color="#25D366"/>
                        </a>
                        <a href="mailto:comercial@accerte.com.br?subject=Gostaria%20de%20saber%20mais%20sobre%20os%20servi%C3%A7os&body=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20os%20servi%C3%A7os%20de%20...">
                            <FcGoogle size={30} />
                        </a>
                    </div>
                    
                </div>
                <div className="middle">
                    <img src={Logo} alt="ACCERTE" />
                </div>
                <div className="right">
                R. 128-A, Qd Nº 34 Qd 11
                St. Sul, Goiânia - GO
                74093-110
                </div>
            </FooterContainer>
        </Container>
    );
};

export default IntranetPortalPage;

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

const FooterContainer = styled.div`
    background-color: #a8a8a8;
    gap: 50px;
    justify-content: center;
    align-items: center;
    padding: 15px 0;
    line-height: 20px;
    color: white;
    .left{
        width: 500px;
        padding-left: 5%;
        flex-direction: column;
        text-align: center;
        gap: 10px;
        
        .icons{
            justify-content: center;
            gap: 15px;
        }
    }
    .middle{
        align-items: center;
        justify-content: center;
        img{
            width: 40%;
        }
    }

    .right{
        width: 500px;
        text-align: center;
        padding-right: 5%;
    }
`