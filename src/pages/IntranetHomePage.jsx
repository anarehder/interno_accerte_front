import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import FooterComponent from "../components/FooterComponent";
import BannerSlideComponent from "../components/BannerSlideComponent";
import { useNavigate  } from "react-router-dom";
import { FiLogOut } from "react-icons/fi"; 
import { useAuth } from "../contexts/AuthContext";
import { useIsAuthenticated } from '@azure/msal-react';
import { useMsal } from "@azure/msal-react";
import LinkedinPostsComponent from "../components/LinkedinPostsComponent";
import HeaderComponent from "../components/HeaderComponent";
import BirthdayPopUpComponent from "../components/BirthdayPopUpComponent";
import ContactsComponent from "../components/ContactsComponent";

const IntranetHomePage = () => {
    const { user, dados, getData } = useAuth();
    const { instance } = useMsal();
    const navigate = useNavigate();
    const [searchBar, setSearchBar] = useState("");
    const isAuthenticated = useIsAuthenticated();
    const [filteredContacts, setFilteredContacts] = useState([]);

    useEffect(() => {
        async function fetchData() {
            if (!user || !dados) {
                await getData();
            }
            if (!isAuthenticated) {
                navigate("/");
            }
        }
    
        fetchData();
    }, [isAuthenticated, navigate]);

    const handleSearch = (e) => {
        setSearchBar(e.target.value);
    };
    function removeAcentos(text) {
        return text.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const filtered = dados.agenda.filter(contato =>
            removeAcentos(contato.name.toLowerCase())
            .includes(searchBar.toLowerCase())
        );
        setFilteredContacts(filtered);
        if (filtered.length === 0){
            alert("Nenhum resultado encontrado.")
            setSearchBar("");
        }
    };

    const clearSearch = () => {
        setFilteredContacts([]);
        setSearchBar("");
    };

    // console.log(filteredContacts);
    const handleLogout = () => {
        instance.logoutPopup({
            postLogoutRedirectUri: "/",
            mainWindowRedirectUri: "/"
        });
        sessionStorage.removeItem("posts");
        sessionStorage.removeItem("sharePoint");
        sessionStorage.removeItem("userMSAL");
    }
  
    return (
        <Container>
            {!user ? <h1> Carregando dados...</h1> :
                <>
                    <LogoutButton onClick={handleLogout}>
                        <FiLogOut size={20} />
                    </LogoutButton>
                    <HeaderComponent pageTitle={user?.givenName} type={"homepage"} />
                    <MenuContainer>
                        <div><Link to={"/sobre"}> <h1>SOBRE <span> NÓS</span></h1></Link></div>
                        <MenuItem>
                            <div> <h1>GENTE <span> E GESTÃO </span></h1></div>
                            <Dropdown>
                                <DropdownItem><Link to={"/aniversarios"}>Aniversários</Link></DropdownItem>
                                <DropdownItem><Link to={"/ferias"}>Férias | Pausas</Link></DropdownItem>
                                <DropdownItem><Link to={"/escala"}>Escala Semanal</Link></DropdownItem>
                                <DropdownItem><Link to={"/calendario"}>Calendário Accerte</Link></DropdownItem>
                            </Dropdown>
                        </MenuItem>
                        <div> <Link to="/contatos"><h1><span> AGENDA </span></h1></Link></div>
                        <div> <Link to="/links"><h1>LINKS <span> RÁPIDOS</span></h1></Link></div>
                        <div> <Link to="/fiquepordentro"><h1>FIQUE <span>POR DENTRO </span> </h1></Link></div>
                        <div> <a href="mailto:atendimento@accerte.com.br?subject=Chamado%20Interno&body=Gostaria%20de%20solicitar%20..." target="blank">
                            <h1>JIRA</h1></a></div>
                        <div> <Link to="/assinatura"><h1>ASSINATURA <br /> <span> DE E-MAIL</span></h1></Link></div>
                        <form onSubmit={handleSearchSubmit}>
                            <input
                                type="text"
                                placeholder=" Pesquise aqui um contato"
                                value={searchBar}
                                onChange={handleSearch}
                            />
                            <button type="submit"><FiSearch size={25} /></button>
                        </form>
                    </MenuContainer>
                    {/* <BirthdayPopUpComponent /> */}
                    {filteredContacts.length > 0 ?
                    <>
                    <SearchResponse>
                    <h2> Resultados da busca...</h2>
                    <ContactsComponent contatos={filteredContacts} />
                    <button onClick={clearSearch}> Limpar pesquisa</button>
                    </SearchResponse>
                    
                    </>

                    
                    :
                        <>
                            <BannerContainer>
                                <BannerSlideComponent />
                            </BannerContainer>
                            <ButtonsContainer>
                                <div>
                                    <Link to={"/certificacoes"}> CERTIFICAÇÕES</Link>
                                </div>
                                <div>
                                    <Link to={"/politicas"}>POLÍTICAS </Link>
                                </div>
                                <div>
                                    <a href="https://accerte.sharepoint.com/:f:/s/AccerteTecnologiadaInformaoLtda/ElJz5fHRZnZLtQKGIgm4FGoBP_6DfkYLbh62iK5sdJF5YA?e=UINlKh" target="_blank">
                                        ESCRITORIO <br /> DE PROCESSOS
                                    </a>
                                </div>
                                <div>
                                    <Link to="/compliance">COMPLIANCE </Link>
                                </div>
                            </ButtonsContainer>
                <LinkedinPostsComponent />
                    </>
                    
                    }
                    
                    <FooterComponent />
                </>
            }
        </Container>
    );
};

export default IntranetHomePage;

const Container = styled.div`
    width: 100%;
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
`;

const LogoutButton = styled.button`
    position: absolute;
    top: 25px;
    right: 20px;
    font-size: 10px;
    z-index: 2;
`

const MenuContainer = styled.div`
    width: 90%;
    background-color: #067DD1;
    align-items: center;
    justify-content: center;
    color: white;
    gap: 30px;
    div {
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
            color: #067DD1;
            font-size: 15px;
            border-right: 2px solid #067DD1;
            padding-left: 5px;
            &::placeholder {
                color: #067DD1;
                padding-left: 5px;
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
`

const BannerContainer = styled.div`
    width: 50%;
    margin-top: 50px;
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

const MenuItem = styled.div`
  position: relative;
  padding: 10px;
  cursor: pointer;
  &:hover div {
    display: block;
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 80%;
  left: 0;
  background: #4493dc;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  box-shadow: 2px 4px 3px 5px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  border-top-left-radius: 0;
  padding: 5px;
  display: none;
  min-width: 180px;
  z-index: 2;
`;

const DropdownItem = styled.div`
  padding: 4px 2px;
  cursor: pointer;
  &:hover {
    color: black;
  }
`;

const SearchResponse = styled.div`
    margin: 35px 0;
    width: 95%;
    color: #067DD1;
    flex-direction: column;
    position: relative;
    button {
        position: absolute;
        justify-content: center;
        right: 50px;
        top:-5px;
    }
`