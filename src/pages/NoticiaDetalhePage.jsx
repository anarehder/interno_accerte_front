import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import HeaderNewComponent from "../components/basic/HeaderNewComponent";
import NoticiaPreviewComponent from "../components/noticias/NoticiaPreviewComponent";
import apiService from "../services/apiService";
import { formatarAutorNoticia, formatarDataNoticia } from "../utils/noticiasUtils";

function NoticiaDetalhePage() {
    const { slug } = useParams();
    const [noticia, setNoticia] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let ignorar = false;
        setLoading(true);

        const fetchNoticia = async () => {
            try {
                const response = await apiService.getNoticiaPorSlug(slug);
                if (ignorar) return;
                setNoticia(response.data);
                setError("");
            } catch (error) {
                if (ignorar) return;
                console.error("Erro ao buscar a notícia:", error);
                setError("Não foi possível carregar essa notícia.");
            } finally {
                if (!ignorar) setLoading(false);
            }
        };
        fetchNoticia();

        return () => {
            ignorar = true;
        };
    }, [slug]);

    return (
        <PageContainer>
            <HeaderNewComponent pageTitle={"Notícias"} returnTo="/noticias" />

            {loading && <EstadoContainer>Carregando notícia...</EstadoContainer>}
            {error && <EstadoContainer>{error}</EstadoContainer>}

            {!loading && noticia &&
                <ConteudoCard>
                    <NoticiaPreviewComponent
                        titulo={noticia.titulo}
                        autorTexto={`Por ${formatarAutorNoticia(noticia.Autor)}`}
                        autorNome={formatarAutorNoticia(noticia.Autor)}
                        autorEmail={noticia.Autor?.email}
                        autorDescricao={noticia.Autor?.descricao}
                        dataTexto={formatarDataNoticia(noticia.publicadoEm || noticia.createdAt, true)}
                        imagemCapaUrl={noticia.imagemCapaUrl}
                        conteudo={noticia.conteudo}
                    />
                </ConteudoCard>
            }
        </PageContainer>
    )
}

export default NoticiaDetalhePage;

const PageContainer = styled.div`
    width: 100%;
    min-height: 100vh;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding-bottom: 50px;
    background-color: #f4f6f9;
    color: #082764;
`

const ConteudoCard = styled.div`
    width: 90%;
    max-width: 1000px;
    justify-content: center;
    background: white;
    border-radius: 20px;
    padding: 40px 0 60px;
    box-sizing: border-box;
`

const EstadoContainer = styled.div`
    width: 90%;
    max-width: 850px;
    min-height: 40vh;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-weight: 500;
    font-size: 18px;
    color: #8792a2;
`
