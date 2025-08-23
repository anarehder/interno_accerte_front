import { useEffect, useState } from "react";
import styled from 'styled-components';
import { useAuth } from "../../contexts/AuthContext";
import apiService from "../../services/apiService";
import CriarEscalaComponent from "../../components/admin/CriarEscalaComponent";
import ScaleTableComponent from "../../components/ScaleTableComponent";
import HeaderGGNewComponent from "../../components/gentegestao/HeaderGGNewComponent";

function EscalasAdminPage(){
    const { user, dados } = useAuth();
    const [info, setInfo] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [updated, setUpdated] = useState(false);
    const [action, setAction] = useState("");
    
    useEffect(() => {
        if (!user) return;
        const fetchScale = async () => {
            try {
                const response = await apiService.buscarInfoCriarFunc();
                setInfo(response.data);
                setCarregando(false);
                setUpdated(false);
            } catch (error) {
                setErrorMessage(error.response.data.message);
                setCarregando(false);
            }
        };

        fetchScale();

    }, [user, updated]);

    return (
        <PageContainer>
                 <HeaderGGNewComponent pageTitle={"Painel Escalas | Admin"} lastPage={"admin"} />
        <Container>
            {dados && !carregando &&
                <ButtonsContainer>
                    <Button onClick={() => setAction("Criar")}>
                        Criar Escala
                    </Button>
                    <Button onClick={() => setAction("Editar")}>
                        Editar Escala
                    </Button>
                </ButtonsContainer>
            }
            {action === "Criar" && <CriarEscalaComponent info={info} setUpdated={setUpdated} />}  
            {action === "Editar" && !carregando && <ScaleTableComponent type={"admin"} />}
        </Container>
        </PageContainer>
    );
};

export default EscalasAdminPage;

const PageContainer = styled.div`
    width: 100%;
    min-height: 100%;
    flex-direction: column;
    align-items: center;
    position: absolute;
    gap: 20px;
    color:rgb(75, 74, 75);
`

const Container = styled.div`
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    gap: 10px;
    color: #555;
    border: none;
    h2 {
        margin: 10px 0;
    }
`
const ButtonsContainer = styled.div`
    width: 50%;
    justify-content: center;
    gap: 30px;
`

const Button = styled.button`
    background: linear-gradient(94.61deg, #E7185A 3.73%, #aa1041ff 133.27%);
    height: 50px;
    &:hover {
        background-color: white;
        background: white;
        color: #E7185A;
        border: 3px solid #ff5843;
    };
`