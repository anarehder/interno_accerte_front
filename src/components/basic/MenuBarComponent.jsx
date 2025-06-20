import styled from 'styled-components';
import { Link } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';

function MenuBarComponent() {
    const { user, dados } = useAuth();

    return (
        <PageContainer>
            <MenuContainer>
                <ItemsBar>
                <MenuItem><Link to={"/sobre"}> <h1>SOBRE <span> NÓS</span></h1></Link></MenuItem>
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
                        <DropdownItem><Link to={"/vagasemaberto"}>Vagas Abertas</Link></DropdownItem>
                    </Dropdown>
                </MenuItem>
                <MenuItem> <Link to="/contatos"><h1>NOSSA<span> AGENDA </span></h1></Link></MenuItem>
                <MenuItem> <Link to="/links"><h1>LINKS <span> RÁPIDOS</span></h1></Link></MenuItem>
                <MenuItem> <Link to="/fiquepordentro"><h1>FIQUE<span> POR DENTRO </span> </h1></Link></MenuItem>
                <MenuItem>
                    <h1>GESTÃO <span> DE TI </span></h1>
                    <Dropdown>
                        <DropdownItem><h1>GESTÃO <span> DE TI </span></h1></DropdownItem>
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
                
            </MenuContainer>
        </PageContainer>
    )
}

export default MenuBarComponent;

const PageContainer = styled.div`
    width: 100%;
    position: relative;
    justify-content: center;
    margin-bottom: 10px;
    z-index: 1;
`

const MenuContainer = styled.div`
    background-color: white;
    height: 50px;
    width: 100%;
    align-items: center;
    justify-content: center;
    border-radius: 2px;
    box-shadow: 2px 2px 4px 2px rgba(0, 0, 0, 0.2);
`

const ItemsBar = styled.div`
    width: 100%;
    justify-content: center;
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
    &:first-of-type {
        border-left: 1px solid #082764;
    }
    &:hover div {
        display: block;
        justify-content: center;
    }
    h1{
        font-size: 14px !important;
    }
`;

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