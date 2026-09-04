import styled from 'styled-components';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';
import gerarFerias from "../services/vacationGenerate";
import { FaEdit } from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";
import CriarFeriasComponent from '../components/vacations/CriarFeriasComponent';
import EditarFeriasComponent from '../components/vacations/EditarFeriasComponent';
import HeaderGGNewComponent from '../components/gentegestao/HeaderGGNewComponent';

// Cores fixas por tipo de contrato, mesmo padrão usado na lista de filtrar férias dos gestores.
const CONTRATO_STYLES = {
    CLT: { bg: '#e8f0ff', color: '#0057E1', border: '#0057E1' },
    'ESTÁGIO': { bg: '#f5ecff', color: '#7b2cbf', border: '#7b2cbf' },
    PJ: { bg: '#e6f7f0', color: '#0f9d78', border: '#0f9d78' },
    COOPERADO: { bg: '#fff4e5', color: '#c77400', border: '#c77400' },
};
const DEFAULT_TAG_STYLE = { bg: '#f1f1f1', color: '#555', border: '#ccc' };

function getContratoStyle(tipo) {
    return CONTRATO_STYLES[tipo?.toUpperCase()] ?? DEFAULT_TAG_STYLE;
}

// Heurística por palavra-chave: mesmos status usados na lista de filtrar férias (Aprovado/Reprovado/Concluído/Solicitado...).
function getStatusStyle(status) {
    const s = (status || '').toLowerCase();
    if (s.includes('reprovado')) return { bg: '#fdecea', color: '#c0392b', border: '#c0392b' };
    if (s.includes('conclu')) return { bg: '#eef1f4', color: '#5b6b79', border: '#9aa7b2' };
    if (s.includes('aprovado')) return { bg: '#e8f8ef', color: '#1e8e5a', border: '#1e8e5a' };
    if (s.includes('andamento')) return { bg: '#e8f0ff', color: '#0057E1', border: '#0057E1' };
    return { bg: '#fff8e6', color: '#b8860b', border: '#d4a017' }; // pendente/solicitado/outros
}

// Tag de uso do período aquisitivo: quantos dias já foram agendados nele.
function getPeriodoUsageStyle(diasUsados, diasTotais) {
    if (!diasTotais) return DEFAULT_TAG_STYLE;
    if (diasUsados <= 0) return { label: 'Disponível', bg: '#e8f8ef', color: '#1e8e5a', border: '#1e8e5a' };
    if (diasUsados >= diasTotais) return { label: 'Totalmente utilizado', bg: '#eef1f4', color: '#5b6b79', border: '#9aa7b2' };
    return { label: `${diasUsados}/${diasTotais} dias usados`, bg: '#fff0e9', color: '#ff5843', border: '#ff5843' };
}

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
                setAgendarFerias(false);
                setEditarFerias([]);
                setUpdated(false);
            }
        }
        fetchData();
    }, [user, carregando, updated]);

    function formatarDataBR(dataIso) {
        const data = new Date(dataIso);
        const [ano, mes, dia] = data.toISOString().slice(0, 10).split("-");
        return `${dia}/${mes}/${ano}`;
    }

    // Resumo de dias já usados em cada período aquisitivo, pra exibir a tag nos cards de seleção.
    const periodosResumo = useMemo(() => {
        if (!vacationInfo || !feriasDisponiveis) return [];
        return feriasDisponiveis.map((periodo) => {
            const feriasDoPeriodo = vacationInfo.Ferias?.filter((f) => formatarDataBR(f.referenteInicio) === periodo.inicio) ?? [];
            const diasUsados = feriasDoPeriodo.reduce((acc, f) => acc + f.totalDias, 0);
            return { diasUsados };
        });
    }, [vacationInfo, feriasDisponiveis]);

    // gerarFerias monta os períodos do mais antigo pro mais recente; exibimos invertido, mantendo o índice original.
    const periodosParaExibir = useMemo(() => {
        if (!feriasDisponiveis) return [];
        return feriasDisponiveis.map((periodo, index) => ({ periodo, index })).reverse();
    }, [feriasDisponiveis]);

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

    const contratoStyle = getContratoStyle(vacationInfo?.Contratos?.tipo);
    const restantesNoPeriodo = (vacationInfo?.Contratos?.diasFerias ?? 0) - diasAgendados;

    return (
        <PageContainer>
            <HeaderGGNewComponent  pageTitle={`Minhas Férias`} />
            {vacationInfo &&
                <>
                    <EmployeeInfo>
                        <InfoTag $bg="#fdecef" $color="#ED1F4C" $border="#ED1F4C">Admissão: {admissao}</InfoTag>
                        {vacationInfo?.Contratos?.tipo &&
                            <InfoTag $bg={contratoStyle.bg} $color={contratoStyle.color} $border={contratoStyle.border}>
                                {vacationInfo.Contratos.tipo}
                            </InfoTag>
                        }
                        <InfoTag $bg="#fdecef" $color="#ED1F4C" $border="#ED1F4C">Total Anual: {vacationInfo?.Contratos?.diasFerias} dias</InfoTag>
                    </EmployeeInfo>

                    <ExplorerContainer>
                        <ListPanel>
                            <ListPanelTitle>Períodos Aquisitivos</ListPanelTitle>
                            {periodosParaExibir.map(({ periodo, index }) => {
                                const usoStyle = getPeriodoUsageStyle(periodosResumo[index]?.diasUsados ?? 0, vacationInfo?.Contratos?.diasFerias);
                                return (
                                    <PeriodListItem key={index} onClick={() => selecionarFeriasPorInicio(periodo.inicio, index)} $active={selectedPeriod === index}>
                                        <PeriodRange>{periodo.inicio} - {periodo.fim}</PeriodRange>
                                        <Tag $bg={usoStyle.bg} $color={usoStyle.color} $border={usoStyle.border}>
                                            {usoStyle.label}
                                        </Tag>
                                    </PeriodListItem>
                                );
                            })}
                            
                        </ListPanel>
                        <DetailsPanel>
                            {agendarFerias ?
                                <CriarFeriasComponent selected={feriasDisponiveis[selectedPeriod]} info={vacationInfo} setUpdated={setUpdated} setAgendarFerias={setAgendarFerias} />
                                : editarFerias.length !== 0 ?
                                <EditarFeriasComponent selected={feriasDisponiveis[selectedPeriod]} toEdit={editarFerias} info={vacationInfo} setUpdated={setUpdated} setEditarFerias={setEditarFerias} />
                                : selectedPeriod >= 0 ?
                                    <>
                                        <VacationPeriod>
                                            {feriasSelecionadas.length === 0 ?
                                                <EmptyPeriodState>
                                                    <h2>Não há períodos de férias agendados</h2>
                                                    <ButtonsCreateContainer>
                                                        {diasAgendados < vacationInfo?.Contratos?.diasFerias && <PeriodButton onClick={() => setAgendarFerias(true)}> Nova Solicitação</PeriodButton>}
                                                        <InfoBadge>
                                                            Data Limite Para Agendamento
                                                            <strong>{feriasDisponiveis[selectedPeriod].limite}</strong>
                                                        </InfoBadge>
                                                    </ButtonsCreateContainer>
                                                </EmptyPeriodState>
                                                :
                                                <>
                                                    <VacationTable>
                                                        <div>
                                                            <p><span>Início</span></p>
                                                            <p><span>Fim</span></p>
                                                            <p><span>Total</span></p>
                                                            <p><span>Status</span></p>
                                                            <p><span>Ação</span></p>
                                                        </div>
                                                        {feriasSelecionadas?.map((f, i) => {
                                                            const statusStyle = getStatusStyle(f.status);
                                                            const editavel = new Date(f.inicio) > hoje;
                                                            return (
                                                                <div key={i}>
                                                                    <p>{formatarDataBR(f.inicio)}</p>
                                                                    <p>{formatarDataBR(f.fim)}</p>
                                                                    <p>{f.totalDias}</p>
                                                                    <p>
                                                                        <Tag $bg={statusStyle.bg} $color={statusStyle.color} $border={statusStyle.border}>
                                                                            {f.status}
                                                                        </Tag>
                                                                    </p>
                                                                    <p>
                                                                        {editavel
                                                                            ? <ActionButton $variant="edit" onClick={() => setEditarFerias(f)} title="Editar"><FaEdit /></ActionButton>
                                                                            : <ActionButton $variant="locked" disabled title="Período já iniciado"><MdLockOutline /></ActionButton>
                                                                        }
                                                                    </p>
                                                                </div>
                                                            );
                                                        })}
                                                    </VacationTable>
                                                    <ButtonsCreateContainer>
                                                        {diasAgendados < vacationInfo?.Contratos?.diasFerias && <PeriodButton onClick={() => setAgendarFerias(true)}> Nova Solicitação</PeriodButton>}
                                                        <InfoBadge>
                                                            Data Limite Para Agendamento
                                                            <strong>{feriasDisponiveis[selectedPeriod].limite}</strong>
                                                        </InfoBadge>
                                                    </ButtonsCreateContainer>
                                                </>
                                            }
                                        </VacationPeriod>
                                        <TotalContainer>
                                            <StatCard $color="#ff5843">
                                                <span>{diasAgendados - diasConcluidos}</span>
                                                Agendados/Solicitados
                                            </StatCard>
                                            <StatCard $color="#5b6b79">
                                                <span>{diasConcluidos}</span>
                                                Concluídos/Finalizados
                                            </StatCard>
                                            <StatCard $color={restantesNoPeriodo > 0 ? "#1e8e5a" : "#c0392b"}>
                                                <span>{restantesNoPeriodo}</span>
                                                Restantes
                                            </StatCard>
                                        </TotalContainer>
                                    </>
                                    : <EmptyState>Selecione um período aquisitivo na lista ao lado.</EmptyState>
                            }
                        </DetailsPanel>
                    </ExplorerContainer>
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

const ButtonsCreateContainer = styled.div`
    flex-direction: column;
    width: 200px;
    height: 100%;
    align-items: center;
    gap: 12px;
`

const EmployeeInfo = styled.div`
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    margin: 5px 0;
`

const InfoTag = styled.span`
    display: inline-flex;
    padding: 6px 16px;
    font-size: 14px;
    font-weight: 700;
    border-radius: 999px;
    border: 1px solid ${({ $border }) => $border};
    color: ${({ $color }) => $color};
    background: ${({ $bg }) => $bg};
    white-space: nowrap;
`

const ExplorerContainer = styled.div`
    width: 90%;
    margin-bottom: 40px;
    border: 1px solid #e2c3cb;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
    align-items: stretch;

    @media (max-width: 800px) {
        flex-direction: column;
    }
`

const ListPanel = styled.div`
    width: 360px;
    flex-shrink: 0;
    flex-direction: column;
    gap: 20px;
    padding: 18px;
    border-right: 1px solid #f0dbe0;
    background: #fff8f9;
    overflow-y: auto;
    max-height: 1000px;
    box-sizing: border-box;

    @media (max-width: 800px) {
        width: 100%;
        max-height: none;
        border-right: none;
        border-bottom: 1px solid #f0dbe0;
    }
`

const ListPanelTitle = styled.h2`
    color: #ED1F4C;
    font-size: 17px;
    margin: 4px 0 6px 0;
`

const PeriodListItem = styled.div`
    width: 90%;
    align-self: center;
    box-sizing: border-box;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding: 12px 14px;
    border-radius: 12px;
    cursor: pointer;
    background: ${({ $active }) => ($active ? "#ED1F4C" : "#ffffff")};
    color: ${({ $active }) => ($active ? "#ffffff" : "#333")};
    border: 1px solid ${({ $active }) => ($active ? "#ED1F4C" : "#eadfe1")};
    transition: 0.2s;

    &:hover {
        background: ${({ $active }) => ($active ? "#c81a41" : "#fdecef")};
    }
`

const PeriodRange = styled.span`
    font-weight: 700;
    font-size: 14px;
    color: inherit;
`

const DetailsPanel = styled.div`
    flex: 1;
    min-width: 0;
    flex-direction: column;
    gap: 20px;
    padding: 24px;
    box-sizing: border-box;
    overflow-x: hidden;
`

const EmptyState = styled.div`
    width: 100%;
    justify-content: center;
    align-items: center;
    padding: 40px 0;
    color: #888;
`

const VacationPeriod = styled.div`
    width: 100%;
    gap: 20px;
    align-items: flex-start;
    flex-wrap: wrap;
    h2{
        color: grey;
        width: 100%;
        margin: 0;
    }
`

const EmptyPeriodState = styled.div`
    width: 100%;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    padding: 30px 0;
`

const VacationTable = styled.div`
    flex: 1;
    min-width: 320px;
    flex-direction: column;
    gap: 4px;
    color: #ED1F4C;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid #eee;
    box-shadow: 0px 2px 6px 0px #00000012;
    div {
        margin-bottom: 0 !important;
        align-items: center;
        min-height: 48px;
        height: 48px;
        border-bottom: 1px solid #e2e4e8;
        padding: 0 10px;
    }
    div:first-of-type {
        background: #fdecef;
        border-bottom: 2px solid #ED1F4C;
    }
    div:last-of-type {
        border-bottom: none;
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
const PeriodButton = styled.button`
    text-align: center;
    width: 200px;
    justify-content: center;
    font-weight: 700;
    font-size: 15px;
    padding: 12px 15px;
    border: none;
    border-radius: 999px;
    color: white;
    background: linear-gradient(135deg, #ff5843, #ED1F4C);
    box-shadow: 0 6px 16px rgba(237, 31, 76, 0.3);
    transition: transform 0.15s ease, box-shadow 0.15s ease;

    &:hover {
        background: linear-gradient(135deg, #ff5843, #ED1F4C);
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(237, 31, 76, 0.4);
    }
`;

const InfoBadge = styled.div`
    flex-direction: column;
    align-self: center;
    width: fit-content;
    text-align: center;
    align-items: center;
    gap: 2px;
    padding: 8px 10px;
    border-radius: 14px;
    font-size: 12px;
    color: #b8860b;
    background: #fff8e6;
    border: 1px solid #d4a017;
    strong {
        margin-top: 10px;
        font-size: 15px;
    }
`;

const Tag = styled.span`
    display: inline-flex;
    padding: 5px 14px;
    font-size: 14px;
    font-weight: 700;
    border-radius: 999px;
    border: 1px solid ${({ $border }) => $border};
    color: ${({ $color }) => $color};
    background: ${({ $bg }) => $bg};
    white-space: nowrap;
`

const ACTION_VARIANTS = {
    edit: { color: '#ED1F4C', bg: '#fdecef', hoverBg: '#ED1F4C' },
    locked: { color: '#9aa7b2', bg: '#eef1f4', hoverBg: '#eef1f4' },
};

const ActionButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    margin: 0 auto;
    border-radius: 50%;
    border: 1px solid ${({ $variant }) => ACTION_VARIANTS[$variant].color};
    background: ${({ $variant }) => ACTION_VARIANTS[$variant].bg};
    color: ${({ $variant }) => ACTION_VARIANTS[$variant].color};
    cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
    transition: 0.2s;
    padding: 0;

    svg {
        font-size: 15px;
    }

    &:hover {
        background: ${({ $variant, disabled }) => (disabled ? ACTION_VARIANTS[$variant].bg : ACTION_VARIANTS[$variant].hoverBg)};
        color: ${({ disabled }) => (disabled ? 'inherit' : '#fff')};
    }
`

const TotalContainer = styled.div`
    gap: 16px;
    flex-wrap: wrap;
    justify-content: center;
`

const StatCard = styled.div`
    flex-direction: column;
    width: 180px;
    gap: 6px;
    padding: 16px 10px;
    font-size: 14px;
    line-height: 20px;
    align-items: center;
    text-align: center;
    color: #555;
    border-radius: 14px;
    border-left: 6px solid ${({ $color }) => $color};
    box-shadow: 0px 2px 6px 0px #00000015;
    background: #fff;
    span {
        font-size: 26px;
        font-weight: 700;
        color: ${({ $color }) => $color};
    }
`
