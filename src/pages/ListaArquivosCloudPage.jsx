import { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import apiServiceBucket from "../services/apiServiceBucket";
import HeaderNewComponent from "../components/basic/HeaderNewComponent";

const GRUPOS = ["Banner", "Comunicado", "AEM4"];

const getHoje = () => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
};

const isAtivo = (arquivo) => !arquivo.fim || arquivo.fim >= getHoje();

const formatDate = (data) => {
    if (!data) return null;
    const [ano, mes, dia] = data.slice(0, 10).split("-");
    return `${dia}/${mes}/${ano}`;
};

function ListaArquivosCloudPage() {
    const { user } = useAuth();
    const [arquivos, setArquivos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState(null);
    const [grupoFiltro, setGrupoFiltro] = useState("");
    const [somenteAtivos, setSomenteAtivos] = useState(true);
    const [editando, setEditando] = useState(false);
    const [editForm, setEditForm] = useState({ fim: "", linkExterno: "" });
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        if (!user) return;
        const fetchArquivos = async () => {
            setLoading(true);
            try {
                const body = { email: user.mail };
                const response = await apiServiceBucket.buscarArquivosCloud(body);
                setArquivos(response.data || []);
            } catch (error) {
                console.error("Erro ao buscar arquivos cloud:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchArquivos();
    }, [user]);

    const arquivosFiltrados = arquivos
        .filter((a) => !grupoFiltro || a.grupo === grupoFiltro)
        .filter((a) => !somenteAtivos || isAtivo(a));

    useEffect(() => {
        if (arquivosFiltrados.length === 0) {
            setSelectedId(null);
            return;
        }
        if (!arquivosFiltrados.some((a) => a.id === selectedId)) {
            setSelectedId(arquivosFiltrados[0].id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [arquivosFiltrados.length, grupoFiltro, somenteAtivos]);

    const selecionado = arquivosFiltrados.find((a) => a.id === selectedId) || null;

    useEffect(() => {
        setEditando(false);
    }, [selectedId]);

    const handleGrupoClick = (grupo) => {
        setGrupoFiltro((prev) => (prev === grupo ? "" : grupo));
    };

    const handleEditClick = () => {
        setEditForm({ fim: selecionado.fim || "", linkExterno: selecionado.linkExterno || "" });
        setEditando(true);
    };

    const handleEditChange = (e) => {
        const { id, value } = e.target;
        setEditForm((prev) => ({ ...prev, [id]: value }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const body = {
            email: user.mail,
            arquivo: {
                grupo: selecionado.grupo,
                descricao: selecionado.descricao,
                arquivo: selecionado.arquivo,
                linkExterno: editForm.linkExterno,
                inicio: selecionado.inicio,
                fim: editForm.fim || null,
            },
        };

        setSalvando(true);
        try {
            const response = await apiServiceBucket.editarArquivoCloud(selecionado.id, body);
            if (response.status === 200) {
                alert("Arquivo atualizado com sucesso!");
                setArquivos((prev) => prev.map((a) => (
                    a.id === selecionado.id
                        ? { ...a, fim: editForm.fim || null, linkExterno: editForm.linkExterno }
                        : a
                )));
                setEditando(false);
            }
        } catch (error) {
            console.error("Erro ao editar arquivo cloud:", error);
            alert("Ocorreu um erro ao editar o arquivo. Tente novamente.");
        } finally {
            setSalvando(false);
        }
    };

    return (
        <PageContainer>
            <HeaderNewComponent pageTitle={"Arquivos Cloud"} />
            <TopBar>
                <AdminButton><Link to="/criararquivocloud">Criar Arquivo</Link></AdminButton>
            </TopBar>

            <FilterContainer>
                <FilterGroup>
                    <FilterTitle>Grupo:</FilterTitle>
                    <FilterArea>
                        <FilterButton
                            $active={grupoFiltro === ""}
                            onClick={() => setGrupoFiltro("")}
                        >
                            Todos
                        </FilterButton>
                        {GRUPOS.map((grupo) => (
                            <FilterButton
                                key={grupo}
                                $active={grupoFiltro === grupo}
                                onClick={() => handleGrupoClick(grupo)}
                            >
                                {grupo}
                            </FilterButton>
                        ))}
                    </FilterArea>
                </FilterGroup>
                <FilterGroup>
                    <FilterTitle>Expiração:</FilterTitle>
                    <ToggleButton
                        $active={somenteAtivos}
                        onClick={() => setSomenteAtivos((prev) => !prev)}
                    >
                        {somenteAtivos ? "Somente Ativos" : "Todos (incl. expirados)"}
                    </ToggleButton>
                </FilterGroup>
            </FilterContainer>

            <ExplorerContainer>
                <ListPanel>
                    {loading && <EmptyState>Carregando...</EmptyState>}
                    {!loading && arquivosFiltrados.length === 0 && (
                        <EmptyState>Nenhum arquivo encontrado.</EmptyState>
                    )}
                    {!loading && arquivosFiltrados.map((arquivo) => (
                        <ListItem
                            key={arquivo.id}
                            $active={arquivo.id === selectedId}
                            onClick={() => setSelectedId(arquivo.id)}
                        >
                            <Thumb src={arquivo.arquivo} alt={arquivo.descricao} />
                            <ListItemInfo>
                                <ListItemTitle>{arquivo.descricao}</ListItemTitle>
                                <ListItemMeta>
                                    <GrupoBadge>{arquivo.grupo}</GrupoBadge>
                                    <span>{formatDate(arquivo.inicio)} - {formatDate(arquivo.fim) || "sem expiração"}</span>
                                    {!isAtivo(arquivo) && <ExpiradoBadge>Expirado</ExpiradoBadge>}
                                </ListItemMeta>
                            </ListItemInfo>
                        </ListItem>
                    ))}
                </ListPanel>

                <PreviewPanel>
                    {selecionado ? (
                        <>
                            <PreviewImage src={selecionado.arquivo} alt={selecionado.descricao} />
                            <PreviewTitle>{selecionado.descricao}</PreviewTitle>
                            <PreviewDetails>
                                <div><strong>Grupo:&nbsp;</strong>{selecionado.grupo}</div>
                                <div><strong>Início:&nbsp;</strong>{formatDate(selecionado.inicio)}</div>

                                {editando ? (
                                    <EditForm onSubmit={handleEditSubmit}>
                                        <EditField>
                                            <label htmlFor="fim">Fim:</label>
                                            <input
                                                type="date"
                                                id="fim"
                                                value={editForm.fim}
                                                onChange={handleEditChange}
                                            />
                                        </EditField>
                                        <EditField>
                                            <label htmlFor="linkExterno">Link Externo:</label>
                                            <input
                                                type="text"
                                                id="linkExterno"
                                                value={editForm.linkExterno}
                                                onChange={handleEditChange}
                                            />
                                        </EditField>
                                        <EditActions>
                                            <SaveButton type="submit" disabled={salvando}>
                                                {salvando ? "Salvando..." : "Salvar"}
                                            </SaveButton>
                                            <CancelButton type="button" onClick={() => setEditando(false)}>
                                                Cancelar
                                            </CancelButton>
                                        </EditActions>
                                    </EditForm>
                                ) : (
                                    <>
                                        <div><strong>Fim:&nbsp;</strong>{formatDate(selecionado.fim) || "sem expiração"}</div>
                                        <div><strong>Status:&nbsp;</strong>{isAtivo(selecionado) ? "Ativo" : "Expirado"}</div>
                                        {selecionado.linkExterno && (
                                            <div>
                                                <a href={selecionado.linkExterno} target="_blank" rel="noreferrer">
                                                    Abrir link externo
                                                </a>
                                            </div>
                                        )}
                                        <EditButton onClick={handleEditClick}>Editar</EditButton>
                                    </>
                                )}
                            </PreviewDetails>
                        </>
                    ) : (
                        <EmptyState>Selecione um arquivo na lista.</EmptyState>
                    )}
                </PreviewPanel>
            </ExplorerContainer>
        </PageContainer>
    );
}

export default ListaArquivosCloudPage;

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

const ToggleButton = styled.button`
    background-color: ${({ $active }) => ($active ? "#2e7d32" : "#e5e7eb")};
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

const GrupoBadge = styled.span`
    background-color: #495f96;
    color: white;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 11px;
    font-weight: 600;
`;

const ExpiradoBadge = styled.span`
    background-color: #d32f2f;
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
    max-height: 280px;
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

const EditButton = styled.button`
    background-color: white;
    border: 2px solid #003289;
    color: #003289;
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    align-self: center;

    &:hover {
        background-color: #003289;
        color: white;
    }
`;

const EditForm = styled.form`
    flex-direction: column;
    gap: 12px;
    width: 100%;
`;

const EditField = styled.div`
    align-items: center;
    gap: 8px;
    width: 100%;
    margin-bottom: 10px;
    label {
        font-size: 14px;
        font-weight: 700;
        color: #374151;
        min-width: 90px;
        flex-shrink: 0;
    }

    input {
        border: 1px solid #ccc;
        border-radius: 6px;
        padding: 6px 10px;
        font-size: 14px;
        box-sizing: border-box;
        flex: 1;
    }
`;

const EditActions = styled.div`
    gap: 10px;
    justify-content: center;
`;

const SaveButton = styled.button`
    background-color: #2e7d32;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;

    &:hover {
        background-color: #1b5e20;
    }

    &:disabled {
        background-color: #9ca3af;
        cursor: not-allowed;
    }
`;

const CancelButton = styled.button`
    background-color: #e5e7eb;
    color: #374151;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;

    &:hover {
        background-color: #d1d5db;
    }
`;

const EmptyState = styled.div`
    padding: 20px;
    color: #6b7280;
    font-size: 14px;
    text-align: center;
    width: 100%;
`;
