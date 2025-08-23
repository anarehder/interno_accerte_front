import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { postVagaIndicada } from "../../services/graph";
import styled from "styled-components";
import { useMsal } from "@azure/msal-react";

function CardVagaComponent({ file }) {
    const { instance, accounts } = useMsal();
    const { user } = useAuth();
    const [arquivo, setArquivo] = useState(null);

    const handleArquivoChange = (e) => {
        setArquivo(e.target.files[0]);
    };

    const handleIndicar = async () => {
        if (!arquivo) {
            alert("Selecione um currículo antes de indicar.");
            return;
        }
        const novoNome = `${file.name} (${user.displayName}) - ${arquivo.name}`;
        const local = 'VAGAS EM ABERTO';
        const novoArquivo = new File([arquivo], novoNome, {
            type: arquivo.type,
        });

        const response = await postVagaIndicada(instance, accounts, local, novoArquivo);
        // console.log(response.webUrl);
        alert(`Indicação Finalizada com Sucesso! Obrigada!`)
    };

    return (
        <Container>
            <a href={file.url} target="_blank" download={`${file.name.slice(0, -4)}.jpg`}>
                <Button>Download imagem</Button>
            </a>
            <Image src={file.url} alt={`Vaga ${file.name}`} />
            <UploadDiv>
                <h2>IndicAccerte</h2>
                <label>
                    (PDF ou DOC):
                </label>
                <input type="file" accept=".pdf,.doc,.docx" onChange={handleArquivoChange} />
                <IndicarButton onClick={handleIndicar} style={{ marginTop: '1rem' }}>
                    Indicar
                </IndicarButton>
            </UploadDiv>
        </Container>
    );
}

export default CardVagaComponent;

const Container = styled.div`
    gap: 30px;
    
`

const Button = styled.button`
    top: 0px;
    right: -20px;
    position: absolute;
    width: 70px;
    font-size: 13px;
    justify-content: center;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: #ED1F4C;
    color: white;
    &:hover {
        background-color: #ED1F4C;
    }
`;

const Image = styled.img`
    width: 500px;
    height: 900px;
    object-fit: cover;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const UploadDiv = styled.div`
    color: #555;
    flex-direction: column;
    justify-content: center;
    font-size: 18px;
    
    h2{
        margin-bottom: 15px;
    }
    input{
        width: 65%;
        // background-color: red;
        flex-wrap: wrap;
        cursor: pointer;
        margin-top: 10px;
        font-size: 18px;
        gap: 15x;
        padding: 4px;
    }
    label {
    font-size: 15px;
    }
    ::-webkit-file-upload-button {
        color: #555;
        width: 84px;
    }
    border: '1px solid #ccc'
    borderRadius: '8px'
`

const IndicarButton = styled.button`
    // width: 70px;
    font-size: 18px;
    justify-content: center;
    padding: 5px 25px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: #ED1F4C;
    color: white;
    &:hover {
        background-color: #ED1F4C;
    }
`;