import { useState } from "react";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import { FaUsersGear } from "react-icons/fa6";
import { FaCalendarWeek } from "react-icons/fa6";
import HeaderGGNewComponent from "../components/gentegestao/HeaderGGNewComponent";
import AprovarFerias from '../assets/painel-gestores/aprovar-ferias.png';
import FiltrarFerias from '../assets/painel-gestores/filtrar-ferias.png';
import MinhasVagas from '../assets/painel-gestores/minhas-vagas.png';
import { Link } from 'react-router-dom';

const AdminPage = () => {
    const { dados, user, carregando, getData } = useAuth();
    const [activeButton, setActiveButton] = useState("");
    const [inicioSemana, setInicioSemana] = useState('');
    const [fimSemana, setFimSemana] = useState('');
    const [type, setType] = useState("");

    return (
        <PageContainer>
            <HeaderGGNewComponent pageTitle={"Painel Admin | Intranet"} />
            <ButtonContainer>
                <Link to="/usuariosadmin">
                    <NewButton>
                        <FaUsersGear size={100}/>
                        <p>Painel de <br /> <span>Usuários</span></p>
                    </NewButton>
                </Link>
                <Link to="/escalas/admin">
                    <NewButton>
                        <FaCalendarWeek size={80}/>
                        <p>Painel de <br /> <span>Escalas</span></p>
                    </NewButton>
                </Link>

                <Link to="/aprovarferias/admin">
                    <NewButton>
                        <img src={AprovarFerias} alt='Aprovar Férias' />
                        <p>Aprovar <br /> <span>Férias</span></p>
                    </NewButton>
                </Link>

                <Link to="/filtrarferias">
                    <NewButton>
                        <img src={FiltrarFerias} alt='Filtrar Férias' />
                        <p>Filtrar <br /> <span>Férias</span></p>
                    </NewButton>
                </Link>

                <Link to="/filtrarferias">
                    <NewButton>
                        <img src={FiltrarFerias} alt='Filtrar Férias' />
                        <p>Criar <br /> <span>Férias</span></p>
                    </NewButton>
                </Link>
            </ButtonContainer>
        </PageContainer>
    );
};

export default AdminPage;
//   {activeButton === "Usuarios" && !carregando && <UsuariosAdminComponent />}
//             {activeButton === "Ferias" && !carregando && <FeriasAdminComponent />}
//             {activeButton === "Escalas" && !carregando && <EscalasAdminComponent />}

const PageContainer = styled.div`
    width: 100%;
    min-height: 100%;
    flex-direction: column;
    align-items: center;
    position: absolute;
    gap: 20px;
    color:rgb(75, 74, 75);
`

const ButtonContainer = styled.div`
    justify-content: center;
    flex-wrap: wrap;
    // padding: 20px 0;
    gap: 30px;
    width: 900px;
    // background-color: red;
`

const NewButton = styled.button`
    flex-direction: column;
    justify-content: center;
    width: 220px;
    height: 220px;
    gap: 7px;
    border-radius: 28px;
    color: #FE2626;
    border: 1px solid #acaaaaff;
    box-shadow: 0px 4px 4px 4px #00000040;
    background: linear-gradient(94.61deg, #FFFFFF 3.73%, #E1E1E1 133.27%);
    font-family: Poppins;
    font-weight: 400;
    font-size: 23px;
    text-align: center;
    p{
        height: 80px;
        font-size: 23px;
    }
    span{
        font-weight: 700;
        font-style: Bold;
    }
    svg{
        height: 110px;
    }
    img{
        // width: 120px;
        height: 110px;
        filter: brightness(100) invert(1) hue-rotate(350deg) contrast(250%) opacity(85%);
    }
    &: hover {
        cursor: pointer;
        background: linear-gradient(94.61deg, #E7185A 3.73%, #aa1041ff 133.27%);
        color: white;
        img{
            filter: brightness(0) invert(1);
        }
    }
    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
        color: gray;
        img{
            filter: sepia(100%) saturate(10%) brightness(100%) contrast(100%) invert(100%);
        }
        &: hover {
            background-color: #ccc;
        }
    }
`