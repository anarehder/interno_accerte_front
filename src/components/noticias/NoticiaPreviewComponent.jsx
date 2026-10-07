import styled from "styled-components";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-markdown-preview/markdown.css";
import { preservarQuebrasDeLinha } from "../../utils/noticiasUtils";
import AutorNoticiaComponent from "./AutorNoticiaComponent";

function NoticiaPreviewComponent({
    titulo,
    autorTexto,
    autorNome,
    autorEmail,
    autorDescricao,
    dataTexto,
    imagemCapaUrl,
    conteudo,
}) {
    return (
        <Conteudo>
            <Tag>NOTÍCIAS</Tag>
            <h1>{titulo || "Título da notícia"}</h1>
            <Meta>
                <span>{autorTexto}</span>
                <span>{dataTexto}</span>
            </Meta>
            {imagemCapaUrl &&
                <img src={imagemCapaUrl} alt={titulo} />
            }
            <Texto data-color-mode="light">
                <MDEditor.Markdown source={preservarQuebrasDeLinha(conteudo)} />
            </Texto>
            <AutorNoticiaComponent
                nome={autorNome}
                email={autorEmail}
                descricao={autorDescricao}
            />
        </Conteudo>
    )
}

export default NoticiaPreviewComponent;

const Conteudo = styled.div`
    width: 90%;
    max-width: 1000px;
    flex-direction: column;
    gap: 16px;
    margin-top: 10px;

    h1 {
        font-size: 28px;
        font-weight: 700;
        color: #0B2049;
        line-height: 1.3;
        text-align: left;
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
    flex-direction: column;

    .wmde-markdown {
        display: block;
        background: transparent;
        font-family: inherit;
        color: #333;
        font-size: 16px;
        line-height: 1.7;
    }

    .wmde-markdown p,
    .wmde-markdown li {
        text-align: justify;
        text-justify: inter-word;
    }

    .wmde-markdown h1,
    .wmde-markdown h2,
    .wmde-markdown h3,
    .wmde-markdown h4,
    .wmde-markdown h5,
    .wmde-markdown h6 {
        text-align: left;
    }

    .wmde-markdown div {
        display: block;
        width: auto;
    }

    .wmde-markdown h1,
    .wmde-markdown h2,
    .wmde-markdown h3 {
        color: #0B2049;
    }

    .wmde-markdown strong {
        color: #0B2049;
    }

    .wmde-markdown em,
    .wmde-markdown i {
        font-style: italic;
    }

    .wmde-markdown a {
        color: #205fdd;
    }
`
