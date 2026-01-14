import styled from "styled-components";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate  } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useIsAuthenticated } from '@azure/msal-react';
import FooterComponent from "../components/basic/FooterComponent";
import Background from "../assets/basic/background.png"
import ButtonBackground from "../assets/basic/button-background.png"
import ComunicadoPopUpComponent from "../components/homepage/ComunicadoPopUpComponent";
import HomePageHeaderComponent from "../components/homepage/HomePageHeaderComponent";
import LinkedinPostsComponent from "../components/homepage/LinkedinPostsComponent";
import BirthdayPopUpComponent from "../components/homepage/BirthdayPopUpComponent";
import IndicAccerteComponent from "../components/homepage/IndicAccerteComponent";
import BannerSlideComponent from "../components/homepage/BannerSlideComponent";
import MenuBarHomeComponent from "../components/homepage/MenuBarHomeComponent";
import SugestoesComponent from "../components/homepage/SugestoesComponent";
import HumorComponent from "../components/homepage/HumorComponent";
import ContactsComponent from "../components/ContactsComponent";
import apiService from "../services/apiService";
import ChatIAComponent from "../components/homepage/ChatIAComponent";
import SomeoneBirthdayComponent from "../components/homepage/SomeoneBirthdayComponent";


const HomePage = () => {
    const navigate = useNavigate();
    const { user, dados, getData } = useAuth();
    const [searchBar, setSearchBar] = useState("");
    const [updated, setUpdated] = useState(false);
    const isAuthenticated = useIsAuthenticated();
    const [notificacoes, setNotificacoes] = useState({"ferias": false,"vagas": false,"aniversario": false, "comunicados": false});
    const [filteredContacts, setFilteredContacts] = useState([]);
    const emails = ['ana.rehder@accerte.com.br', 'maria.silva@accerte.com.br','antonio.neto@accerte.com.br', 'eduardo.mendes@accerte.com.br', 'leonardo.antonio@accerte.com.br'];

    useEffect(() => {
        async function fetchData() {
            if (!dados) {
                await getData();
            }
            if (user){
                const body = {"email": user.mail};
                const response = await apiService.buscarNotificacoes(body);
                setNotificacoes(response.data);
            }
        }
        fetchData();
    }, [user, updated]);

    const clearSearch = () => {
        setFilteredContacts([]);
        setSearchBar("");
    }
    
    return (
        <Container>
            {!user ? <h1> Carregando dados...</h1> :
                <>
                    <BirthdayPopUpComponent />
                    <SomeoneBirthdayComponent />
                    <ComunicadoPopUpComponent setUpdated={setUpdated}/>
                    {emails.includes(user.mail) && <ChatIAComponent />}
                    <HomePageHeaderComponent notificacoes={notificacoes}/>
                    <MenuBarHomeComponent searchBar={searchBar} setSearchBar={setSearchBar} setFilteredContacts={setFilteredContacts} />
                    <HumorComponent />
                    {filteredContacts.length > 0 ?
                        <SearchResponse>
                            <h2> Resultados da busca...</h2>
                            <ContactsComponent contatos={filteredContacts} />
                            <button onClick={clearSearch}> Limpar pesquisa</button>
                        </SearchResponse>
                        :
                        <BannerContainer>
                            <BannerSlideComponent />
                            <BannerMenu>
                                <BannerButton>
                                    <Link to="/assinatura">ASSINATURA DE E-MAIL</Link>
                                </BannerButton>
                                <BannerButton>
                                    <Link to={"/certificacoes"}> CERTIFICAÇÕES</Link>
                                </BannerButton>
                                <BannerButton>
                                    <Link to="/compliance">COMPLIANCE </Link>
                                </BannerButton>
                                <BannerButton>
                                    <a href="https://accerte.sharepoint.com/:f:/s/AccerteTecnologiadaInformaoLtda/ElJz5fHRZnZLtQKGIgm4FGoBP_6DfkYLbh62iK5sdJF5YA?e=UINlKh" target="_blank">
                                        ESCRITÓRIO DE PROCESSOS
                                    </a>
                                </BannerButton>
                                <BannerButton>
                                    <Link to={"/politicas"}>POLÍTICAS </Link>
                                </BannerButton>
                            </BannerMenu>
                        </BannerContainer>
                    }
                    <LinkedinPostsComponent />
                    <IndicAccerteComponent user={user} />
                    <SugestoesComponent email={user.mail} />
                    
                    <FooterComponent />
                </>
            }
        </Container>
    );
};

export default HomePage;

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    background: url(${Background}) no-repeat right center;
    background-size: cover;
    position: relative;
    font-family: "Poppins", serif;
    h1 {
        font-family: "Poppins", serif;
    }
    span{
        font-weight: 700;
    }
`;


const BannerContainer = styled.div`
    width: 90%;
    justify-content: center;
    margin: 50px 0;
    gap: 50px;
    align-items: center;
`

const BannerMenu = styled.div`
    width: 350px;
    border-left: 1px solid #555;
    flex-direction: column;
    padding:  30px 50px;
    gap: 30px;
}
`

const BannerButton = styled.div`
    background: url(${ButtonBackground}) no-repeat center;
    background-size: cover;
    background-size: 120%;
    box-shadow: 2px 2px 3px 2px rgba(0, 0, 0, 0.3);
    height: 70px;
    color: white;
    border-radius: 15px;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    a {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`

const SearchResponse = styled.div`
    margin: 75px 0;
    width: 95%;
    color: #1a4cae;
    flex-direction: column;
    position: relative;
    button {
        position: absolute;
        justify-content: center;
        background-color: #1a4cae;
        background: linear-gradient(to right,#205fdd, #001143);
        right: 150px;
        top:-5px;
    }
`