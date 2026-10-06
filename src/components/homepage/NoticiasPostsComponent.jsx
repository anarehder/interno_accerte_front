import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { HiOutlineNewspaper } from "react-icons/hi";
import { useEffect, useState } from 'react';
import apiService from '../../services/apiService';

const formatarData = (data) => {
    if (!data) return "";
    return new Date(data).toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const formatarAutor = (autor) => {
    if (!autor) return "Accerte";
    return [autor.nome, autor.sobrenome].filter(Boolean).join(" ");
};

function NoticiasPostsComponent() {
    const [noticias, setNoticias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let ignorar = false;

        const fetchNoticias = async () => {
            try {
                const response = await apiService.getLastNoticias();
                if (ignorar) return;
                setNoticias(response.data.dados || []);
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

        return () => {
            ignorar = true;
        };
    }, []);

    return (
        <PageContainer>
            <NoticiasContainer>
                <Title>
                    <HiOutlineNewspaper size={27} /> Notícias da Accerte
                </Title>

                {loading && <div><br />Carregando notícias... </div>}
                {error && <div><br />{error} </div>}
                {!loading && !error && noticias.length === 0 &&
                    <VazioContainer><br />Ainda não temos notícias para exibir. </VazioContainer>
                }

                {!loading && noticias.length > 0 &&
                    <CardsGrid>
                        {noticias.map((noticia) => (
                            <Card key={noticia.id} to={`/noticias/${noticia.slug}`}>
                                {noticia.imagemCapaUrl
                                    ? <img src={noticia.imagemCapaUrl} alt={noticia.titulo} />
                                    : <ImagemPlaceholder><HiOutlineNewspaper size={40} /></ImagemPlaceholder>
                                }
                                <div className="content">
                                    <div className="meta">
                                        <Tag>NOTÍCIAS</Tag>
                                        <span>Por {formatarAutor(noticia.Autor)}</span>
                                        <span className="data">{formatarData(noticia.publicadoEm || noticia.createdAt)}</span>
                                    </div>
                                    <h3>{noticia.titulo}</h3>
                                    <p>{noticia.resumo}</p>
                                    <span className="ler-mais">Ler conteúdo →</span>
                                </div>
                            </Card>
                        ))}
                    </CardsGrid>
                }
            </NoticiasContainer>
        </PageContainer>
    )
}

export default NoticiasPostsComponent;

const PageContainer = styled.div`
    width: 90%;
    color: #555;
    flex-direction: column;
    justify-content: flex-start;
    margin-bottom: 50px;
`

const NoticiasContainer = styled.div`
    margin-top: 15px;
    flex-direction: column;
`;

const Title = styled.div`
    background: linear-gradient(to right,#205fdd, #001143);
    border-radius: 8px;
    box-shadow: 0px 4px 4px 0px #00000040;
    height: 60px;
    color: white;
    align-items: center;
    margin: 0 auto;
    font-family: Poppins;
    font-weight: 600;
    font-size: 25px;
    line-height: 14px;
    letter-spacing: 0%;
    text-align: center;

    svg {
        margin: 0 10px;
        padding-right: 10px;
        border-right: 1px solid white;
    }
`

const VazioContainer = styled.div`
    height: 100px;
    font-weight: 500;
    font-size: 18px;
    margin-top: 15px;
`

const CardsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 25px;
    margin-top: 20px;
`

const Card = styled(Link)`
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease-in-out;
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;

    &:hover {
        transform: translateY(-4px);
    }

    img {
        width: 100%;
        height: 190px;
        object-fit: cover;
        background: #0B2049;
    }

    .content {
        padding: 16px 18px 20px;
        flex-direction: column;
        gap: 10px;
    }

    .meta {
        align-items: center;
        gap: 10px;
        font-size: 13px;
        color: #777;
        flex-wrap: wrap;

        .data {
            margin-left: auto;
        }
    }

    h3 {
        font-size: 18px;
        font-weight: 700;
        color: #0B2049;
        line-height: 1.3;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    p {
        font-size: 14px;
        color: #666;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .ler-mais {
        color: #205fdd;
        font-weight: 600;
        font-size: 14px;
    }
`

const ImagemPlaceholder = styled.div`
    width: 100%;
    height: 190px;
    background: linear-gradient(to right,#205fdd, #001143);
    color: white;
    align-items: center;
    justify-content: center;
`

const Tag = styled.span`
    background: #0B2049;
    color: white;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.5px;
    padding: 4px 10px;
    border-radius: 20px;
`
