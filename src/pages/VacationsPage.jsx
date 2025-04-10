import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import HeaderGGComponent from '../components/HeaderGGComponent';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';

function VacationsPage() {
    const { user, carregando } = useAuth();
    const [ vacationInfo, setVacationInfo] = useState(null);
    const [feriasDisponiveis, setFeriasDisponiveis] = useState(null);
    const [feriasSelecionadas, setFeriasSelecionadas] = useState([]);
    const [admissao, setAdmissao] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState(-1);

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
            }
        }
        fetchData();
    }, [user, carregando]);

    const selecionarFeriasPorInicio = (dataRef, index) => {
        const feriasFiltradas = vacationInfo.Ferias.filter((f) => {
            return formatarDataBR(f.referenteInicio) === dataRef;
        });
        setSelectedPeriod(index);
        setFeriasSelecionadas(feriasFiltradas);
    };

    const gerarFerias = (admissao) => {
        // Transformar a data de admissão em um objeto Date
        const [dia, mes, ano] = admissao.split('/');
        const dataAdmissao = new Date(mes + '/' + dia + '/' + ano);

        // Obter a data atual
        const dataAtual = new Date();

        // Calcular o próximo ano (ano seguinte)
        const ferias = [];

        // Gerar período de férias até o ano atual
        while (dataAdmissao <= dataAtual) {
            let fimFerias = new Date(dataAdmissao);
            fimFerias.setFullYear(fimFerias.getFullYear() + 1);
            fimFerias.setDate(fimFerias.getDate() - 1);
            let limiteFerias = new Date(dataAdmissao);
            limiteFerias.setFullYear(fimFerias.getFullYear() + 2);
            limiteFerias.setDate(fimFerias.getDate() - 45);

            ferias.push({
                inicio: dataAdmissao.toLocaleDateString(),
                fim: fimFerias.toLocaleDateString(),
                limite: limiteFerias.toLocaleDateString(),
            });

            // Incrementar a data de admissão para o próximo período
            dataAdmissao.setFullYear(dataAdmissao.getFullYear() + 1);
        }

        return ferias;
    };

    function formatarDataBR(dataIso) {
        const data = new Date(dataIso);
        const [ano, mes, dia] = data.toISOString().slice(0, 10).split("-");
        return `${dia}/${mes}/${ano}`;
    }
    // console.log(selectedPeriod, feriasSelecionadas, feriasDisponiveis[selectedPeriod].inicio);
    return (
        <PageContainer>
            <HeaderGGComponent pageTitle={"Férias"} />
            {
                (user?.mail === 'maria.silva@accerte.com.br' || user?.mail ==='ana.rehder@accerte.com.br') && <AdminButton><Link to="/admin">Painel Admin</Link></AdminButton>
            }
            {
                vacationInfo && 
                <>
                    <EmployeeInfo>
                    <h2>
                        <span>Início: {admissao}</span> •
                        <span>Tipo Contrato: {vacationInfo?.Contratos?.tipo}</span> •
                        <span>Total Anual: {vacationInfo?.Contratos?.diasFerias}</span>
                    </h2>
                    </EmployeeInfo>
                    <VacationContiner>
                        <Periodos>
                            <h2>Períodos Aquisitivos <br />de Férias:</h2>
                            <ButtonsContainer>
                                {feriasDisponiveis?.map((periodo, index) => (
                                    <PeriodButton key={index} onClick={() => selecionarFeriasPorInicio(periodo.inicio, index)} active={feriasDisponiveis[selectedPeriod]?.inicio === periodo.inicio && 'show'}>
                                        {`${periodo.inicio} - ${periodo.fim}`} {feriasDisponiveis[selectedPeriod]?.inicio === periodo.inicio && '•'}
                                    </PeriodButton>
                                ))}
                            </ButtonsContainer>
                        </Periodos>
                                {
                                    selectedPeriod >= 0 && feriasSelecionadas.length === 0 && vacationInfo &&
                                    <>
                                        <VacationPeriod>
                                            <h2>Não há períodos de férias agendados</h2>
                                        <button> Data Limite Para Férias No Período - {feriasDisponiveis[selectedPeriod].limite} </button>
                                        </VacationPeriod>
                                        <TotalContainer>
                                            <h2>Dias Agendados ou Finalizados:<br /> 0dias </h2>
                                            <h2> / </h2>
                                            <h2>Dias Restantes no Período: <br />{vacationInfo?.Contratos?.diasFerias} dias</h2>
                                        </TotalContainer>
                                    </>
                                }
                                {feriasDisponiveis && selectedPeriod >= 0 && feriasSelecionadas.length !== 0 &&
                                    <>
                                        <VacationPeriod>
                                            <VacationTable>
                                                <div>
                                                    <p><span>Início</span></p>
                                                    <p><span>Fim</span></p>
                                                    <p><span>Total</span></p>
                                                </div>
                                                {feriasSelecionadas?.map((f, i) => (
                                                    <div key={i}>
                                                        <p>{formatarDataBR(f.inicio)}</p>
                                                        <p>{formatarDataBR(f.fim)}</p>
                                                        <p>{f.totalDias}</p>
                                                    </div>
                                                ))}
                                            </VacationTable>
                                            <button> Data Limite Para Férias No Período - {feriasDisponiveis[selectedPeriod].limite} </button>
                                        </VacationPeriod>
                                        <TotalContainer>
                                            <h2>Dias Agendados ou Finalizados:<br /> {feriasSelecionadas.map(v => v.totalDias).reduce((acc, val) => acc + val, 0)} dias </h2>
                                            <h2> / </h2>
                                            <h2>Dias Restantes no Período: <br />{vacationInfo?.Contratos?.diasFerias - feriasSelecionadas.map(v => v.totalDias).reduce((acc, val) => acc + val, 0)} dias</h2>
                                        </TotalContainer>
                                    </>
                                }
                        
                </VacationContiner>
                </>
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

const AdminButton = styled.button`
    top: 2%;
    right: 2%;
    position: absolute;
    font-size: 16px;
    justify-content: center;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: #ED1F4C;
    color: white;
    &:hover {
        background-color: #ED1F4C;
    }
`;

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

const VacationContiner = styled.div`
    width: 65%;
    min-width: 700px;
    flex-direction: column;
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
        &:hover {
            background-color: white;
            color: #ff5843;
            border: 2px solid #ff5843;
    };
    }
`

const Periodos = styled.div`
    align-items: flex-end;
    margin: 10px 0 15px 0;
    h2{
        color: #ED1F4C;
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
        // &:hover {
        //     background-color: ${({ active }) => (active === 'show' ? "#ff5843" : "white")
        // }
    }
`

const VacationPeriod = styled.div`
    width: 100%;
    gap: 8% !important;
    margin-bottom: 20px;
    align-items: center;
    justify-content: center;
    h2{
        color: grey;
    }
    div {
        margin-bottom: 0 !important;
    }
    button{
        height: 70px;
        font-size: 17px;
        width: 180px;
        cursor: default;
        background-color:transparent;
        color: #ff5843;
    }
`

const VacationTable = styled.div`
    width:  70%;  
    flex-direction: column;
    justify-content: space-between;
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
    }
    span{
        font-weight: 700;
    }
`
const ButtonsContainer = styled.div`
    justify-content: center;
    gap: 50px;
`

const PeriodButton = styled.button`
    text-align: center;
    width: 250px;
    justify-content: center;
    font-weight: 700;
    font-size: 15px;
    background-color: ${({ active }) => (active  === 'show' ? "#ff5843" : "transparent")};
    color: ${({ active }) => (active === 'show' ? "white" : "#ff5843")};
    border: ${({ active }) => (active === 'show' ? "3px solid #ff5843" : "3px solid #ff5843")};
    &:hover {
        background-color: ${({ active }) => (active === 'show' ? "#ff5843" : "white")
    };
`;

const TotalContainer = styled.div`
        color: gray;
        h2{
            font-size: 18px;
            font-weight: 500;
        }
`