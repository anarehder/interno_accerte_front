import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import HeaderNewComponent from "../components/basic/HeaderNewComponent";
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
            <HeaderNewComponent pageTitle={"Notícias"} returnTo="/homepage" />

            {loading && <div><br />Carregando notícia... </div>}
            {error && <div><br />{error} </div>}

            {!loading && noticia &&
                <Conteudo>
                    <Tag>NOTÍCIAS</Tag>
                    <h1>{noticia.titulo}</h1>
                    <Meta>
                        <span>Por {formatarAutorNoticia(noticia.Autor)}</span>
                        <span>{formatarDataNoticia(noticia.publicadoEm || noticia.createdAt, true)}</span>
                    </Meta>
                    {noticia.imagemCapaUrl &&
                        <img src={noticia.imagemCapaUrl} alt={noticia.titulo} />
                    }
                    <Texto>{noticia.conteudo}</Texto>
                </Conteudo>
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
    margin-bottom: 50px;
    color: #082764;
`

const Conteudo = styled.div`
    width: 90%;
    max-width: 850px;
    flex-direction: column;
    gap: 16px;
    margin-top: 10px;

    h1 {
        font-size: 28px;
        font-weight: 700;
        color: #0B2049;
        line-height: 1.3;
    }

    img {
        width: 100%;
        max-height: 420px;
        object-fit: cover;
        border-radius: 16px;
    }
`

const Tag = styled.span`
    background: #0B2049;
    color: white;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.5px;
    padding: 5px 12px;
    border-radius: 20px;
    align-self: flex-start;
`

const Meta = styled.div`
    gap: 16px;
    color: #777;
    font-size: 14px;
`

const Texto = styled.div`
    white-space: pre-wrap;
    line-height: 1.7;
    font-size: 16px;
    color: #333;
`
