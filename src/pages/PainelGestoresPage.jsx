import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useFuncionarios } from '../contexts/FuncionariosContext';
import HeaderNewComponent from '../components/basic/HeaderNewComponent';
import AprovarFerias from '../assets/painel-gestores/aprovar-ferias.png';
import FiltrarFerias from '../assets/painel-gestores/filtrar-ferias.png';
import MinhasVagas from '../assets/painel-gestores/minhas-vagas.png';
import RequisicaoVaga from '../assets/painel-gestores/requisicao-vaga.png';
import TermometroHumor from '../assets/painel-gestores/termometro-humor.png';
import { VscFeedback } from "react-icons/vsc";
import { LiaListAlt } from "react-icons/lia";

function PainelGestoresPage() {
    const { user } = useAuth();
    const { dados: dadosFuncionarios } = useFuncionarios();

    const allowed = dadosFuncionarios?.gestores?.some(item => item.Funcionarios?.email?.toLowerCase() == user?.mail?.toLowerCase()) ?? false;
    const isDaniel = user?.mail?.toLowerCase() === 'daniel.garcia@accerte.com.br';
    const allowedSub = allowed || isDaniel;
    
    return (
        <PageContainer>
            <HeaderNewComponent pageTitle={"Painel Gestores"} />
            {allowedSub ? (
                <ButtonContainer>
                    {allowed && (
                        <>
                            <ButtonLink to="/criarvaga">
                                <NewButton>
                                    <img src={RequisicaoVaga} alt='Requisição de Vagas' />
                                    <p>Requisição de <br/> <span>Vaga</span></p>
                                </NewButton>
                            </ButtonLink>
                            <ButtonLink to="/listavagas">
                                <NewButton>
                                    <img src={MinhasVagas} alt='Minhas Vagas' />
                                    <p>Minhas <br/> <span>Vagas</span></p>
                                </NewButton>
                            </ButtonLink>
                            <ButtonLink to="/feedback/onboarding">
                                <NewButton>
                                    <VscFeedback size={115}/>
                                    <p>Criar Feedback <br/> <span>Onboarding</span></p>
                                </NewButton>
                            </ButtonLink>
                            <ButtonLink to="/feedback/onboarding/lista">
                                <NewButton>
                                    <LiaListAlt  size={115}/>
                                    <p>Lista Feedbacks <br/> <span>Onboarding</span></p>
                                </NewButton>
                            </ButtonLink>
                            <ButtonLink to="/humorequipe">
                                <NewButton>
                                    <img src={TermometroHumor} alt='Termômetro Humor' />
                                    <p>Termômetro de <br/> <span>Humor</span></p>
                                </NewButton>
                            </ButtonLink>
                            <ButtonLink to="/aprovarferias">
                                <NewButton>
                                    <img src={AprovarFerias} alt='Aprovar Férias' />
                                    <p>Aprovar <br/> <span>Férias</span></p>
                                </NewButton>
                            </ButtonLink>
                        </>
                    )}

                    {allowedSub && (
                        <ButtonLink to="/filtrarferias">
                            <NewButton>
                                <img src={FiltrarFerias} alt='Filtrar Férias' />
                                <p>Filtrar <br/> <span>Férias</span></p>
                            </NewButton>
                        </ButtonLink>
                    )}
                </ButtonContainer>
            ) : (
                <EmptyMessage>Nenhuma opção disponível para o seu usuário.</EmptyMessage>
            )}
        </PageContainer>
    )
}

function ButtonLink({ to, children }) {
    return <Link to={to}>{children}</Link>;
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

const EmptyMessage = styled.p`
    width: 100%;
    text-align: center;
    margin-top: 60px;
    font-family: Poppins;
    font-size: 20px;
    color: #666;
`

const ButtonContainer = styled.div`
    justify-content: center;
    flex-wrap: wrap;
    gap: 30px;
    width: 1200px;
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
`

