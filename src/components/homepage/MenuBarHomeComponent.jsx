import { useAuth } from '../../contexts/AuthContext';
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import styled from 'styled-components';
import { useState, useEffect } from 'react';

function MenuBarHomeComponent({searchBar, setSearchBar, setFilteredContacts}) {
    const { user, dados } = useAuth();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 1700);
    const indicAiAllowed = [
        'ana.rehder@accerte.com.br',
        'eduardo.mendes@accerte.com.br',
        'thiago.martins@accerte.com.br',
        'antonio.neto@accerte.com.br',
    ];
    const canSeeIndicAi = indicAiAllowed.includes((user?.mail || '').toLowerCase());
    const searchAlwaysExpanded = isLargeScreen;

    useEffect(() => {
        const handleResize = () => {
            const isLarge = window.innerWidth > 1700;
            setIsLargeScreen(isLarge);
            setIsSearchOpen(isLarge); // Sempre aberto em telas grandes
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Chamar uma vez no mount

        return () => window.removeEventListener('resize', handleResize);
    }, [canSeeIndicAi]);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchBar(value);
        
        // Filtrar e exibir em tempo real
        if (value) {
            const filtered = dados.agenda.filter(contato =>
                removeAcentos(contato.name.toLowerCase())
                .includes(removeAcentos(value.toLowerCase()))
            );
            setFilteredContacts(filtered);
        } else {
            setFilteredContacts([]);
        }
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

    const toggleSearch = () => {
        // Em telas grandes sem IndicAI, sempre submete a busca (barra sempre visível)
        if (searchAlwaysExpanded) {
            return; // O submit será via form
        }

        setIsSearchOpen(!isSearchOpen);
        if (isSearchOpen) {
            setSearchBar("");
            setFilteredContacts([]);
        }
    };
    // console.log(isSearchOpen);
    return (
        <PageContainer>
            <MenuContainer>
                <ItemsBar>
                <MenuItem>
                {/* <Link to={"/sobre"}> <h1>SOBRE <span> NÓS</span></h1></Link> */}
                <h1>SOBRE <span> NÓS </span></h1>
                    <Dropdown>
                        <DropdownItem><h1>SOBRE <span> NÓS </span></h1></DropdownItem>
                        <DropdownItem><Link to={"/sobre"}>Sobre a Accerte</Link></DropdownItem>
                        <DropdownItem><a href={'https://accerte.sharepoint.com/sites/AccerteTecnologiadaInformaoLtda/Documentos%20Compartilhados/Extras/PORTFOLIO/PORTFOLIO%20ATUAL.pdf'} target="_blank">Portfólio</a></DropdownItem>
                    </Dropdown>
                </MenuItem>
                <MenuItem>
                    <h1>GENTE <span> E GESTÃO </span></h1>
                    <Dropdown>
                        <DropdownItem><h1>GENTE <span> E GESTÃO </span></h1></DropdownItem>
                        <DropdownItem><Link to={"/aniversarios"}>Aniversários</Link></DropdownItem>
                        <DropdownItem><Link to={"/calendario"}>Calendário</Link></DropdownItem>
                        <DropdownItem><Link to={"/escala"}>Escala Semanal</Link></DropdownItem>
                        <DropdownItem><Link to={"/faqs"}>FAQs</Link></DropdownItem>
                        <DropdownItem><Link to={"/ferias"}>Férias | Pausas</Link></DropdownItem>
                        <DropdownItem><Link to={"/parceriaeducacional"}>IPOG</Link></DropdownItem>
                        <DropdownItem><Link to={"/organograma"}>Organograma</Link></DropdownItem>
                        <DropdownItem><Link to={"/vagasemaberto"}>Vagas Abertas</Link></DropdownItem>
                    </Dropdown>
                </MenuItem>
                <MenuItem> <Link to="/contatos"><h1>NOSSA<span> AGENDA </span></h1></Link></MenuItem>
                <MenuItem> <Link to="/links"><h1>LINKS <span> RÁPIDOS</span></h1></Link></MenuItem>
                <MenuItem>
                    <h1>FIQUE  <span> POR DENTRO </span></h1>
                    <Dropdown>
                        <DropdownItem><h1>FIQUE <span> POR DENTRO </span></h1></DropdownItem>
                        <DropdownItem><Link to={"/comunicados"}>Comunicados</Link></DropdownItem>
                        <DropdownItem><Link to={"/fiquepordentro"}>Vídeos</Link></DropdownItem>
                    </Dropdown>
                </MenuItem>
                <MenuItem>
                    <h1>GESTÃO <span> DE TI </span></h1>
                    <Dropdown>
                        <DropdownItem><h1>GESTÃO <span> DE TI </span></h1></DropdownItem>
                        <DropdownItem><a href="mailto:atendimento@accerte.com.br?subject=Chamado%20Interno&body=Gostaria%20de%20solicitar%20..." target="blank">JIRA</a></DropdownItem>
                        <DropdownItem><Link to={"/dashprojetos "}>Painel de Projetos</Link></DropdownItem>
                        <DropdownItem><Link to={"/plantoes "}>Plantões</Link></DropdownItem>
                    </Dropdown>
                </MenuItem>
                <MenuItem>
                    <h1>GESTÃO <span>À VISTA</span></h1>
                    <Dropdown>
                        <DropdownItem><h1>GESTÃO <span>À VISTA</span></h1></DropdownItem>
                        <DropdownItem> <Link to="/painelgestores">Painel Gestores</Link></DropdownItem>
                        {
                            (user?.mail === 'maria.silva@accerte.com.br' || user?.mail === 'ana.rehder@accerte.com.br') &&
                            <DropdownItem> <Link to="/admin">Painel Admin</Link></DropdownItem>
                        }
                    </Dropdown>
                </MenuItem>
                </ItemsBar>
                <ActionsBar>
                    {canSeeIndicAi && (
                        <IndicAIButton href="https://accerte.com.br/indicai-interno/" target="_blank" rel="noopener noreferrer">
                            IndicAI
                        </IndicAIButton>
                    )}
                    <SearchItem $isOpen={isSearchOpen || searchAlwaysExpanded} $isLargeScreen={searchAlwaysExpanded}>
                        <form onSubmit={handleSearchSubmit}>
                        {(isSearchOpen || searchAlwaysExpanded) && (
                            <input
                                type="text"
                                placeholder=" Pesquise aqui um contato"
                                value={searchBar}
                                onChange={handleSearch}
                                autoFocus={!searchAlwaysExpanded && isSearchOpen}
                            />
                        )}
                        <button type={!searchAlwaysExpanded ? "button" : "submit"} onClick={!searchAlwaysExpanded ? toggleSearch : handleSearchSubmit}>
                            <FiSearch size={25} />
                        </button>
                        </form>
                    </SearchItem>
                </ActionsBar>
                
            </MenuContainer>
        </PageContainer>
    )
}

export default MenuBarHomeComponent;

const PageContainer = styled.div`
    width: 100%;
    position: relative;
    justify-content: center;
    margin-bottom: 10px;
    z-index: 1;
`

const MenuContainer = styled.div`
    background-color: #e7e7e7; 
    display: flex;
    position: relative;
    height: 60px;
    width: 90%;
    align-items: center;
    justify-content: space-between;
    border-radius: 8px;
    box-shadow: 4px 4px 8px 4px rgba(0, 0, 0, 0.4);
`

const ItemsBar = styled.div`
    width: 74%;
    min-width: 1015px;
}`

const ActionsBar = styled.div`
    display: flex;
    align-items: center;
    width: 200px;
    margin-right: 10px;
    gap: 15px;
    justify-content: flex-end;
    
    @media (min-width: 1700px) {
        width: 460px;
        
    }
`

const IndicAIButton = styled.a`
    height: 45px;
    padding: 0 20px;
    border-radius: 10px;
    background: linear-gradient(to right, #fd644f, #f28e27);
    color: white;
    font-weight: bold;
    font-size: 17px;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);
    }
`

const MenuItem = styled.div`
    max-width: 150px;
    height: 50px;
    color: #082764;
    border-right: 1px solid #082764;
    flex-wrap: wrap;
    position: relative;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    &:hover div {
        display: block;
        justify-content: center;
    }
    h1{
        font-size: 14px !important;
        font-weight: 400;
    }
    span {
        font-weight: 600;
    }
`;

const SearchItem = styled.div`
    width: ${props => {
        if (props.$isLargeScreen) return 'fit-content'; // Tela grande: ajusta ao conteúdo
        return props.$isOpen ? 'fit-content' : '65px'; // Tela pequena: expansível
    }};
    position: ${props => props.$isOpen && !props.$isLargeScreen ? 'absolute' : 'relative'};
    right: ${props => props.$isOpen && !props.$isLargeScreen ? '10px' : 'auto'};
    top: ${props => props.$isOpen && !props.$isLargeScreen ? '50%' : 'auto'};
    transform: ${props => props.$isOpen && !props.$isLargeScreen ? 'translateY(-50%)' : 'none'};
    z-index: ${props => props.$isOpen && !props.$isLargeScreen ? '10' : '1'};
    border-radius: 10px;
    background-color:  #E7E7E7;
    transition: width 0.3s ease, left 0.3s ease;
    padding: 2px;

    form {
        width: ${props => {
            if (props.$isLargeScreen) return 'auto';
            return props.$isOpen ? 'auto' : '55px';
        }};
        margin-left: ${props => {
            if (props.$isLargeScreen) return '0';
            return props.$isOpen ? '0' : '0';
        }};
        height: 45px;
        display: flex;
        justify-content: ${props => {
            if (props.$isLargeScreen) return 'space-between';
            return props.$isOpen ? 'space-between' : 'center';
        }};
        background: linear-gradient(to right,#205fdd, #001143);
        border-radius: 10px;
        transition: all 0.3s ease;
        padding: 0 5px;
        input {
            width: 250px;
            color: white;
            font-size: 15px;
            font-weight: 600;
            border-right: 1px solid white;
            text-indent: 5px;   
            &::placeholder {
                color: white;
                padding-left: 5px;
                text-indent: 5px;           
            }
        }
        button {
            width: 55px;
            background-color: transparent;
            justify-content: center;
            color: white;
            padding: 0;
            border: none;
            cursor: pointer;
        }
    }
`

const Dropdown = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    max-width: 150px;
    font-size: 14px !important;
    color: white;
    text-indent: 10px;
    line-height: 30px;
    background: linear-gradient(to bottom,#00348E, #001143);
    box-shadow: 2px 4px 3px 5px rgba(0, 0, 0, 0.2);
    display: none;
    z-index: 2;
    padding-bottom: 10px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    h1{
        line-height: 30px;
        color: white;
        text-indent: 0px;
    }
`;

const DropdownItem = styled.div`
    cursor: pointer;
    &:hover {
        color: #bfb5b5;
    }
`;