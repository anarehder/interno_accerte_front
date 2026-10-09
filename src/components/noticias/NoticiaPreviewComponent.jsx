import styled from "styled-components";
import DOMPurify from "dompurify";
import AutorNoticiaComponent from "./AutorNoticiaComponent";

// links do conteúdo da notícia sempre abrem em nova aba
DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (node.tagName === "A") {
        node.setAttribute("target", "_blank");
        node.setAttribute("rel", "noopener noreferrer");
    }
});

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
            <Texto dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(conteudo || "") }} />
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
    display: block;
    font-family: inherit;
    color: #333;
    font-size: 16px;
    line-height: 1.7;

    p {
        margin: 0 0 1em;
        text-align: justify;
        text-justify: inter-word;
    }

    li {
        text-align: justify;
        text-justify: inter-word;
    }

    h1, h2, h3, h4, h5, h6 {
        margin: 0.6em 0 0.4em;
        text-align: left;
        color: #0B2049;
    }

    strong {
        color: #0B2049;
    }

    em, i {
        font-style: italic;
    }

    a {
        color: #205fdd;
    }

    ul, ol {
        padding-left: 1.4em;
        margin: 0 0 1em;
    }

    ul {
        list-style: disc;
    }

    ol {
        list-style: decimal;
    }

    ul ul {
        list-style: circle;
    }

    blockquote {
        border-left: 3px solid #dfe3e8;
        padding-left: 14px;
        color: #666;
        margin: 0;
    }
`
