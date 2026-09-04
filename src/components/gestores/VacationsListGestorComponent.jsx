import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { FaCircleInfo } from "react-icons/fa6";
import useSortableData from '../../hooks/useSortableData';
import SortableFieldButtonComponent from '../basic/SortableFieldButtonComponent';

const FERIAS_COLUMNS = [
    { field: 'nome', label: 'Nome' },
    { field: 'tipoContrato', label: 'Contrato' },
    { field: 'inicio', label: 'Início' },
    { field: 'fim', label: 'Fim' },
    { field: 'totalDias', label: 'Dias' },
    { field: 'status', label: 'Status' },
];

const LICENCAS_COLUMNS = [
    { field: 'nome', label: 'Nome' },
    { field: 'tipoContrato', label: 'Contrato' },
    { field: 'tipo', label: 'Tipo' },
    { field: 'inicio', label: 'Início' },
    { field: 'fim', label: 'Fim' },
    { field: 'totalDias', label: 'Total Dias' },
    { field: 'status', label: 'Status' },
];

// Cores fixas por tipo de contrato, pra bater visualmente com o resto do sistema.
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

// Heurística por palavra-chave: cobre os status de férias (Aprovado/Reprovado/Concluído/Solicitado...)
// e os de licença (Em Andamento/Finalizado) com a mesma função.
function getStatusStyle(status) {
    const s = (status || '').toLowerCase();
    if (s.includes('reprovado')) return { bg: '#fdecea', color: '#c0392b', border: '#c0392b' };
    if (s.includes('conclu') || s.includes('finalizado')) return { bg: '#eef1f4', color: '#5b6b79', border: '#9aa7b2' };
    if (s.includes('aprovado')) return { bg: '#e8f8ef', color: '#1e8e5a', border: '#1e8e5a' };
    if (s.includes('andamento')) return { bg: '#e8f0ff', color: '#0057E1', border: '#0057E1' };
    return { bg: '#fff8e6', color: '#b8860b', border: '#d4a017' }; // pendente/solicitado/outros
}

function formatarDataBR(dataIso) {
    if (!dataIso) return "-";
    const data = new Date(dataIso);
    const [ano, mes, dia] = data.toISOString().slice(0, 10).split("-");
    return `${dia}/${mes}/${ano}`;
}

function getStatusLicenca(fim) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataFim = new Date(fim);
    dataFim.setHours(0, 0, 0, 0);
    return dataFim < hoje ? "Finalizado" : "Em Andamento";
}

function VacationsListGestorComponent({filteredData, activeButton}) {
    const [detalhes, setDetalhes] = useState(null); //férias selecionada pro modal de detalhes
    const [showFinalizadas, setShowFinalizadas] = useState(false); //exibir ou não licenças já finalizadas

    // Datas em ISO (YYYY-MM-DD) ordenam corretamente como texto, então não precisam de comparador customizado.
    const feriasRows = useMemo(() => {
        const rows = [];
        filteredData?.forEach((d) => {
            d.Ferias?.forEach((f) => {
                rows.push({
                    nome: `${d.nome} ${d.sobrenome}`,
                    tipoContrato: d.Contratos?.tipo,
                    admissao: d.admissao,
                    inicio: f.inicio,
                    fim: f.fim,
                    totalDias: f.totalDias,
                    referenteInicio: f.referenteInicio,
                    referenteFim: f.referenteFim,
                    status: f.status,
                });
            });
        });
        return rows;
    }, [filteredData]);

    const licencasRows = useMemo(() => {
        const rows = [];
        filteredData?.forEach((d) => {
            d.Licencas?.forEach((f) => {
                rows.push({
                    nome: `${d.nome} ${d.sobrenome}`,
                    tipoContrato: d.Contratos?.tipo,
                    tipo: f.tipo,
                    inicio: f.inicio,
                    fim: f.fim,
                    totalDias: f.totalDias,
                    status: getStatusLicenca(f.fim),
                });
            });
        });
        return rows;
    }, [filteredData]);

    const licencasVisiveis = useMemo(() => {
        if (showFinalizadas) return licencasRows;
        return licencasRows.filter((f) => f.status !== "Finalizado");
    }, [licencasRows, showFinalizadas]);

    const {
        sortedItems: feriasOrdenadas,
        requestSort: requestFeriasSort,
        getSortDirection: getFeriasSortDirection,
    } = useSortableData(feriasRows, { field: 'nome', direction: 'asc' });

    const {
        sortedItems: licencasOrdenadas,
        requestSort: requestLicencasSort,
        getSortDirection: getLicencasSortDirection,
    } = useSortableData(licencasVisiveis, { field: 'nome', direction: 'asc' });

    return (
        <PageContainer>
            {activeButton === "Funcionário" &&<h2>Admissão: {formatarDataBR(filteredData[0].admissao) } • Tipo Contrato: {filteredData[0].Contratos.tipo} • Dias Ferias: {filteredData[0].Contratos.diasFerias}</h2> }
            <h2>Férias</h2>
            {feriasRows.length > 0 ?
                    <VacationTable>
                        <div>
                            {FERIAS_COLUMNS.map(({ field, label }) => (
                                <p key={field}>
                                    <SortableFieldButtonComponent
                                        variant="plain"
                                        label={label}
                                        direction={getFeriasSortDirection(field)}
                                        onClick={() => requestFeriasSort(field)}
                                    />
                                </p>
                            ))}
                            <p><span>Detalhes</span></p>
                        </div>
                        {feriasOrdenadas.map((f, i) => {
                            const contratoStyle = getContratoStyle(f.tipoContrato);
                            const statusStyle = getStatusStyle(f.status);
                            return (
                                <div key={i}>
                                    <p>{f.nome}</p>
                                    <p>
                                        {f.tipoContrato &&
                                            <Tag $bg={contratoStyle.bg} $color={contratoStyle.color} $border={contratoStyle.border}>
                                                {f.tipoContrato}
                                            </Tag>
                                        }
                                    </p>
                                    <p>{formatarDataBR(f.inicio)}</p>
                                    <p>{formatarDataBR(f.fim)}</p>
                                    <p>{f.totalDias}</p>
                                    <p>
                                        {f.status &&
                                            <Tag $bg={statusStyle.bg} $color={statusStyle.color} $border={statusStyle.border}>
                                                {f.status}
                                            </Tag>
                                        }
                                    </p>
                                    <p onClick={() => setDetalhes(f)}><FaCircleInfo /></p>
                                </div>
                            );
                        })}
                    </VacationTable>
                : <h3>Sem Ferias nesta busca</h3>}
            <br/>
            <h2>Licenças</h2>
            {licencasRows.length > 0 ?
                <>
                    {licencasOrdenadas.length > 0 ?
                        <VacationTable>
                            <div>
                                {LICENCAS_COLUMNS.map(({ field, label }) => (
                                    <p key={field}>
                                        <SortableFieldButtonComponent
                                            variant="plain"
                                            label={label}
                                            direction={getLicencasSortDirection(field)}
                                            onClick={() => requestLicencasSort(field)}
                                        />
                                    </p>
                                ))}
                            </div>
                            {licencasOrdenadas.map((f, i) => {
                                const contratoStyle = getContratoStyle(f.tipoContrato);
                                const statusStyle = getStatusStyle(f.status);
                                return (
                                    <div key={i}>
                                        <p>{f.nome}</p>
                                        <p>
                                            {f.tipoContrato &&
                                                <Tag $bg={contratoStyle.bg} $color={contratoStyle.color} $border={contratoStyle.border}>
                                                    {f.tipoContrato}
                                                </Tag>
                                            }
                                        </p>
                                        <p>{f.tipo}</p>
                                        <p>{formatarDataBR(f.inicio)}</p>
                                        <p>{formatarDataBR(f.fim)}</p>
                                        <p>{f.totalDias}</p>
                                        <p>
                                            <Tag $bg={statusStyle.bg} $color={statusStyle.color} $border={statusStyle.border}>
                                                {f.status}
                                            </Tag>
                                        </p>
                                    </div>
                                );
                            })}
                        </VacationTable>
                        : <h3>Nenhuma licença em andamento nesta busca</h3>
                    }
                    <ToggleFinalizadasButton
                        type="button"
                        $active={showFinalizadas}
                        onClick={() => setShowFinalizadas((prev) => !prev)}
                    >
                        {showFinalizadas ? "Ocultar licenças finalizadas" : "Mostrar licenças finalizadas"}
                    </ToggleFinalizadasButton>
                </>
                : <h3>Sem licenças nesta busca</h3>}

            {detalhes &&
                <Overlay onClick={() => setDetalhes(null)}>
                    <ModalBox onClick={(e) => e.stopPropagation()}>
                        <CloseButton onClick={() => setDetalhes(null)}>✖</CloseButton>
                        <h3>{detalhes.nome}</h3>
                        <DetalhesList>
                            <li><span>Admissão</span><strong>{formatarDataBR(detalhes.admissao)}</strong></li>
                            <li><span>Referente Início</span><strong>{formatarDataBR(detalhes.referenteInicio)}</strong></li>
                            <li><span>Referente Fim</span><strong>{formatarDataBR(detalhes.referenteFim)}</strong></li>
                        </DetalhesList>
                    </ModalBox>
                </Overlay>
            }
        </PageContainer>
    )
}

export default VacationsListGestorComponent;

const PageContainer = styled.div`
    width: 100%;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin-bottom: 50px;
    h2{
        color: #0057E1;
        margin: 10px 0;
    }
    h3{
        color: gray;
    }
`

const VacationTable = styled.div`
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    gap: 4px;
    color: #0057E1;
    div {
        margin-bottom: 0 !important;
        align-items: center;
        gap: 10px;
        min-height: 44px;
        border-bottom: 1px solid #e2e4e8;
        padding: 6px 4px;
    }
    div:first-of-type {
        border-bottom: 2px solid #0057E1;
    }
    p{
        flex: 1;
        min-width: 0;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &:nth-of-type(1) {
            flex: 1.6;
            text-align: left;
        }
    }
    div:first-of-type p {
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: visible;
        &:nth-of-type(1) {
            justify-content: flex-start;
        }
    }
    span{
        font-weight: 700;
        white-space: normal;
    }
    svg{
        cursor: pointer;
        font-size: 20px;
    }
`

const ToggleFinalizadasButton = styled.button`
    align-self: center;
    margin-top: 10px;
    padding: 8px 20px;
    font-size: 14px;
    font-weight: 600;
    border-radius: 999px;
    border: 1px solid #0057E1;
    background: ${({ $active }) => ($active ? '#0057E1' : '#fff')};
    color: ${({ $active }) => ($active ? '#fff' : '#0057E1')};

    &:hover {
        background: ${({ $active }) => ($active ? '#0046ba' : '#eef4ff')};
    }
`

const Tag = styled.span`
    display: inline-flex;
    padding: 5px 14px;
    font-size: 15px;
    font-weight: 700;
    border-radius: 999px;
    border: 1px solid ${({ $border }) => $border};
    color: ${({ $color }) => $color};
    background: ${({ $bg }) => $bg};
    white-space: nowrap;
`

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    justify-content: center;
    align-items: center;
    z-index: 20;
`

const ModalBox = styled.div`
    position: relative;
    width: 90%;
    max-width: 380px;
    background: white;
    border-radius: 14px;
    padding: 28px 26px;
    flex-direction: column;
    gap: 18px;
    color: #333;
    h3 {
        text-align: center;
        color: #0057E1;
    }
`

const CloseButton = styled.button`
    position: absolute;
    top: 14px;
    right: 14px;
    width: 30px;
    height: 30px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: #f1f1f1;
    color: #888;
    font-size: 14px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    &:hover {
        background: #0057E1;
        color: white;
    }
`

const DetalhesList = styled.ul`
    display: flex;
    flex-direction: column;
    gap: 18px;
    li {
        display: flex;
        flex-direction: column;
        gap: 4px;
        border-bottom: 1px solid #eee;
        padding-bottom: 14px;
        span {
            color: #888;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.4px;
        }
        strong {
            color: #333;
            font-size: 18px;
            font-weight: 500;
        }
    }
`
