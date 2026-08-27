import { useMemo } from 'react';
import styled from 'styled-components';
import useSortableData from '../../hooks/useSortableData';
import SortableFieldButtonComponent from '../basic/SortableFieldButtonComponent';

const FERIAS_COLUMNS = [
    { field: 'nome', label: 'Nome' },
    { field: 'inicio', label: 'Início' },
    { field: 'fim', label: 'Fim' },
    { field: 'totalDias', label: 'Total' },
    { field: 'referenteInicio', label: 'Referente Início' },
    { field: 'referenteFim', label: 'Referente Fim' },
    { field: 'status', label: 'Status' },
];

const LICENCAS_COLUMNS = [
    { field: 'nome', label: 'Nome' },
    { field: 'tipo', label: 'Tipo' },
    { field: 'inicio', label: 'Início' },
    { field: 'fim', label: 'Fim' },
    { field: 'totalDias', label: 'Total' },
];

function formatarDataBR(dataIso) {
    const data = new Date(dataIso);
    const [ano, mes, dia] = data.toISOString().slice(0, 10).split("-");
    return `${dia}/${mes}/${ano}`;
}

function VacationsListGestorComponent({filteredData, activeButton}) {
    // Datas em ISO (YYYY-MM-DD) ordenam corretamente como texto, então não precisam de comparador customizado.
    const feriasRows = useMemo(() => {
        const rows = [];
        filteredData?.forEach((d) => {
            d.Ferias?.forEach((f) => {
                rows.push({
                    nome: `${d.nome} ${d.sobrenome}`,
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
                    tipo: f.tipo,
                    inicio: f.inicio,
                    fim: f.fim,
                    totalDias: f.totalDias,
                });
            });
        });
        return rows;
    }, [filteredData]);

    const {
        sortedItems: feriasOrdenadas,
        requestSort: requestFeriasSort,
        getSortDirection: getFeriasSortDirection,
    } = useSortableData(feriasRows, { field: 'nome', direction: 'asc' });

    const {
        sortedItems: licencasOrdenadas,
        requestSort: requestLicencasSort,
        getSortDirection: getLicencasSortDirection,
    } = useSortableData(licencasRows, { field: 'nome', direction: 'asc' });

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
                        </div>
                        {feriasOrdenadas.map((f, i) => (
                            <div key={i}>
                                <p>{f.nome}</p>
                                <p>{formatarDataBR(f.inicio)}</p>
                                <p>{formatarDataBR(f.fim)}</p>
                                <p>{f.totalDias}</p>
                                <p>{formatarDataBR(f.referenteInicio)}</p>
                                <p>{formatarDataBR(f.referenteFim)}</p>
                                <p>{f.status}</p>
                            </div>
                        ))}
                    </VacationTable>
                : <h3>Sem Ferias nesta busca</h3>}
            <br/>
            <h2>Licenças</h2>
            {licencasRows.length > 0 ?
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
                    {licencasOrdenadas.map((f, i) => (
                        <div key={i}>
                            <p>{f.nome}</p>
                            <p>{f.tipo}</p>
                            <p>{formatarDataBR(f.inicio)}</p>
                            <p>{formatarDataBR(f.fim)}</p>
                            <p>{f.totalDias}</p>
                        </div>
                    ))}
                </VacationTable>
                : <h3>Sem licenças nesta busca</h3>}
        </PageContainer>
    )
}

export default VacationsListGestorComponent;

const PageContainer = styled.div`
    width: 100%;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    h2{
        color: #0057E1;
        margin: 10px 0;
    }
    h3{
        color: gray;
        margin-bottom: 30px;
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
`
