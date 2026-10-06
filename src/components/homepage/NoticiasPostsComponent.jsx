import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { HiOutlineNewspaper } from "react-icons/hi";
import { useEffect, useState } from 'react';
import apiService from '../../services/apiService';
import NoticiaCardComponent, { CardsGrid } from '../noticias/NoticiaCardComponent';

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
                            <NoticiaCardComponent key={noticia.id} noticia={noticia} />
                        ))}
                    </CardsGrid>
                }

                {!loading && noticias.length > 0 &&
                    <VerTodasLink to="/noticias">Ver todas as notícias →</VerTodasLink>
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

const VerTodasLink = styled(Link)`
    align-self: center;
    margin-top: 25px;
    color: #205fdd;
    font-weight: 600;
    font-size: 16px;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`
