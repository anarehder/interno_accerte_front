import React from "react";
import styled from "styled-components";
import Logo from "../assets/LOGO-INTRANET-BRANCO.png";
import Fundo from "../assets/FUNDO-INTRANET.png"
import { FaInstagram } from "react-icons/fa";
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
                    <h1>Políticas</h1>
                    <h1>Certificações</h1>
                    <h1>RH</h1>
                </MenuContainer>
                <img src={Fundo} alt="OFFICE" />
                </RightContainer>
                
            </HeaderContainer>
            <ButtonsContainer>
                <div>
                    Projetos Futuros
                </div>
                <div>
                    Planilhas
                </div>
                <div>
                    Documentos
                </div>
                <div>
                    Escala Semanal
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
                        <button>Lista Atividades/Período</button>
                        <button>Lista Chamados JIRA</button>
                    </div>
                </div>
                <div className="ChartsContainer">
                    <img src={PieChart} alt="Graficos" />
                    <img src={PieChart} alt="Graficos" />
                    <img src={PieChart} alt="Graficos" />
                </div>
            </ActivitiesContainer>
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
    height: 25vh;
    font-size: 28px;
    color: white;
    justify-content: center;
    gap: 5%;
    div{
        background-color: #20273E;
        border-radius: 30px;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 20px;
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
    gap: 20px;
    h2 {
        display: flex;
        align-items: center;
        font-size: 24px;
        svg {
            margin-right: 10px;
        }
    }

    .UpContainer {
        img {
            width: 75%; 
        }
    }
    .ButtonsContainer {
        flex-direction: column;
        gap: 25px;
        align-items: center;
        justify-content: center;
        button{
            height: 100px;
            width: 200px;
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