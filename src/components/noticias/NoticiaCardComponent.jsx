import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { HiOutlineNewspaper } from "react-icons/hi";
import { formatarDataNoticia } from '../../utils/noticiasUtils';

function NoticiaCardComponent({ noticia }) {
    return (
        <Card to={`/noticias/${noticia.slug}`}>
            {noticia.imagemCapaUrl
                ? <img src={noticia.imagemCapaUrl} alt={noticia.titulo} />
                : <ImagemPlaceholder><HiOutlineNewspaper size={40} /></ImagemPlaceholder>
            }
            <div className="content">
                <div className="meta">
                    <Tag>NOTÍCIAS</Tag>
                    <span className="data">{formatarDataNoticia(noticia.publicadoEm || noticia.createdAt)}</span>
                </div>
                <h3>{noticia.titulo}</h3>
                <p>{noticia.resumo}</p>
                <span className="ler-mais">Ler conteúdo →</span>
            </div>
        </Card>
    )
}

export default NoticiaCardComponent;

export const CardsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 380px));
    gap: 25px;
    margin-top: 20px;
`

const Card = styled(Link)`
    box-sizing: border-box;
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease-in-out;
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;
    min-width: 0;

    * {
        box-sizing: border-box;
        min-width: 0;
    }

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
        flex: 1;
        padding: 16px 18px 20px;
        flex-direction: column;
        gap: 8px;
    }

    .meta {
        align-items: center;
        gap: 10px;
        font-size: 13px;
        color: #777;
    }

    .data {
        font-size: 13px;
        color: #777;
    }

    h3 {
        font-size: 18px;
        font-weight: 700;
        color: #0B2049;
        line-height: 1.3;
        text-align: left;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        min-height: 2.6em;
    }

    p {
        font-size: 14px;
        color: #666;
        line-height: 1.4;
        text-align: left;
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .ler-mais {
        margin-top: auto;
        padding-top: 4px;
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
