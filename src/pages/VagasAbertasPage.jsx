import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import HeaderGGComponent from "../components/HeaderGGComponent";
import { useEffect } from "react";
import CardVagaComponent from "../components/CardVagaComponent";


const VagasAbertasPage = () => {
    const { dados } = useAuth();

    useEffect(() => {
        if (!dados) return;
    }, [dados]);

    return (
        <Container>
            <HeaderGGComponent pageTitle={`Vagas em aberto`} />
            {
                !dados ?
                <List>Carregando dados...</List> :
            
            <List>
                {/* {dados?.vagas?.map((file, index) => (
                    <div key={index}>
                        <a href={file.url} target="_blank" download={`${file.name.slice(0, -4)}.jpg`}>
                            <Button>Download imagem</Button>
                        </a>
                        <Image src={file.url} alt={`Vaga ${file.name}`} />
                        <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
                            <label>
                                Currículo (PDF ou DOC):
                                <input type="file" accept=".pdf,.doc,.docx" onChange={handleArquivoChange} />
                            </label>
                            <br />
                            <button onClick={handleIndicar} style={{ marginTop: '1rem' }}>
                                Indicar Alguém
                            </button>
                        </div>
                    </div>
                ))} */}
                {dados?.vagas?.map((file, index) => (
                    <CardVagaComponent key={index} file={file}/>
                ))}
            </List>
            }
        </Container>
    );
};

export default VagasAbertasPage;

const Container = styled.div`
    flex-direction: column;
    border-radius: 8px;
    align-items: center;
    min-height: 100vh;
    color: black;
`;


const List = styled.div`
    display: flex;
    gap: 50px;
    width: 90%;
    margin-top: 30px;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 20px;
    div {
        flex-direction: column;
        width: 500px;
        align-items: center;
        position: relative;
    }
`;

const Button = styled.button`
    top: -20px;
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