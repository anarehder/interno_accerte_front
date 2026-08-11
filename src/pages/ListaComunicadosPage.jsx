import { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import apiServiceBucket from "../services/apiServiceBucket";
import HeaderNewComponent from "../components/basic/HeaderNewComponent";

const formatDate = (data) => {
    if (!data) return null;
    const [ano, mes, dia] = data.slice(0, 10).split("-");
    return `${dia}/${mes}/${ano}`;
};

function ListaComunicadosPage() {
    const { user } = useAuth();
    const [comunicados, setComunicados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState(null);
    const [tipoFiltro, setTipoFiltro] = useState("");

    useEffect(() => {
        if (!user) return;
        const fetchComunicados = async () => {
            setLoading(true);
            try {
                const body = { email: user.mail };
                const response = await apiServiceBucket.buscarComunicadosTodos(body);
                setComunicados(response.data || []);
            } catch (error) {
                console.error("Erro ao buscar comunicados:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchComunicados();
    }, [user]);

    const tipos = [...new Set(comunicados.map((c) => c.tipo).filter(Boolean))].sort();

    const comunicadosFiltrados = comunicados
        .filter((c) => !tipoFiltro || c.tipo === tipoFiltro);

    useEffect(() => {
        if (comunicadosFiltrados.length === 0) {
            setSelectedId(null);
            return;
        }
        if (!comunicadosFiltrados.some((c) => c.id === selectedId)) {
            setSelectedId(comunicadosFiltrados[0].id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [comunicadosFiltrados.length, tipoFiltro]);

    const selecionado = comunicadosFiltrados.find((c) => c.id === selectedId) || null;

    const handleTipoClick = (tipo) => {
        setTipoFiltro((prev) => (prev === tipo ? "" : tipo));
    };

    return (
        <PageContainer>
            <HeaderNewComponent pageTitle={"Comunicados"} returnTo="/painelmarketing" />
            <TopBar>
                <AdminButton><Link to="/criarcomunicado">Criar Comunicado</Link></AdminButton>
            </TopBar>

            <FilterContainer>
                <FilterGroup>
                    <FilterTitle>Tipo:</FilterTitle>
                    <FilterArea>
                        <FilterButton
                            $active={tipoFiltro === ""}
                            onClick={() => setTipoFiltro("")}
                        >
                            Todos
                        </FilterButton>
                        {tipos.map((tipo) => (
                            <FilterButton
                                key={tipo}
                                $active={tipoFiltro === tipo}
                                onClick={() => handleTipoClick(tipo)}
                            >
                                {tipo}
                            </FilterButton>
                        ))}
                    </FilterArea>
                </FilterGroup>
            </FilterContainer>

            <ExplorerContainer>
                <ListPanel>
                    {loading && <EmptyState>Carregando...</EmptyState>}
                    {!loading && comunicadosFiltrados.length === 0 && (
                        <EmptyState>Nenhum comunicado encontrado.</EmptyState>
                    )}
                    {!loading && comunicadosFiltrados.map((comunicado) => (
                        <ListItem
                            key={comunicado.id}
                            $active={comunicado.id === selectedId}
                            onClick={() => setSelectedId(comunicado.id)}
                        >
                            <Thumb src={comunicado.imagemUrl} alt={comunicado.titulo} />
                            <ListItemInfo>
                                <ListItemTitle>{comunicado.titulo}</ListItemTitle>
                                <ListItemMeta>
                                    <TipoBadge>{comunicado.tipo}</TipoBadge>
                                    <span>{formatDate(comunicado.dataDivulgacao)}</span>
                                </ListItemMeta>
                            </ListItemInfo>
                        </ListItem>
                    ))}
                </ListPanel>

                <PreviewPanel>
                    {selecionado ? (
                        <>
                            <PreviewImage src={selecionado.imagemUrl} alt={selecionado.titulo} />
                            <PreviewTitle>{selecionado.titulo}</PreviewTitle>
                            <PreviewDetails>
                                <div><strong>Tipo:&nbsp;</strong>{selecionado.tipo}</div>
                                <div><strong>Data Divulgação:&nbsp;</strong>{formatDate(selecionado.dataDivulgacao)}</div>
                                <div><strong>Legenda:&nbsp;</strong>{selecionado.legenda || "Sem legenda"}</div>
                                <div>
                                    {selecionado.linkExterno && selecionado.linkExterno !== "-" ? (
                                        <a href={selecionado.linkExterno} target="_blank" rel="noreferrer">
                                            Abrir link externo
                                        </a>
                                    ) : (
                                        <span>Sem link externo</span>
                                    )}
                                </div>
                            </PreviewDetails>
                        </>
                    ) : (
                        <EmptyState>Selecione um comunicado na lista.</EmptyState>
                    )}
                </PreviewPanel>
            </ExplorerContainer>
        </PageContainer>
    );
}

export default ListaComunicadosPage;

const PageContainer = styled.div`
    width: 100%;
    min-height: 100%;
    flex-direction: column;
    align-items: center;
    position: absolute;
    gap: 20px;
    color: rgb(75, 74, 75);
`;

const TopBar = styled.div`
    width: 90%;
    max-width: 1200px;
    justify-content: flex-end;
`;

const AdminButton = styled.button`
    font-size: 16px;
    justify-content: center;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: white;
    border: 2px solid #003289;
    color: #003289;
    padding: 8px 16px;
    &:hover {
        background-color: #003289;
        color: white;
    }
`;

const FilterContainer = styled.div`
    width: 90%;
    max-width: 1200px;
    border: 1px solid #9ca3af;
    border-radius: 10px;
    padding: 12px;
    background-color: #f9fafb;
    flex-direction: column;
    gap: 10px;
    box-sizing: border-box;
`;

const FilterGroup = styled.div`
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
`;

const FilterTitle = styled.div`
    font-size: 14px;
    font-weight: 700;
    color: #374151;
    min-width: 80px;
`;

const FilterArea = styled.div`
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
`;

const FilterButton = styled.button`
    background-color: ${({ $active }) => ($active ? "#495F96" : "#e5e7eb")};
    color: ${({ $active }) => ($active ? "white" : "#374151")};
    border: 1px solid #9ca3af;
    padding: 8px 14px;
    font-size: 14px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
`;

const ExplorerContainer = styled.div`
    width: 90%;
    max-width: 1200px;
    height: 560px;
    margin-bottom: 40px;
    border: 1px solid #9ca3af;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 4px 4px 8px 4px rgba(0, 0, 0, 0.15);
`;

const ListPanel = styled.div`
    width: 55%;
    height: 100%;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
    border-right: 1px solid #d1d5db;
    background-color: white;
    box-sizing: border-box;
`;

const ListItem = styled.div`
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    cursor: pointer;
    border-bottom: 1px solid #e5e7eb;
    box-sizing: border-box;
    background-color: ${({ $active }) => ($active ? "#dbe4ff" : "white")};

    &:hover {
        background-color: ${({ $active }) => ($active ? "#dbe4ff" : "#f3f4f6")};
    }
`;

const Thumb = styled.img`
    width: 48px;
    height: 48px;
    object-fit: cover;
    border-radius: 6px;
    border: 1px solid #d1d5db;
    flex-shrink: 0;
`;

const ListItemInfo = styled.div`
    flex-direction: column;
    gap: 4px;
    overflow: hidden;
`;

const ListItemTitle = styled.div`
    font-size: 15px;
    font-weight: 600;
    color: #1f2937;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const ListItemMeta = styled.div`
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #6b7280;
`;

const TipoBadge = styled.span`
    background-color: #495f96;
    color: white;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 11px;
    font-weight: 600;
`;

const PreviewPanel = styled.div`
    width: 45%;
    height: 100%;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    gap: 12px;
    background-color: #f9fafb;
    overflow-y: auto;
    overflow-x: hidden;
    box-sizing: border-box;
`;

const PreviewImage = styled.img`
    width: 100%;
    max-height: 390px;
    object-fit: contain;
    border-radius: 8px;
    border: 1px solid #d1d5db;
    background-color: white;
`;

const PreviewTitle = styled.div`
    font-size: 18px;
    font-weight: 700;
    color: #1f2937;
    text-align: center;
`;

const PreviewDetails = styled.div`
    flex-direction: column;
    gap: 8px;
    font-size: 14px;
    color: #374151;
    width: 100%;

    a {
        color: #003289;
        font-weight: 600;
    }
`;

const EmptyState = styled.div`
    padding: 20px;
    color: #6b7280;
    font-size: 14px;
    text-align: center;
    width: 100%;
`;
