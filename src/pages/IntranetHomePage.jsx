import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Logo from "../assets/LOGO-INTRANET.png";
import LogoPequena from "../assets/LOGO_PNG.png"
import { FiSearch } from "react-icons/fi";
import InstagramPicturesComponent from "../components/InstagramPicturesComponent";
import FooterComponent from "../components/FooterComponent";
import BannerSlideComponent from "../components/BannerSlideComponent";
import { useNavigate  } from "react-router-dom";
import { FiLogOut } from "react-icons/fi"; 
import { useAuth } from "../contexts/AuthContext";
import { useIsAuthenticated } from '@azure/msal-react';
import { useMsal } from "@azure/msal-react";
import LinkedinPostsComponent from "../components/LinkedinPostsComponent";
import BannerTopo from "../assets/INTRANET_BANNER.png"

const IntranetHomePage = () => {
    const { user, getData } = useAuth();
    const { instance } = useMsal();
    const navigate = useNavigate();
    const [searchBar, setSearchBar] = useState("");
    console.log(user);
    const isAuthenticated = useIsAuthenticated();
    
    useEffect(() => {
            getData();
          if (!isAuthenticated) {
            navigate("/");
          }
        }, [isAuthenticated, navigate]);

    const handleSearch = (e) => {
        setSearchBar(e.target.value);
    };
    
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        alert(`Buscando por: ${searchBar}`);
        setSearchBar("");
    };

    const handleLogout = () => {
        instance.logoutPopup({
            postLogoutRedirectUri: "/",
            mainWindowRedirectUri: "/"
        });
    }
  
    return (
        <Container>
            <LogoutButton onClick={handleLogout}>
                <FiLogOut size={20}/>
            </LogoutButton>
            <HeaderContainer>
                <div>
                    <h1>Olá, <span> {user.givenName} </span>
                        <br /> Seja Bem-Vindo(a)!
                    </h1>
                </div>
            </HeaderContainer>
            <MenuContainer>
                    <div> <h1>SOBRE <span> NÓS</span></h1></div>
                    <div> <h1>PARA <span> SUA INFORMAÇÃO</span></h1></div>
                    <div> <h1><span> AGENDA </span></h1></div>
                    <div> <h1>LINKS <span> RÁPIDOS</span></h1></div>
                    <div> <h1>GENTE <span> E GESTÃO</span></h1></div>
                    <div> <h1>COMPLIANCE</h1></div>
                    <div> <a href="https://accertetecnologia.atlassian.net/servicedesk/customer/portals" target="blank">
                        <h1>JIRA</h1></a></div>
                    <div> <Link to="/intranet/assinatura"><h1>ASSINATURA <br /> <span> DE E-MAIL</span></h1></Link></div>
                    <form onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        placeholder="Busque por pessoas"
                        value={searchBar}
                        onChange={handleSearch}
                    />
                    <button type="submit"><FiSearch size={25} /></button>
                    </form>
                </MenuContainer>
            <BannerContainer>
                <BannerSlideComponent />
            </BannerContainer>
            <ButtonsContainer>
                <div>
                <Link to={"/intranet/certificacoes"}> CERTIFICAÇÕES</Link>
                </div>
                <div>
                <a href="https://accerte.sharepoint.com/:f:/s/AccerteTecnologiadaInformaoLtda/EhU76OelhAxMmiqJub4B-V4Bi_3D6qndYbq3TRqbC-SyvA?e=5fh8LN" target="_blank">POLÍTICAS </a>
                </div>
                <div>
                    <a href="https://accerte.sharepoint.com/:f:/s/AccerteTecnologiadaInformaoLtda/ElJz5fHRZnZLtQKGIgm4FGoBP_6DfkYLbh62iK5sdJF5YA?e=UINlKh"target="_blank">
                    ESCRITORIO <br /> DE PROCESSOS
                    </a>
                </div>
                <div>
                    MARKETING
                </div>                
            </ButtonsContainer>
            <InstagramPicturesComponent/>
            {/* <LinkedinPostsComponent /> */}
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
    position: relative;
    font-family: "Poppins", serif;
    h1 {
        font-weight: 400;
        font-size: 15px;
        font-family: "Poppins", serif;
    }
    span{
        font-weight: 700;
    }
//   font-family: 'Conthrax', sans-serif;
`;

const LogoutButton = styled.button`
    position: absolute;
    top: 25px;
    right: 15px;
    font-size: 10px;
`

const HeaderContainer = styled.div`
    background-color: #434343;
    height: 200px;
    background: url(${BannerTopo}) no-repeat right center;
    background-size: cover;
    color: #067DD1;
    overflow: hidden;
    div{
        width: 50%;
        background-color: white;
        border-bottom-right-radius: 80px;
        box-shadow: 12px -21px 3px 5px rgba(0, 0, 0, 0.2);
        justify-content: center;
        align-items: center;
        h1 {
            width: 80%;
            text-align: left;
            line-height: 50px;
            font-size: 36px;
            // background-color: red;
        }
    }
`

const MenuContainer = styled.div`
    width: 90%;
    background-color: #067DD1;
    align-items: center;
    justify-content: center;
    color: white;
    gap: 20px;
    div {
        // line-height: 50px;
        justify-content: center;
        text-align: center;
        width: fit-content;
        margin: 5px;
    }
    form {
        width: 20%;
        margin-left: 30px;
        height: 40px;
        display: flex;
        background-color: white;
        border-radius: 10px;
        input {
            width: 80%;
            color: white;
            font-size: 15px;
            border-right: 2px solid #067DD1;
            &::placeholder {
                color: white;
                opacity: 0.7;               
            }
        }
        button {
            width:15%;
            background-color: transparent;
            color: #067DD1;
            padding: 0;
            margin-left: 5px;
            border: none;
        }
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
    justify-content: center;
    margin: 30px 0;
`

const ButtonsContainer = styled.div`
    font-size: 22px;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 30px;
    margin-bottom: 20px;
    color: white;
    div{
        background-color: #1c8ad9;
        width: 20%;
        height: 100px;
        border-radius: 15px;
        align-items: center;
        justify-content: center;
        text-align: center;
        box-shadow: 2px -2px 3px 5px rgba(0, 0, 0, 0.2);
        a {
            height: 100%;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
`