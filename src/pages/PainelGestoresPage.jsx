import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import apiService from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';
import HeaderNewComponent from '../components/basic/HeaderNewComponent';
import AprovarFerias from '../assets/painel-gestores/aprovar-ferias.png';
import FiltrarFerias from '../assets/painel-gestores/filtrar-ferias.png';
import MinhasVagas from '../assets/painel-gestores/minhas-vagas.png';
import RequisicaoVaga from '../assets/painel-gestores/requisicao-vaga.png';
import TermometroHumor from '../assets/painel-gestores/termometro-humor.png';

function PainelGestoresPage() {
    const { user } = useAuth();
    const [allowed, setAllowed] = useState(false);
    const [allowedSub, setAllowedSub] = useState(false);

    useEffect(() => {
        if (!user) return;
        const fetchScale = async () => {
            try {
                const response = await apiService.buscarGestoresInfo();
                const gestorConf = response.data.filter(item => item.Funcionarios?.email?.toLowerCase() == user.mail?.toLowerCase());
                if (gestorConf.length>0){
                    setAllowed(true);
                    setAllowedSub(true);
                }
                if (user.mail === 'daniel.garcia@accerte.com.br'){
                    setAllowedSub(true);
                }
            } catch (error) {
                console.error("Erro ao buscar informacoes gestores", error);
            }
        };
        fetchScale();
    }, [user]);

    return (
        <PageContainer>
            <HeaderNewComponent pageTitle={"Painel Gestores"} />
            <ButtonContainer>
                <Link to="/criarvaga">
                    <NewButton disabled={!allowed && true}>
                        <img src={RequisicaoVaga} alt='Requisição de Vagas' />
                        <p>Requisição de <br/> <span>Vaga</span></p>
                    </NewButton>
                </Link>
                <Link to="/listavagas">
                <NewButton disabled={!allowed && true}>
                    <img src={MinhasVagas} alt='Minhas Vagas' />
                    <p>Minhas <br/> <span>Vagas</span></p>
                </NewButton>
                </Link>
                
                <Link to="/humorequipe">
                <NewButton disabled={!allowed && true}>
                    <img src={TermometroHumor} alt='Termômetro Humor' />
                    <p>Termômetro de <br/> <span>Humor</span></p>
                </NewButton>
                </Link>
                
                <Link to="/aprovarferias">
                <NewButton disabled={!allowed && true}>
                    <img src={AprovarFerias} alt='Aprovar Férias' />
                    <p>Aprovar <br/> <span>Férias</span></p>
                </NewButton>
                </Link>
                
                <Link to="/filtrarferias">
                    <NewButton disabled={(!allowedSub) && true}>
                    <img src={FiltrarFerias} alt='Filtrar Férias' />
                    <p>Filtrar <br/> <span>Férias</span></p>
                    </NewButton>
                </Link>
            </ButtonContainer>
        </PageContainer>
    )
}

export default PainelGestoresPage;

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
    color: #0057E1;
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
    img{
        // width: 120px;
        height: 110px;
    }
    &: hover {
        cursor: pointer;
        background: linear-gradient(94.61deg, #0057E1 3.73%, #00266D 133.27%);
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

const SideBar = styled.div`
    width: 350px;
    position: absolute;
    padding: 15px 0;
    align-items: center;
    height: 60vh;
    border-right: 2px solid gray;
    flex-direction: column;
    gap: 30px;
    button{
        width: 300px;
        height: 60px;
        font-size: 22px;
        align-items: center;
        justify-content: flex-start;
        gap: 10px;
        &: hover {
        cursor: pointer;
        }
    }
`

const PageRightContainer = styled.div`
    margin: 0 10px 0 350px;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    gap: 10px;
    height: calc(100%-100px);
    color: #555;
    border: none;
    position: relative;
    h2 {
        margin: 10px 0;
    }
`