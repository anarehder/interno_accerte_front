import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import HeaderNewComponent from "../components/basic/HeaderNewComponent";
import NoticiaCardComponent, { CardsGrid } from "../components/noticias/NoticiaCardComponent";
import apiService from "../services/apiService";

const LIMITE_POR_PAGINA = 9;

function ListaNoticiasPage() {
    const [noticias, setNoticias] = useState([]);
    const [tags, setTags] = useState([]);
    const [tagSelecionada, setTagSelecionada] = useState("");
    const [busca, setBusca] = useState("");
    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [tagsMenuAberto, setTagsMenuAberto] = useState(false);
    const tagsBoxRef = useRef(null);

    useEffect(() => {
        let ignorar = false;
        const fetchTags = async () => {
            try {
                const response = await apiService.getNoticiasTags();
                if (ignorar) return;
                setTags(response.data || []);
            } catch (error) {
                console.error("Erro ao buscar as tags:", error);
            }
        };
        fetchTags();
        return () => { ignorar = true; };
    }, []);

    useEffect(() => {
        const handleClickFora = (e) => {
            if (tagsBoxRef.current && !tagsBoxRef.current.contains(e.target)) {
                setTagsMenuAberto(false);
            }
        };
        document.addEventListener("mousedown", handleClickFora);
        return () => document.removeEventListener("mousedown", handleClickFora);
    }, []);

    useEffect(() => {
        let ignorar = false;
        setLoading(true);

        const fetchNoticias = async () => {
            try {
                const params = new URLSearchParams({ pagina, limite: LIMITE_POR_PAGINA });
                if (tagSelecionada) params.set("tag", tagSelecionada);

                const response = await apiService.getNoticias(params.toString());
                if (ignorar) return;
                setNoticias(response.data.dados || []);
                setTotalPaginas(response.data.totalPaginas || 1);
                setError("");
            } catch (error) {
                if (ignorar) return;
                console.error("Erro ao buscar as notícias:", error);
                setError("Erro ao buscar as notícias");
            } finally {
                if (!ignorar) setLoading(false);
            }
        };
        fetchNoticias();

        return () => { ignorar = true; };
    }, [pagina, tagSelecionada]);

    const selecionarTag = (tag) => {
        setTagSelecionada(tag);
        setPagina(1);
        setTagsMenuAberto(false);
    };

    const noticiasFiltradas = useMemo(() => {
        const termo = busca.trim().toLowerCase();
        if (!termo) return noticias;
        return noticias.filter((noticia) =>
            noticia.titulo?.toLowerCase().includes(termo) ||
            noticia.resumo?.toLowerCase().includes(termo)
        );
    }, [noticias, busca]);

    return (
        <PageContainer>
            <HeaderNewComponent pageTitle={"Notícias"} returnTo="/homepage" />

            <FiltrosBar>
                <SearchBox>
                    <FiSearch size={18} />
                    <input
                        type="text"
                        placeholder="Buscar artigos por palavra-chave"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />
                </SearchBox>

                <TagsBox ref={tagsBoxRef}>
                    <TagsButton
                        type="button"
                        onClick={() => setTagsMenuAberto((aberto) => !aberto)}
                        $aberto={tagsMenuAberto}
                    >
                        <span className="label">TAGS</span>
                        <span className="valor">{tagSelecionada || "Todas as tags"}</span>
                        <FiChevronDown size={16} />
                    </TagsButton>

                    {tagsMenuAberto &&
                        <TagsMenu>
                            <li>
                                <button
                                    type="button"
                                    className={!tagSelecionada ? "ativa" : ""}
                                    onClick={() => selecionarTag("")}
                                >
                                    Todas as tags
                                </button>
                            </li>
                            {tags.map((tag) => (
                                <li key={tag.id}>
                                    <button
                                        type="button"
                                        className={tagSelecionada === tag.nome ? "ativa" : ""}
                                        onClick={() => selecionarTag(tag.nome)}
                                    >
                                        {tag.nome}
                                    </button>
                                </li>
                            ))}
                        </TagsMenu>
                    }
                </TagsBox>
            </FiltrosBar>

            {loading && <div><br />Carregando notícias... </div>}
            {error && <div><br />{error} </div>}
            {!loading && !error && noticiasFiltradas.length === 0 &&
                <VazioContainer><br />Ainda não temos notícias para exibir. </VazioContainer>
            }

            {!loading && noticiasFiltradas.length > 0 &&
                <ConteudoContainer>
                    <CardsGrid>
                        {noticiasFiltradas.map((noticia) => (
                            <NoticiaCardComponent key={noticia.id} noticia={noticia} />
                        ))}
                    </CardsGrid>

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
                </ConteudoContainer>
            }
        </PageContainer>
    )
}

export default ListaNoticiasPage;

const PageContainer = styled.div`
    width: 100%;
    min-height: 100vh;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin-bottom: 50px;
    color: #082764;
`

const FiltrosBar = styled.div`
    display: flex;
    width: 90%;
    max-width: 1300px;
    gap: 15px;
    flex-wrap: wrap;
    justify-content: space-between;
`

const SearchBox = styled.div`
    display: flex;
    flex: 1 1 240px;
    width: auto;
    min-width: 240px;
    align-items: center;
    gap: 10px;
    background: white;
    border: 1px solid #d9dee6;
    border-radius: 10px;
    padding: 10px 16px;
    color: #8792a2;

    svg {
        flex-shrink: 0;
        cursor: default;
    }

    input {
        display: block;
        flex: 1;
        width: auto;
        border: none;
        outline: none;
        font-size: 14px;
        font-weight: 400;
        color: #0B2049;
        background: transparent;
        padding: 0;

        &::placeholder {
            color: #8792a2;
            font-weight: 400;
        }
    }
`

const TagsBox = styled.div`
    display: block;
    position: relative;
    width: auto;
    flex: 0 0 auto;
`

const TagsButton = styled.button`
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 10px;
    background: white;
    border: 1px solid ${(props) => props.$aberto ? "#205fdd" : "#d9dee6"};
    border-radius: 10px;
    padding: 10px 16px;
    color: #0B2049;
    white-space: nowrap;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;

    &:hover {
        border-color: #205fdd;
        background: #f0f4fb;
    }

    .label {
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.5px;
        color: #8792a2;
        white-space: nowrap;
    }

    .valor {
        max-width: 160px;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    svg {
        flex-shrink: 0;
        color: #0B2049;
        transition: transform 0.15s ease-in-out;
        transform: ${(props) => props.$aberto ? "rotate(180deg)" : "rotate(0deg)"};
    }
`

const TagsMenu = styled.ul`
    display: block;
    position: absolute;
    top: calc(100% + 6px);
    right: 0;
    min-width: 200px;
    max-height: 280px;
    overflow-y: auto;
    background: white;
    border: 1px solid #e3e7ee;
    border-radius: 10px;
    box-shadow: 0 10px 25px rgba(11, 32, 73, 0.15);
    padding: 6px;
    z-index: 20;

    li {
        display: block;
        width: 100%;
    }

    button {
        box-sizing: border-box;
        display: block;
        width: 100%;
        text-align: left;
        background: transparent;
        border: none;
        border-radius: 6px;
        padding: 9px 12px;
        font-size: 14px;
        font-weight: 500;
        color: #0B2049;
        cursor: pointer;

        &:hover {
            background: #f0f4fb;
        }

        &.ativa {
            background: #0B2049;
            color: white;
            font-weight: 600;
        }
    }
`

const ConteudoContainer = styled.div`
    width: 90%;
    max-width: 1300px;
    flex-direction: column;
`

const VazioContainer = styled.div`
    height: 100px;
    font-weight: 500;
    font-size: 18px;
    margin-top: 15px;
`

const Paginacao = styled.div`
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-top: 35px;
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
