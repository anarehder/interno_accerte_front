import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import HeaderNewComponent from "../../components/basic/HeaderNewComponent";
import apiService from "../../services/apiService";
import { formatarDataNoticia } from "../../utils/noticiasUtils";

const LIMITE_POR_PAGINA = 10;

const STATUS_FILTROS = [
    { value: "", label: "Todos" },
    { value: "RASCUNHO", label: "Rascunho" },
    { value: "PUBLICADO", label: "Publicado" },
    { value: "ARQUIVADO", label: "Arquivado" },
];

function GerenciarNoticiasPage() {
    const navigate = useNavigate();
    const [noticias, setNoticias] = useState([]);
    const [statusFiltro, setStatusFiltro] = useState("");
    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let ignorar = false;
        setLoading(true);

        const fetchNoticias = async () => {
            try {
                const params = new URLSearchParams({ pagina, limite: LIMITE_POR_PAGINA });
                if (statusFiltro) params.set("status", statusFiltro);

                const response = await apiService.getNoticiasGerenciar(params.toString());
                if (ignorar) return;
                setNoticias(response.data.dados || []);
                setTotalPaginas(response.data.totalPaginas || 1);
                setError("");
            } catch (error) {
                if (ignorar) return;
                console.error("Erro ao buscar notícias:", error);
                setError(error?.response?.data?.message || "Erro ao buscar as notícias.");
            } finally {
                if (!ignorar) setLoading(false);
            }
        };
        fetchNoticias();

        return () => { ignorar = true; };
    }, [pagina, statusFiltro]);

    const selecionarStatus = (status) => {
        setStatusFiltro(status);
        setPagina(1);
    };

    const handleDeletar = async (noticia) => {
        const confirmado = window.confirm(`Deseja realmente excluir a notícia "${noticia.titulo}"?`);
        if (!confirmado) return;

        try {
            await apiService.deletarNoticia(noticia.id);
            setNoticias((prev) => prev.filter((n) => n.id !== noticia.id));
        } catch (error) {
            console.error("Erro ao excluir notícia:", error);
            alert(error?.response?.data?.message || "Erro ao excluir a notícia.");
        }
    };

    return (
        <PageContainer>
            <HeaderNewComponent pageTitle={"Gerenciar Notícias"} returnTo="/painelmarketing" />

            <TopBar>
                <AdminButton onClick={() => navigate("/criarnoticia")}>Criar Notícia</AdminButton>
            </TopBar>

            <FiltroContainer>
                {STATUS_FILTROS.map((s) => (
                    <FiltroButton
                        key={s.value}
                        $active={statusFiltro === s.value}
                        onClick={() => selecionarStatus(s.value)}
                    >
                        {s.label}
                    </FiltroButton>
                ))}
            </FiltroContainer>

            {loading && <div><br />Carregando notícias... </div>}
            {error && <div><br />{error} </div>}
            {!loading && !error && noticias.length === 0 &&
                <EmptyState>Nenhuma notícia encontrada.</EmptyState>
            }

            {!loading && noticias.length > 0 &&
                <ListaContainer>
                    <Tabela>
                        <thead>
                            <tr>
                                <th>Título</th>
                                <th>Categoria</th>
                                <th>Status</th>
                                <th>Destaque</th>
                                <th>Publicação</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {noticias.map((noticia) => (
                                <tr key={noticia.id}>
                                    <td>{noticia.titulo}</td>
                                    <td>{noticia.Categoria?.nome}</td>
                                    <td><StatusBadge $status={noticia.status}>{noticia.status}</StatusBadge></td>
                                    <td>{noticia.destaque ? "Sim" : "Não"}</td>
                                    <td>{formatarDataNoticia(noticia.publicadoEm) || "-"}</td>
                                    <td>
                                        <AcoesContainer>
                                            <Link to={`/editarnoticia?noticiaId=${noticia.id}`}>Editar</Link>
                                            <DeletarButton onClick={() => handleDeletar(noticia)}>Excluir</DeletarButton>
                                        </AcoesContainer>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Tabela>

                    {totalPaginas > 1 &&
                        <Paginacao>
                            <button disabled={pagina === 1} onClick={() => setPagina((p) => p - 1)}>← Anterior</button>
                            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((p) => (
                                <button key={p} className={p === pagina ? "ativa" : ""} onClick={() => setPagina(p)}>
                                    {p}
                                </button>
                            ))}
                            <button disabled={pagina === totalPaginas} onClick={() => setPagina((p) => p + 1)}>Próxima →</button>
                        </Paginacao>
                    }
                </ListaContainer>
            }
        </PageContainer>
    )
}

export default GerenciarNoticiasPage;

const PageContainer = styled.div`
    width: 100%;
    min-height: 100%;
    flex-direction: column;
    align-items: center;
    position: absolute;
    gap: 20px;
    color: rgb(75, 74, 75);
`

const TopBar = styled.div`
    width: 90%;
    max-width: 1200px;
    justify-content: flex-end;
`

const AdminButton = styled.button`
    font-size: 16px;
    justify-content: center;
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
`

const FiltroContainer = styled.div`
    width: 90%;
    max-width: 1200px;
    gap: 10px;
    flex-wrap: wrap;
`

const FiltroButton = styled.button`
    background-color: ${({ $active }) => ($active ? "#003289" : "#e5e7eb")};
    color: ${({ $active }) => ($active ? "white" : "#374151")};
    border: 1px solid #9ca3af;
    padding: 8px 14px;
    font-size: 14px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
`

const EmptyState = styled.div`
    padding: 40px 0;
    color: #6b7280;
`

const ListaContainer = styled.div`
    width: 90%;
    max-width: 1200px;
    flex-direction: column;
    margin-bottom: 40px;
`

const Tabela = styled.table`
    display: table;
    width: 100%;
    border-collapse: collapse;
    background: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(20, 30, 60, 0.08);

    thead {
        display: table-header-group;
        background: #003289;
    }
    tbody {
        display: table-row-group;
    }
    tr {
        display: table-row;
    }
    th, td {
        display: table-cell;
        text-align: left;
        padding: 12px 14px;
        font-size: 14px;
        vertical-align: middle;
    }
    th {
        color: white;
        font-weight: 600;
    }
    tbody tr {
        border-bottom: 1px solid #eceff2;
    }
    tbody tr:hover {
        background: #f4f6f9;
    }
`

const StatusBadge = styled.span`
    display: inline-block;
    padding: 3px 10px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 700;
    color: white;
    background: ${({ $status }) =>
        $status === "PUBLICADO" ? "#1f9d55" :
        $status === "ARQUIVADO" ? "#6b7280" :
        "#d97706"};
`

const AcoesContainer = styled.div`
    gap: 14px;
    align-items: center;

    a {
        color: #205fdd;
        font-weight: 600;
    }
`

const DeletarButton = styled.button`
    background: none;
    border: none;
    color: #d64545;
    font-weight: 600;
    cursor: pointer;
    padding: 0;

    &:hover {
        text-decoration: underline;
    }
`

const Paginacao = styled.div`
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-top: 25px;
    flex-wrap: wrap;

    button {
        background: white;
        border: 1px solid #ccc;
        border-radius: 8px;
        min-width: 38px;
        height: 38px;
        padding: 0 10px;
        color: #0B2049;
        font-weight: 600;
        cursor: pointer;

        &:hover:not(:disabled) {
            border-color: #205fdd;
        }
        &:disabled {
            cursor: not-allowed;
            opacity: 0.5;
        }
        &.ativa {
            background: linear-gradient(to right,#205fdd, #001143);
            color: white;
            border-color: transparent;
        }
    }
`
