import styled from "styled-components";
import UserPhotoComponent from "../certifications/PerfilPhotoComponent";

function AutorNoticiaComponent({ nome, email, descricao }) {
    if (!nome) return null;

    return (
        <Card>
            <Cabecalho>
                <span className="label">ESCRITO POR</span>
                <span className="nome">{nome}</span>
            </Cabecalho>
            <Corpo>
                <UserPhotoComponent email={email} nome={nome} />
                {descricao &&
                    <Descricao>{descricao}</Descricao>
                }
            </Corpo>
        </Card>
    )
}

export default AutorNoticiaComponent;

const Card = styled.div`
    width: 100%;
    flex-direction: column;
    gap: 14px;
    background: white;
    border-top: 1px solid #e3e7ee;
    border-radius: 16px;
    padding: 28px 24px 28px;
    margin-top: 10px;
    box-sizing: border-box;
`

const Cabecalho = styled.div`
    flex-direction: column;
    gap: 4px;

    .label {
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.6px;
        color: #8792a2;
    }

    .nome {
        font-size: 18px;
        font-weight: 700;
        color: #0B2049;
    }
`

const Corpo = styled.div`
    align-items: flex-start;
    gap: 18px;
`

const Descricao = styled.p`
    font-size: 15px;
    line-height: 1.6;
    color: #555;
    text-align: left;
`
