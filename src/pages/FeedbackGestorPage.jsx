import styled from "styled-components";
import { toPng } from "html-to-image";
import download from "downloadjs";
import HeaderGGNewComponent from "../components/gentegestao/HeaderGGNewComponent";
import { useRef, useEffect, useState } from "react";
import apiService from "../services/apiService";
import { useAuth } from "../contexts/AuthContext";
import TabelaFeedbackComponent from "../components/gentegestao/TabelaFeedbackComponent";


const FeedbackGestorPage = () => {
    const { user } = useAuth();
    const imageRef = useRef(null);

    const [funcionarios, setFuncionarios] = useState([]);
    const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);
    // console.log(funcionarios);

    useEffect(() => {
        if (!user) return;

        const fetchScale = async () => {
            try {
                const response = await apiService.buscarFuncionarioAtivo();
                setFuncionarios(response.data);
            } catch (error) {
                console.error("Erro ao buscar informacoes dos funcionários:", error);
            }
        };

        fetchScale();

    }, [user]);

    const handleSelectFuncionario = (e) => {
        const id = parseInt(e.target.value, 10); // pega o id do select
        const func = funcionarios.find(f => f.id === id); // acha o funcionário
        setFuncionarioSelecionado(func || null); // salva no estado
    };


    const handleDownload = () => {
        if (imageRef.current) {
            toPng(imageRef.current, { quality: 1 })
                .then((dataUrl) => {
                    download(dataUrl, `Avaliacao/Feedback.png`, "image/png");
                })
                .catch((error) => {
                    console.error("Erro ao gerar a imagem:", error);
                });
        }
    };

    return (
        <Container>
            <HeaderGGNewComponent pageTitle={`Feedback`} />
            <Form>
                <label>Funcionário:
                {
                    funcionarios.length > 1 &&
                    <select name="funcionario" onChange={handleSelectFuncionario}>
                        <option value="">Selecione</option>
                        {funcionarios.map((f) => (
                            <option key={f.id} value={f.id}>
                                {f.nome} {f.sobrenome}
                            </option>
                        ))}
                    </select>
                }
                </label>
                <Button onClick={handleDownload}>
                Baixar Arquivo
            </Button>
            </Form>
            
            <DownloadArea ref={imageRef}>
                {
                funcionarioSelecionado && <TabelaFeedbackComponent funcionarioInfo={funcionarioSelecionado} />
                }
            </DownloadArea>           
            
        </Container>
    )
};
export default FeedbackGestorPage;

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    font-family: "Poppins", serif;
`;

const Form = styled.div`
    width: 1100px;
    gap: 15px;
    padding: 25px 0;
    align-items: center;
    font-size: 16px;
    justify-content: space-between; 
    select{
        font-size: 17px;
        margin-left: 15px;
        background-color: #f9ecf1ff;
    }
`

const Button = styled.button`
    width: 170px;
    font-size: 16px;
    justify-content: center;
    background-color: #EE2B51;
`;

const DownloadArea = styled.div`
width: 1100px;
    background-color: white;
    padding: 15px;
`