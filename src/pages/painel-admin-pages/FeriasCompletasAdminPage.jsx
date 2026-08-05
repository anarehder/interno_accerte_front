import { useEffect, useMemo, useState } from "react";
import styled from 'styled-components';
import apiService from "../../services/apiService";
import { useAuth } from "../../contexts/AuthContext";
import VacationsListComponent from "../../components/vacations/VacationsListComponent";
import HeaderGGNewComponent from "../../components/gentegestao/HeaderGGNewComponent";

function FeriasCompletasAdminPage(){
    const { dados } = useAuth();
    const [allData, setAllData] = useState([]); //resposta da req, ordenada por nome, sem filtro de status
    const [selectedStatus, setSelectedStatus] = useState(["Aprovado RH"]); //status selecionados no filtro
    const [carregando, setCarregando] = useState(true);
    const [noData, setNoData] = useState(false);

    const buscarFerias = async () => {
        setCarregando(true);
        try {
            const response = await apiService.getVacationByPeriod("2020-01-01", "2050-01-01");
            const ordenado = [...response.data].sort((a, b) =>
                `${a.nome} ${a.sobrenome}`.localeCompare(`${b.nome} ${b.sobrenome}`, 'pt-BR', { sensitivity: 'base' })
            );
            setAllData(ordenado);
            setNoData(ordenado.length === 0);
        } catch (error) {
            alert(`Ocorreu um erro. Tente novamente, ${error.response?.data?.message || error.message}.`);
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        buscarFerias();
    }, []);

    const statusOptions = useMemo(() => {
        const statuses = new Set();
        allData.forEach((item) => {
            item.Ferias?.forEach((f) => {
                if (f.status) statuses.add(f.status);
            });
        });
        return [...statuses].sort((a, b) => a.localeCompare(b, 'pt-BR'));
    }, [allData]);

    const toggleStatus = (status) => {
        setSelectedStatus((prev) =>
            prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
        );
    };

    const filteredData = useMemo(() => {
        if (selectedStatus.length === 0) return allData;
        return allData.map((item) => ({
            ...item,
            Ferias: item.Ferias?.filter((f) => selectedStatus.includes(f.status)) || []
        }));
    }, [allData, selectedStatus]);

    return (
        <PageContainer>
            <HeaderGGNewComponent pageTitle={"Férias e Licenças Completas | Admin"} lastPage={"admin"} />
            {dados &&
                <Container>
                    {!carregando && statusOptions.length > 0 &&
                        <StatusFilter>
                            <span>Filtrar por status:</span>
                            <StatusOptions>
                                {statusOptions.map((status) => (
                                    <StatusChip
                                        key={status}
                                        type="button"
                                        className={selectedStatus.includes(status) ? 'active' : ''}
                                        onClick={() => toggleStatus(status)}
                                    >
                                        {status}
                                    </StatusChip>
                                ))}
                                {selectedStatus.length > 0 &&
                                    <ClearButton type="button" onClick={() => setSelectedStatus([])}>
                                        Limpar filtro
                                    </ClearButton>
                                }
                            </StatusOptions>
                        </StatusFilter>
                    }
                    {carregando && <h2>Carregando...</h2>}
                    {!carregando && filteredData.length > 0 && (
                        <VacationsListComponent
                            filteredData={filteredData}
                            activeButton={"Completo"}
                            handleSubmit={buscarFerias}
                            showDelete={false}
                        />
                    )}
                    {!carregando && noData && <h2>Sem resultados para o período</h2>}
                </Container>
            }
        </PageContainer>
    );
};

export default FeriasCompletasAdminPage;

const PageContainer = styled.div`
    width: 100%;
    min-height: 100%;
    flex-direction: column;
    align-items: center;
    position: absolute;
    gap: 20px;
    color:rgb(75, 74, 75);
`

const Container = styled.div`
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    gap: 10px;
    color: #555;
    border: none;
    width: 100%;
    h2 {
        margin: 10px 0;
    }
`;

const StatusFilter = styled.div`
    flex-direction: column;
    align-items: center;
    gap: 8px;
    margin-top: 10px;
    span {
        font-weight: 700;
        color: #555;
    }
`;

const StatusOptions = styled.div`
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 8px;
    max-width: 90%;
`;

const StatusChip = styled.button`
    padding: 6px 14px;
    font-size: 13px;
    border: 1px solid #123e8c;
    border-radius: 999px;
    background: #fff;
    color: #123e8c;
    cursor: pointer;
    justify-content: center;

    &.active {
        background: #123e8c;
        color: #fff;
        font-weight: bold;
    }
`;

const ClearButton = styled.button`
    padding: 6px 14px;
    font-size: 13px;
    border: 1px solid #999;
    border-radius: 999px;
    background: #fff;
    color: #555;
    cursor: pointer;
    justify-content: center;
`;
