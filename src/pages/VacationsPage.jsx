import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import HeaderGGComponent from '../components/HeaderGGComponent';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';
import gerarFerias from "../services/vacationGenerate";
import { FaEdit } from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";
import CriarFeriasComponent from '../components/vacations-components/CriarFeriasComponent';
import EditarFeriasComponent from '../components/vacations-components/EditarFeriasComponent';

function VacationsPage() {
    const { user, carregando } = useAuth();
    const [ vacationInfo, setVacationInfo] = useState(null);
    const [feriasDisponiveis, setFeriasDisponiveis] = useState(null);
    const [feriasSelecionadas, setFeriasSelecionadas] = useState([]);
    const [admissao, setAdmissao] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState(-1);
    const [agendarFerias, setAgendarFerias] = useState(false);
    const [editarFerias, setEditarFerias] = useState([]);
    const [diasAgendados, setDiasAgendados] = useState(0);
    const [updated, setUpdated] = useState(false);
    const [diasConcluidos, setDiasConcluidos] = useState(0);

    const hoje = new Date();

    useEffect(() => {
        async function fetchData() {
            if (!carregando) {
                const response = await apiService.getVacation(user.mail);
                setVacationInfo(response.data[0]);
                const dataOriginal = new Date(response.data[0].admissao);
                dataOriginal.setDate(dataOriginal.getDate() + 1); // adiciona 1 dia
                const admissao = dataOriginal.toLocaleDateString("pt-BR");
                setAdmissao(admissao);
                const feriasDatas = gerarFerias(admissao);
                setFeriasDisponiveis(feriasDatas);
                setSelectedPeriod(-1);
                setUpdated(false);
            }
        }
        fetchData();
    }, [user, carregando, updated]);

    const selecionarFeriasPorInicio = (dataRef, index) => {
        const feriasFiltradas = vacationInfo.Ferias.filter((f) => {
            return formatarDataBR(f.referenteInicio) === dataRef;
        });
        setSelectedPeriod(index);
        setFeriasSelecionadas(feriasFiltradas)
        const totalDiasSomados = feriasFiltradas.reduce((acc, item) => acc + item.totalDias, 0);
        setDiasAgendados(totalDiasSomados);
        const totalDiasAnterioresHoje = feriasFiltradas
            .filter(f => new Date(f.inicio) < hoje)
            .reduce((acc, f) => acc + f.totalDias, 0);
        setDiasConcluidos(totalDiasAnterioresHoje);
    };

    function formatarDataBR(dataIso) {
        const data = new Date(dataIso);
        const [ano, mes, dia] = data.toISOString().slice(0, 10).split("-");
        return `${dia}/${mes}/${ano}`;
    }

    return (
        <PageContainer>
            <HeaderGGComponent pageTitle={"Férias"} />
            {vacationInfo &&
                <EmployeeInfo>
                    <h2>
                        <span>Início: {admissao}</span> •
                        <span>Tipo Contrato: {vacationInfo?.Contratos?.tipo}</span> •
                        <span>Total Anual: {vacationInfo?.Contratos?.diasFerias}</span>
                    </h2>
                </EmployeeInfo>
            }
            {(agendarFerias && vacationInfo && selectedPeriod && feriasDisponiveis) && 
                <CriarFeriasComponent selected={feriasDisponiveis[selectedPeriod]} info={vacationInfo} setUpdated={setUpdated} setAgendarFerias={setAgendarFerias} />
            }
            {(editarFerias.length !== 0 && vacationInfo && selectedPeriod && feriasDisponiveis) &&
                <VacationContiner>
                    <EditarFeriasComponent selected={feriasDisponiveis[selectedPeriod]} toEdit={editarFerias} info={vacationInfo} setUpdated={setUpdated} setEditarFerias={setEditarFerias} />
                </VacationContiner>
            }
            {(vacationInfo && editarFerias.length === 0 && !agendarFerias) &&
                <Periodos>
                    <h2>Períodos Aquisitivos:</h2>
                    <ButtonsContainer>
                        {feriasDisponiveis?.map((periodo, index) => (
                            <PeriodButton key={index} onClick={() => selecionarFeriasPorInicio(periodo.inicio, index)} $active={[selectedPeriod]?.inicio === periodo.inicio && 'show'}>
                                {`${periodo.inicio} - ${periodo.fim}`} {feriasDisponiveis[selectedPeriod]?.inicio === periodo.inicio && '•'}
                            </PeriodButton>
                        ))}
                    </ButtonsContainer>
                </Periodos>
            }
            {(vacationInfo && editarFerias.length === 0 && !agendarFerias) &&
                <VacationContiner>
                    {feriasDisponiveis && selectedPeriod >= 0 &&
                        <VacationPeriod>
                            {feriasSelecionadas.length === 0 && <h2>Não há períodos de férias agendados</h2>}
                            {feriasSelecionadas.length !== 0 &&
                                <VacationTable>
                                    <div>
                                        <p><span>Início</span></p>
                                        <p><span>Fim</span></p>
                                        <p><span>Total</span></p>
                                        <p><span>Status</span></p>
                                        <p><span>Ação</span></p>
                                    </div>
                                    {feriasSelecionadas?.map((f, i) => (
                                        <div key={i}>
                                            <p>{formatarDataBR(f.inicio)}</p>
                                            <p>{formatarDataBR(f.fim)}</p>
                                            <p>{f.totalDias}</p>
                                            <p>{f.status}</p>
                                            {new Date(f.inicio) > hoje ? <p onClick={() => setEditarFerias(f)} ><FaEdit /> </p> : <p><MdLockOutline style={{ cursor: 'default' }}/></p>}
                                        </div>
                                    ))}
                                </VacationTable>
                            }
                            <ButtonsCreateContainer>
                                {diasAgendados < vacationInfo?.Contratos?.diasFerias && <PeriodButton onClick={() => setAgendarFerias(true)}> Nova Solicitação</PeriodButton>}
                                <PeriodButton> Data Limite Para Agendamento - {feriasDisponiveis[selectedPeriod].limite} </PeriodButton>

                            </ButtonsCreateContainer>
                        </VacationPeriod>
                    }
                    {selectedPeriod >= 0 &&
                        <TotalContainer>
                            <div>Agendados <br /> {diasAgendados - diasConcluidos}</div>
                            <div>Concluídos <br /> {diasConcluidos}</div>
                            <div>Restantes <br /> {vacationInfo?.Contratos?.diasFerias - diasAgendados}</div>
                        </TotalContainer>
                    }
                </VacationContiner>
            }
        </PageContainer>
    )
}

export default VacationsPage;

const PageContainer = styled.div`
    width: 100%;
    height: 100%;
    min-height: 100vh;
    flex-direction: column;
    align-items: center;
    gap: 20px;
`

const ButtonsCreateContainer = styled.div`
    flex-direction: column;
    width: 300px;
    height: 100%;
    align-items: center;
`

const EmployeeInfo = styled.div`
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    color: #ED1F4C;
    border-radius: 30px;
    margin: 15px 0;
    span {
        margin: 0 20px;
    }
`

const Periodos = styled.div`
    width: 80%;
    align-items: center;
    justify-content: center;
    margin: 10px 0 15px 0;
    h2{
        color: #ED1F4C;
        width: 150px;
    }
    div{
        width: 65%;      
        height: 100%;  
        margin: 0;
        align-items: flex-end;
        flex-wrap: wrap;
        justify-content: center;
    }
    button{
        background-color: ${({ active }) => (active  === 'show' ? "transparent" : "#ff5843")};
        color: ${({ active }) => (active === 'show' ? "#ff5843" : "white")};
    }
`

const VacationContiner = styled.div`
    width: 75%;
    min-width: 700px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 30px;
    margin-bottom: 40px;
    div {
        display: flex;
        justify-content: center;
        gap: 30px;
    }
    button {
        background-color: #ff5843;
        border: 2px solid #ff5843;
    }
`

const VacationPeriod = styled.div`
    width: 100%;
    height: 200px;
    margin-top: 30px;
    gap: 15px;
    align-items: flex-start;
    h2{
        color: grey;
        width: 120px;
        margin: 0;
    }
`

const VacationTable = styled.div`
    width: 60%;  
    flex-direction: column;
    gap: 10px;
    color: #ff5843;
    div {
        margin-bottom: 0 !important;
        align-items: center;
        min-height: 40px;
        border-bottom: 1px solid #80808F;
    }
    p{
        text-align: center;
        width: 25%;
        cursor: default;
    }
    span{
        font-weight: 700;
    }
`
const ButtonsContainer = styled.div`
    gap: 50px;
`

const PeriodButton = styled.button`
    text-align: center;
    width: 250px;
    justify-content: center;
    font-weight: 700;
    font-size: 15px;
    border: ${({ $active }) => ($active === 'show' ? "3px solid #555" : "3px solid #ff5843")};
    
`;

const TotalContainer = styled.div`
    width: 800px;
    div{
        width: 30%;
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px;
        font-size: 18px;
        line-height: 25px;
        align-items: center;
        text-align: center;
        box-shadow: 4px 4px 4px 4px rgba(0, 0, 0, 0.2);
    }
    color: gray;
    h2{
        font-size: 18px;
        font-weight: 500;
    }
`