import { useAuth } from '../../contexts/AuthContext';
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import styled from 'styled-components';

function MenuBarHomeComponent({searchBar, setSearchBar, setFilteredContacts}) {
    const { user, dados } = useAuth();

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
                        <DropdownItem><Link to={"/dashprojetos "}>BI Projetos</Link></DropdownItem>
                        <DropdownItem><a href="mailto:atendimento@accerte.com.br?subject=Chamado%20Interno&body=Gostaria%20de%20solicitar%20..." target="blank">JIRA</a></DropdownItem>
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
                <SearchItem>
                    <form onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        placeholder=" Pesquise aqui um contato"
                        value={searchBar}
                        onChange={handleSearch}
                    />
                    <button type="submit"><FiSearch size={25} /></button>
                    </form>
                </SearchItem>
                
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
    height: 60px;
    width: 90%;
    align-items: center;
    justify-content: space-between;
    border-radius: 8px;
    box-shadow: 4px 4px 8px 4px rgba(0, 0, 0, 0.4);
`

const ItemsBar = styled.div`
    width: 74%;
}`

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
    width: 24%;
    margin-right: 10px;
    border-radius: 10px;
    background-color:  #E7E7E7;
    form {
        width: 90%;
        margin-left: 20px;
        height: 45px;
        display: flex;
        justify-content: space-between;
        background: linear-gradient(to right,#205fdd, #001143);
        border-radius: 10px;
        input {
            width: 90%;
            color: white;
            font-size: 15px;
            border-right: 1px solid white;
            padding-left: 5px;
            text-indent: 15px;   
            &::placeholder {
                color: white;
                padding-left: 5px;
                text-indent: 15px;             
            }
        }
        button {
            width: 55px;
            background-color: transparent;
            justify-content: center;
            color: white;
            padding: 0;
            margin-left: 5px;
            border: none;
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