import { useEffect, useState } from "react";
import styled from "styled-components";
import HeaderNewComponent from "../components/basic/HeaderNewComponent";
import NoticiaCardComponent, { CardsGrid } from "../components/noticias/NoticiaCardComponent";
import apiService from "../services/apiService";

const LIMITE_POR_PAGINA = 9;

function ListaNoticiasPage() {
    const [noticias, setNoticias] = useState([]);
    const [tags, setTags] = useState([]);
    const [tagSelecionada, setTagSelecionada] = useState("");
    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
    };

    return (
        <PageContainer>
            <HeaderNewComponent pageTitle={"Notícias"} returnTo="/homepage" />

            {tags.length > 0 &&
                <TagsFiltro>
                    <TagPill $ativa={!tagSelecionada} onClick={() => selecionarTag("")}>Todas</TagPill>
                    {tags.map((tag) => (
                        <TagPill key={tag.id} $ativa={tagSelecionada === tag.nome} onClick={() => selecionarTag(tag.nome)}>
                            {tag.nome}
                        </TagPill>
                    ))}
                </TagsFiltro>
            }

            {loading && <div><br />Carregando notícias... </div>}
            {error && <div><br />{error} </div>}
            {!loading && !error && noticias.length === 0 &&
                <VazioContainer><br />Ainda não temos notícias para exibir. </VazioContainer>
            }

            {!loading && noticias.length > 0 &&
                <ConteudoContainer>
                    <CardsGrid>
                        {noticias.map((noticia) => (
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

const TagsFiltro = styled.div`
    width: 90%;
    max-width: 1300px;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
`

const TagPill = styled.button`
    background: ${(props) => props.$ativa ? "#0B2049" : "white"};
    color: ${(props) => props.$ativa ? "white" : "#0B2049"};
    border: 1px solid #0B2049;
    border-radius: 20px;
    padding: 6px 16px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    text-transform: uppercase;
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
