import styled, { keyframes } from "styled-components";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import download from "downloadjs";
import { useRef, useEffect, useState } from "react";
import apiService from "../../services/apiService";
import { useAuth } from "../../contexts/AuthContext";
import HeaderImageComponent from "../../components/basic/HeaderImageComponent";
import TabelaListaFeedbackComponent from "../../components/gestores/TabelaListaFeedbackComponent";


const ListaFeedbackGestorPage = () => {
    const { user } = useAuth();
    const imageRef = useRef(null);
    const imageRef1 = useRef(null);
    const imageRef2 = useRef(null);
    const [feedbacks, setFeedbacks] = useState([]);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [feedbackId, setFeedbackId] = useState("");
    const [updated, setUpdated] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) return;

        const fetchScale = async () => {
            try {
                const response = await apiService.buscarFeedbackOnboarding();
                if (user.mail !== "maria.silva@accerte.com.br" && user.mail !=="ana.rehder@accerte.com.br") {
                    const fbs = response.data.filter(
                        (item) => item.Responsavel?.email === user.mail
                    );
                    setFeedbacks(fbs);
                } else{
                    setFeedbacks(response.data);
                }
                setUpdated(false);
            } catch (error) {
                console.error("Erro ao buscar informacoes dos funcionários:", error);
            }
        };

        fetchScale();

    }, [user, updated]);

    const handleDownload = async () => {
        setLoading(true);
        try {
            const pdf = new jsPDF("p", "mm", "a4");

            // captura primeira página
            if (imageRef1.current) {
                const dataUrl1 = await toPng(imageRef1.current, { quality: 1, pixelRatio: 3 });
                const imgProps1 = pdf.getImageProperties(dataUrl1);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps1.height * pdfWidth) / imgProps1.width;
                pdf.addImage(dataUrl1, "PNG", 0, 0, pdfWidth, pdfHeight);
            }

            // captura segunda página (nova página no PDF)
            if (imageRef2.current) {
                const dataUrl2 = await toPng(imageRef2.current, { quality: 1, pixelRatio: 3 });
                const imgProps2 = pdf.getImageProperties(dataUrl2);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps2.height * pdfWidth) / imgProps2.width;
                pdf.addPage();
                pdf.addImage(dataUrl2, "PNG", 0, 0, pdfWidth, pdfHeight);
            }

            pdf.save(`Avaliacao-Feedback-${selectedFeedback.Funcionario.nome}-${selectedFeedback.periodo}.pdf`);
        } catch (error) {
            console.error("Erro ao gerar o PDF:", error);
        } finally {
            setLoading(false); // desativa loading
        }
    };


    const handleClick = async () => {
        try {
            const response = await apiService.validarFeedbackOnboarding(selectedFeedback.id);
            if (response.status === 200) {
                alert("Feedback validado com sucesso!");
                setUpdated(true);
            }
        } catch (error) {
            console.error("Erro ao enviar requisição:", error);
        }
    };

    // console.log(feedbacks);
    return (
        <Container>
            <HeaderImageComponent pageTitle={"Feedback"} subtitle={"Onboarding"} lastPage={"painelgestores"} />
            <List>
                {feedbacks.length > 0 ?
                    feedbacks?.map((f) => (
                        <Item key={f.id}>
                            <Titulo>
                                <div>Funcionário: {f.Funcionario.nome} {f.Funcionario.sobrenome}</div>
                                <div>Período: {f.periodo} dias</div>
                                <div>
                                {(feedbackId === f.id) ? <Button onClick={() => {
                                    setFeedbackId("");
                                    setSelectedFeedback(null);
                                }}> Fechar </Button> :
                                    <Button onClick={() => {
                                        setFeedbackId(f.id);
                                        setSelectedFeedback(f);
                                    }}> Detalhes </Button>}
                                {
                                    selectedFeedback &&
                                    <Button onClick={handleDownload} disabled={loading}>
                                        {loading ? "Preparando arquivo..." : "Baixar PDF"}
                                    </Button>
                                }
                                {selectedFeedback && (user.mail === 'maria.silva@accerte.com.br' || 'ana.reher@accerte.com.br') && selectedFeedback.okRH === false &&
                                    <Button onClick={handleClick}>
                                        Validar Feedback
                                    </Button>
                                }
                                </div>
                        </Titulo>
                        {feedbackId === f.id &&
                            <DownloadArea>
                                {
                                    selectedFeedback && <TabelaListaFeedbackComponent feedback={selectedFeedback} imageRef1={imageRef1} imageRef2={imageRef2}/>
                                }
                            </DownloadArea>
                        }
                    </Item>
                ))
                :
                <Item>
                    <p>Sem feedbacks para exibir.</p>
                    </Item>
                }
            </List>
            {loading && (
                <Overlay>
                    <div>
                        <Spinner />
                        <p style={{ color: "#fff", textAlign: "center", marginTop: "8px" }}>
                            Gerando PDF, aguarde...
                        </p>
                    </div>
                </Overlay>
            )}

        </Container>
    )
};
export default ListaFeedbackGestorPage;

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    font-family: "Poppins", serif;
    margin-bottom: 50px;
`;

const List = styled.div`
    margin: 15px 0; 
    display: flex;
    flex-direction: column;
    align-items: center;
`

const Item = styled.div`
    width: 1400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 5px;
    box-shadow: 0px 0px 4px 4px rgba(0, 0, 0, 0.2);
    p{
        margin: 20px 0;
    }
`

const Titulo = styled.div`
    width: 1350px;
    justify-content: center;
    align-items: center;
    gap: 20px;
    div{
        min-height: 70px;
        align-items: center;
    }
    div:nth-of-type(1){
        width: 500px;
    }
    div:nth-of-type(2){
        width: 180px; 
    }
    div:nth-of-type(3){
        width: 600px;
        gap: 20px;
        justify-content: center;
    }
    button{
        width: 190px;
        color: white;
        height: 40px;
    }
`

const Button = styled.button`
    width: 170px;
    font-size: 16px;
    justify-content: center;
    background-color: #002266;
`;

const DownloadArea = styled.div`
    width: 1350px;
    background-color: white;
`

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// styled do spinner
const Spinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  animation: ${spin} 1s linear infinite;
  margin: 12px auto;
`;

// overlay opcional (fundo escuro transparente)
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  div{
    flex-direction: column;
    align-items: center; 
  }
`;