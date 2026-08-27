import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import apiService from '../../services/apiService';
import { useAuth } from '../../contexts/AuthContext';
import HeaderImageComponent from '../../components/basic/HeaderImageComponent';
import SortableFieldButtonComponent from '../../components/basic/SortableFieldButtonComponent';
import useSortableData from '../../hooks/useSortableData';
import { FaUser } from 'react-icons/fa6';

const SORT_FIELDS = [
    { field: 'nome', label: 'Nome' },
    { field: 'cargo', label: 'Cargo' },
    { field: 'area', label: 'Área' },
];

function MeusFuncionariosPage() {
    const { user } = useAuth();
    const [errorMessage, setErrorMessage] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [funcionarios, setFuncionarios] = useState([]);
    const [areas, setAreas] = useState({});
    const [busca, setBusca] = useState("");

    useEffect(() => {
        if (!user) return;
        const fetchData = async () => {
            try {
                const body = { adminEmail: user.mail };

                const [responseFuncionarios, responseAreas] = await Promise.all([
                    apiService.buscarFuncionarioPorArea(body),
                    apiService.buscarAreas(),
                ]);
                setFuncionarios(responseFuncionarios.data);
                const mapaAreas = {};
                responseAreas.data.forEach((a) => { mapaAreas[a.id] = a.area; });
                setAreas(mapaAreas);
                setCarregando(false);
            } catch (error) {
                setErrorMessage(error.response?.data?.message ?? "Erro ao buscar funcionários.");
                setCarregando(false);
            }
        };

        fetchData();

    }, [user]);

    const funcionariosFiltrados = funcionarios.filter((f) => {
        const termo = busca.trim().toLowerCase();
        if (!termo) return true;
        return `${f.nome} ${f.sobrenome}`.toLowerCase().includes(termo) || f.cargo?.toLowerCase().includes(termo);
    });

    // Comparador customizado para "área", que não é um campo direto do funcionário (vem do mapa areaId -> nome).
    const comparators = useMemo(() => ({
        area: (a, b) => (areas[a.areaId] ?? '').localeCompare(areas[b.areaId] ?? '', 'pt-BR', { sensitivity: 'base' }),
    }), [areas]);

    const { sortedItems: funcionariosOrdenados, requestSort, getSortDirection } = useSortableData(
        funcionariosFiltrados,
        { field: 'nome', direction: 'asc' },
        comparators
    );

    return (
        <PageContainer>
            <HeaderImageComponent pageTitle={"Funcionários"} subtitle={"Área"} lastPage={"painelgestores"} />
            <h2>Funcionários da minha área</h2>
            <IntroText>Confira abaixo quem são os funcionários vinculados a você.</IntroText>

            <Container>
                <SearchBar
                    type="text"
                    placeholder="Buscar por nome ou cargo..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                />

                {funcionarios.length > 0 && !carregando && (
                    <SortRow>
                        <SortLabel>Ordenar por:</SortLabel>
                        {SORT_FIELDS.map(({ field, label }) => (
                            <SortableFieldButtonComponent
                                key={field}
                                label={label}
                                direction={getSortDirection(field)}
                                onClick={() => requestSort(field)}
                            />
                        ))}
                    </SortRow>
                )}

                {carregando && <StateBox>Carregando funcionários...</StateBox>}
                {errorMessage && <StateBox><h3>{errorMessage}</h3></StateBox>}
                {(funcionarios.length === 0 && !carregando && !errorMessage) && <StateBox><h3>Nenhum funcionário vinculado a você.</h3></StateBox>}
                {(funcionarios.length !== 0 && funcionariosOrdenados.length === 0 && !carregando && !errorMessage) && <StateBox><h3>Nenhum funcionário encontrado para a busca.</h3></StateBox>}

                {funcionariosOrdenados.length !== 0 && !carregando && (
                    <CardsContainer>
                        {funcionariosOrdenados.map((f) => (
                            <Card key={f.id}>
                                <IconCircle>
                                    <FaUser size={26} />
                                </IconCircle>
                                <CardInfo>
                                    <h3>{f.nome} {f.sobrenome}</h3>
                                    <p>{f.cargo}</p>
                                    <Email>{f.email}</Email>
                                    <Area>{areas[f.areaId] ?? "Área não informada"}</Area>
                                </CardInfo>
                            </Card>
                        ))}
                    </CardsContainer>
                )}
            </Container>
        </PageContainer>
    )
}

export default MeusFuncionariosPage;

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

const SortRow = styled.div`
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    width: 100%;
    margin-top: 4px;
`

const SortLabel = styled.span`
    font-size: 13px;
    font-weight: 600;
    color: #777;
    margin-right: 2px;
`

const SearchBar = styled.input`
    width: 100%;
    max-width: 420px;
    padding: 10px 16px;
    margin: 10px 0;
    border-radius: 999px;
    border: 1px solid #dfe3e8;
    font-size: 14px;
    background: #fafbfc;

    &:focus {
        outline: none;
        border-color: #205fdd;
    }
`

const CardsContainer = styled.div`
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
    gap: 20px;
    padding-bottom: 40px;
`

const Card = styled.div`
    align-items: center;
    gap: 16px;
    width: 340px;
    padding: 18px 20px;
    border-radius: 16px;
    border: 1px solid #acaaaaff;
    box-shadow: 0px 4px 4px 4px #00000010;
    background: linear-gradient(94.61deg, #FFFFFF 3.73%, #E1E1E1 133.27%);
`

const IconCircle = styled.div`
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: #0057E1;
    color: white;
`

const CardInfo = styled.div`
    flex-direction: column;
    align-items: flex-start;
    min-width: 0;
    gap: 4px;

    h3 {
        width: 100%;
        text-align: left;
        font-size: 16px;
        line-height: 1.5;
        margin: 0;
        color: #0057E1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    p {
        text-align: left;
        font-size: 14px;
        line-height: 1.5;
        margin: 0;
        color: #555;
    }
`

const Email = styled.span`
    text-align: left;
    font-size: 12px;
    line-height: 1.6;
    color: #888;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
`

const Area = styled.span`
    text-align: left;
    font-size: 12px;
    line-height: 1.6;
    font-weight: 600;
    color: #ffffff;
    background: #124598;
    padding: 3px 10px;
    border-radius: 999px;
    margin-top: 4px;
`
