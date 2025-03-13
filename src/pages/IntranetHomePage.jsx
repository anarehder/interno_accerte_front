import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Logo from "../assets/LOGO-INTRANET.png";
import LogoPequena from "../assets/LOGO_PNG.png"
import { FiSearch } from "react-icons/fi";
import InstagramPicturesComponent from "../components/InstagramPicturesComponent";
import FooterComponent from "../components/FooterComponent";

const IntranetHomePage = () => {
    const [searchBar, setSearchBar] = useState("");
    const handleSearch = (e) => {
        setSearchBar(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        alert(`Buscando por: ${searchBar}`);
        setSearchBar("");
    };
    
    return (
        <Container>
            <HeaderContainer>
                <MenuContainer>
                    <div>Fale <br /> Conosco</div>
                    <div>Canal Denúncias (Compliance)</div>
                    <div>Abertura Chamados (JIRA)</div>
                    <div><Link to="/assinatura">Assinatura <br /> de E-mail </Link></div>
                    <form onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        placeholder="Busque por pessoas"
                        value={searchBar}
                        onChange={handleSearch}
                    />
                    <button type="submit"><FiSearch size={25} /></button>
                    </form>
                    <img src={LogoPequena} alt="ACCERTE" />
                </MenuContainer>
            </HeaderContainer>
            <LogoContainer>
            <img src={Logo} alt="ACCERTE" />
            <h1>INTRANET</h1>
            </LogoContainer>
            
            <MenuContainer>
                    <h1>On-boarding</h1>
                    <a href="https://accerte.sharepoint.com/:f:/s/AccerteTecnologiadaInformaoLtda/EhU76OelhAxMmiqJub4B-V4Bi_3D6qndYbq3TRqbC-SyvA?e=5fh8LN" target="_blank">
                    <h1>Políticas</h1></a>
                    <Link to={"/intranet/certificacoes"}>
                        <h1>Certificações</h1>
                    </Link>
                    <h1>RH</h1>
                </MenuContainer>
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
  gap: 10px;
  font-family: 'Conthrax', sans-serif;
  h1 {
    font-family: 'Conthrax', sans-serif;
  }
`;

const HeaderContainer = styled.div`
    height: 10 0px;
    background-color: #434343;
    color: white;
    padding: 15px 10px 5px 10px;
    justify-content: center;
    
`

const MenuContainer = styled.div`
    width: 90%;
    margin-top: 20px;
    align-items: flex-start;
    justify-content: space-around;
    font-family: 'Conthrax', sans-serif;
    div {
        width: 15%;
        height: 50px;
        justify-content: center;
        text-align: center;
    }
    form {
        width: 20%;
        display: flex;
        input {
            width: 80%;
            color: white;
            font-family: 'Conthrax', sans-serif;
            font-size: 15px;
            &::placeholder {
                color: white;
                opacity: 0.7;               
            }
        }
        button {
            width:15%;
            background-color: transparent;
            padding: 0;
            border: none;
        }
    }
    img {
        width: 50px;
    }
`;

const LogoContainer = styled.div`
    width: 90%;
    text-align: center;
    position: relative;
    align-items: center;
    justify-content: center;
    img {
        width: 12%;
        left: 5%;
        z-index: 2;
        position: absolute;
    }
`

const BannerContainer = styled.div`
    background-color: red;
`

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