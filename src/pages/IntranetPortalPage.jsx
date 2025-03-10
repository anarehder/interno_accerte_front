import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Logo from "../assets/LOGO-INTRANET-BRANCO.png";
import Fundo from "../assets/FUNDO-INTRANET.png"
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { IoIosArrowDropright } from "react-icons/io";
import Insta1 from "../assets/INSTA1.png";
import Insta2 from "../assets/INSTA2.png";
import Insta3 from "../assets/INSTA3.png";
import Insta4 from "../assets/INSTA4.png";
import Insta5 from "../assets/INSTA5.png";
import Plantoes from "../assets/PLANTOES.png";
import PieChart from "../assets/PIE_CHART.png";
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
                    <a href="https://accerte.sharepoint.com/:f:/s/AccerteTecnologiadaInformaoLtda/EhU76OelhAxMmiqJub4B-V4Bi_3D6qndYbq3TRqbC-SyvA?e=5fh8LN">
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
                    Planilhas
                </div>
                <div>
                    Documentos
                </div>
                <div>
                    <a href="https://accerte.sharepoint.com/:f:/s/AccerteTecnologiadaInformaoLtda/Eh2piwnGCA5OiYOVQcqm10MBgmBgSkf4PoPn1d-YVttfgg?e=klSNyR">
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
            <InstagramContainer>
                <h2>
                    <FaInstagram size={24} /> Acompanhe no Instagram...
                </h2>
                <div className="carousel">
                    <div className="card">
                        <img src={Insta1} alt="Governança de Dados e IA" />
                    </div>
                    <div className="card">
                        <img src={Insta2} alt="FinOps" />
                    </div>
                    <div className="card">
                        <img src={Insta3} alt="Segurança e Conformidade" />
                    </div>
                    <div className="card">
                        <img src={Insta4} alt="Operação em Nuvem" />
                        {/* <div className="content">
                            <h3>Operação em Nuvem (CloudOps)</h3>
                            <p>Infraestrutura ágil e escalável para seu negócio.</p>
                        </div> */}
                    </div>
                    <div className="card">
                        <img src={Insta5} alt="Custos" />
                    </div>
                    <div className="card">
                        <img src={Insta5} alt="Custos" />
                    </div>
                    <div className="card">
                        <img src={Insta5} alt="Custos" />
                    </div>
                    <div className="card">
                        <img src={Insta3} alt="Segurança e Conformidade" />
                    </div>
                </div>
                {/* <IoIosArrowDropright size={54}/> */}
            </InstagramContainer>
            <ActivitiesContainer>
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
            </ActivitiesContainer>
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

const InstagramContainer = styled.div`
    font-family: 'Conthrax', sans-serif;
    padding: 20px;
    width: 90%;
    flex-direction: column;
    h2 {
        display: flex;
        align-items: center;
        font-size: 24px;
        margin-bottom: 20px;
        svg {
            margin-right: 10px;
        }
    }

    .carousel {
        display: flex;
        gap: 25px;
        overflow-x: auto; /* Ativa o scroll horizontal */
        overflow-y: hidden; /* Evita scroll vertical */
        height: 280px;
        align-items: center;
    }
        /* Para navegadores baseados em WebKit (Chrome, Safari, Edge) */
    .carousel::-webkit-scrollbar {
        height: 6px; /* Altura da barra de rolagem */
    }

    .carousel::-webkit-scrollbar-track {
        background: transparent; /* Fundo da barra */
    }

    .carousel::-webkit-scrollbar-thumb {
        background: gray; /* Cor da barra de rolagem */
        border-radius: 10px; /* Bordas arredondadas */
    }

    .carousel::-webkit-scrollbar-thumb:hover {
        background: darkgray; /* Cor ao passar o mouse */
    }

  .card {
    flex: 0 0 250px;
    background: white;
    border-radius: 35px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease-in-out;
    height: 250px;

    &:hover {
      transform: scale(1.05);
      border-radius: 35px;
    }

    img {
      width: 100%;
      height: 250px;
      object-fit: cover;
    }

    .content {
      padding: 15px;
      text-align: center;
      
      h3 {
        font-size: 18px;
        color: #222;
        margin-bottom: 10px;
      }

      p {
        font-size: 14px;
        color: #555;
      }
    }
  }
`;

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