import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Logo from "../assets/LOGO-INTRANET.png";
import LogoPequena from "../assets/LOGO_PNG.png"
import { FiSearch } from "react-icons/fi";
import InstagramPicturesComponent from "../components/InstagramPicturesComponent";
import FooterComponent from "../components/FooterComponent";
import BannerSlideComponent from "../components/BannerSlideComponent";

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
                    <div><a href="https://accertetecnologia.atlassian.net/servicedesk/customer/portals" target="blank">Abertura Chamados (JIRA)</a></div>
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
                <div>Sobre Nós</div>
                <div>Para Sua Informação</div>
                <div>Agenda</div>
                <div>Links Rápidos</div>
                <div>Gente e Gestão</div>
            </MenuContainer>
            <BannerContainer>
                <BannerSlideComponent />
                <h1> Saiba mais ...  </h1>
            </BannerContainer>
            <ButtonsContainer>
                <div>
                <Link to={"/intranet/certificacoes"}> Certificações</Link>
                </div>
                <div>
                <a href="https://accerte.sharepoint.com/:f:/s/AccerteTecnologiadaInformaoLtda/EhU76OelhAxMmiqJub4B-V4Bi_3D6qndYbq3TRqbC-SyvA?e=5fh8LN" target="_blank">Políticas </a>
                </div>
                <div>
                    <a href="https://accerte.sharepoint.com/:f:/s/AccerteTecnologiadaInformaoLtda/ElJz5fHRZnZLtQKGIgm4FGoBP_6DfkYLbh62iK5sdJF5YA?e=UINlKh"target="_blank">
                    Escritório <br /> de Processos
                    </a>
                </div>
                <div>
                    <a href="https://accerte.sharepoint.com/:f:/s/AccerteTecnologiadaInformaoLtda/EotPeOrtrE5Phg-nuwjIersBtwAaVDWLJK4Vt-5eMjhr1A?e=EsVg27" target="_blank">Compliance <br /> (Código de ética <br/> e Conduta)</a>
                </div>
                <div>
                    Pesquisa <br /> e Inovação
                </div>
                <div>
                    Marketing
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
  gap: 20px;
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
    height: 90px;
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
    width: 90%;
    gap: 50px;
    margin-top: 10px;
`

const ButtonsContainer = styled.div`
    width: 90%;
    font-size: 22px;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;
    div{
        background-color:;
        width: 25%;
        height: 100px;
        border-radius: 30px;
        align-items: center;
        justify-content: center;
        text-align: center;
        border: 3px solid  #20273E;
        a {
            height: 100%;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
`