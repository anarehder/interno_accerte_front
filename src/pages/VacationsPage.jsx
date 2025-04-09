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
    const [inicioRef, setInicioRef] = useState(null);

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
            }
        }
        fetchData();
    }, [user, carregando]);

    const selecionarFeriasPorInicio = (dataRef) => {
        setInicioRef(dataRef);
        const feriasFiltradas = vacationInfo.Ferias.filter((f) => {
            return formatarDataBR(f.referenteInicio) === dataRef;
        });

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
            limiteFerias.setDate(fimFerias.getDate() - 31);

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
                    <h2>Períodos Aquisitivos <br/>de Férias:</h2>
                    <div>
                        {feriasDisponiveis.map((periodo, index) => (
                            <button key={index} onClick={() => selecionarFeriasPorInicio(periodo.inicio)} active={inicioRef === periodo.inicio ? "show" : ""}>
                                {`${periodo.inicio} - ${periodo.fim}`}
                            </button>
                        ))}
                    </div>
                    </Periodos>
                        {inicioRef &&
                            <VacationPeriod>
                                <VacationTable>
                                    <div>
                                        <p><span>Início</span></p>
                                        <p><span>Fim</span></p>
                                        <p><span>Total</span></p>
                                    </div>
                                    {inicioRef && feriasSelecionadas.map((f, i) => (
                                        <div key={i}>
                                            <p>{formatarDataBR(f.inicio)}</p>
                                            <p>{formatarDataBR(f.fim)}</p>
                                            <p>{f.totalDias}</p>
                                        </div>
                                    ))}
                                </VacationTable>
                                {/* <VacationButtons> */}
                                    {/* <button> Data Limite - {feriasDisponiveis[index-1].limite} </button> */}
                                    {/* <button> Agendar Férias </button> */}
                                    {/* <button> Alterar Férias</button> */}
                                {/* </VacationButtons> */}
                            </VacationPeriod>
                        }
                        <div>
                            <h2>Dias Agendados ou Finalizados:<br/> {feriasSelecionadas.map(v => v.totalDias).reduce((acc, val) => acc + val, 0)} dias </h2>
                            <h2> / </h2>
                            <h2>Dias Restantes no Período: <br/>{vacationInfo?.Contratos?.diasFerias - feriasSelecionadas.map(v => v.totalDias).reduce((acc, val) => acc + val, 0)} dias</h2>
                        </div>
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
    // background-color: red;
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
    // div:first-of-type {
    //     margin-bottom: 20px;
    //     background-color: red;
    // }
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
        &:hover {
            background-color: ${({ active }) => (active === 'show' ? "#ff5843" : "white")
        }
    }
`

const VacationPeriod = styled.div`
    width: 100%;
    gap: 8% !important;
    margin-bottom: 20px;
    div {
        margin-bottom: 0 !important;
    }
`

const VacationTable = styled.div`
    width:  70%;  
    flex-direction: column;
    justify-content: space-between;
    gap: 10px;
    div {
        margin-bottom: 0 !important;
        align-items: center;
        min-height: 40px;
        border-bottom: 2px solid gray;
    }
    p{
        text-align: center;
        width: 25%;
    }
    span{
        font-weight: 700;
    }
`

const VacationButtons = styled.div`
    width: 15%;   
    flex-direction: column;
    gap: 40px;
    align-items: center;
    button {
        text-align: center;
        word-break: break-word;
        background-color:#ff5843;
        width: 150px;
    }
`