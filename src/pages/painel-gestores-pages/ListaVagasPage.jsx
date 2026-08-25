import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import apiService from '../../services/apiService';
import ListagemVagasGestoresComponent from '../../components/gestores/ListagemVagasGestoresComponent';
import HeaderImageComponent from '../../components/basic/HeaderImageComponent';
import MinhasVagas from '../../assets/painel-gestores/minhas-vagas.png';

const getStatusCategory = (status) => {
    if (status === 'Concluída') return 'concluida';
    if (status === 'Cancelada') return 'cancelada';
    return 'emAndamento';
};

const STATUS_FILTERS = [
    { key: 'emAndamento', label: 'Em andamento' },
    { key: 'concluida', label: 'Concluídas' },
    { key: 'cancelada', label: 'Canceladas' },
];

function ListaVagasPage() {
    const { user } = useAuth();
    const [errorMessage, setErrorMessage] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [vagas, setVagas] = useState([]);
    const [updated, setUpdated] = useState(false);
    const [hideSalary, setHideSalary] = useState(false);
    const [statusFilters, setStatusFilters] = useState({ emAndamento: true, concluida: true, cancelada: true });

    const toggleStatusFilter = (key) => {
        setStatusFilters((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const vagasFiltradas = vagas.filter((v) => statusFilters[getStatusCategory(v.status)]);

    const getProgressPercent = (status) => {
        switch (status) {
            case "Solicitado": return 0;
            case "Stand By": return 10;
            case "Divulgação": return 20;
            case "Triagem curricular": return 30;
            case "Validação curricular": return 40;
            case "Seleção em agendamento": return 50;
            case "Entrevista com o Gestor": return 60;
            case "Entrega Documentos Admissão": return 70;
            case "Testes e referências": return 80;
            case "Validação do perfil": return 90;
            case "Concluída": return 100;
            case "Cancelada": return 101;
            default: return 0;
        }
    };

    useEffect(() => {
        if (!user) return;
        const fetchData = async () => {
            try {
                const body = {adminEmail: user.mail};
                const response = await apiService.getVagas(body);
                const v = response.data;
                v.sort((a, b) => getProgressPercent(a.status) - getProgressPercent(b.status) || a.cargo.localeCompare(b.cargo));
                setVagas(v);
                setCarregando(false);
                setUpdated(false);
            } catch (error) {
                setErrorMessage(error.response.data.message);
                setCarregando(false);
            }
        };

        fetchData();

    }, [user, updated]);

    return (
        <PageContainer>
            <HeaderImageComponent pageTitle={"Minhas"} subtitle={"Vagas"} lastPage={"painelgestores"} image={MinhasVagas} />
            <h2>Acompanhamento Contratações</h2>
            <IntroText>Acompanhe o andamento das contratações solicitadas para a sua área.</IntroText>

            <Container>
                <FilterBar>
                    <FilterChips>
                        {STATUS_FILTERS.map(({ key, label }) => (
                            <FilterChip
                                key={key}
                                type="button"
                                $active={statusFilters[key]}
                                onClick={() => toggleStatusFilter(key)}
                            >
                                {label}
                            </FilterChip>
                        ))}
                    </FilterChips>
                    <EyeButton type="button" onClick={() => setHideSalary((prev) => !prev)}>
                        {hideSalary ? <FaEyeSlash /> : <FaEye />}
                        {hideSalary ? "Mostrar salários" : "Ocultar salários"}
                    </EyeButton>
                </FilterBar>

                {carregando && <StateBox>Carregando vagas...</StateBox>}
                {errorMessage && <StateBox><h3>{errorMessage}</h3></StateBox>}
                {(vagas.length === 0 && !carregando && !errorMessage) && <StateBox><h3>Sem vagas para exibir na sua área.</h3></StateBox>}
                {(vagas.length !== 0 && vagasFiltradas.length === 0 && !carregando && !errorMessage) && <StateBox><h3>Nenhuma vaga para os filtros selecionados.</h3></StateBox>}

                {vagasFiltradas.length !== 0 && !carregando && (
                    <CardsContainer>
                        {vagasFiltradas.map((v, index) => (
                            <ListagemVagasGestoresComponent key={index} vaga={v} setUpdated={setUpdated} getProgressPercent={getProgressPercent} hideSalary={hideSalary}/>
                        ))}
                    </CardsContainer>
                )}
            </Container>
        </PageContainer>
    )
}

export default ListaVagasPage;

const PageContainer = styled.div`
    width: 100%;
    min-height: 100%;
    flex-direction: column;
    align-items: center;
    position: absolute;
    gap: 20px;
    color:rgb(75, 74, 75);
`

const IntroText = styled.p`
    width: 85%;
    max-width: 900px;
    text-align: center;
    color: #777;
    font-size: 15px;
    margin-top: -10px;
`

const StateBox = styled.div`
    width: 100%;
    justify-content: center;
    align-items: center;
    padding: 60px 0;
    color: #777;
`

const Container = styled.div`
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    width: 80%;
    gap: 10px;
    color: #555;
    border: none;
`

const CardsContainer = styled.div`
    flex-direction: column;
    width: 100%;
    gap: 20px;
    padding-bottom: 40px;
`

const FilterBar = styled.div`
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    width: 100%;
    margin: 10px 0;
    overflow-x: auto;
`

const FilterChips = styled.div`
    flex-wrap: nowrap;
    align-items: center;
    gap: 8px;
`

const FilterChip = styled.button`
    flex-shrink: 0;
    white-space: nowrap;
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 600;
    border-radius: 999px;
    border: 1px solid ${({ $active }) => ($active ? '#205fdd' : '#dfe3e8')};
    background: ${({ $active }) => ($active ? '#205fdd' : '#fafbfc')};
    color: ${({ $active }) => ($active ? '#fff' : '#555')};

    &:hover {
        background: ${({ $active }) => ($active ? '#1a4fba' : '#eef0f3')};
    }
`

const EyeButton = styled.button`
    display: flex;
    flex-shrink: 0;
    white-space: nowrap;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 600;
    border-radius: 999px;
    border: 1px solid #dfe3e8;
    background: #fafbfc;
    color: #555;

    &:hover {
        background: #eef0f3;
    }
`
