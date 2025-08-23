import { useEffect, useState } from "react";
import styled from 'styled-components';
// import apiService from "../services/apiService";
import { useAuth } from "../contexts/AuthContext";
import apiService from "../services/apiService";
import CriarUsuarioComponent from "../components/admin/CriarUsuarioComponent";
import EditarUsuarioComponent from "../components/admin/EditarUsuarioComponent";
import EditScaleComponent from "../components/EditScaleComponent";
import EditarEscalaComponent from "../components/admin/EditarEscalaComponent";
import CriarEscalaComponent from "../components/admin/CriarEscalaComponent";
import ScaleTableComponent from "../components/ScaleTableComponent";

function EscalasAdminComponent(){
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
        <Container>
            {dados && !carregando &&
                <ButtonsContainer>
                    <Button onClick={() => setAction("Criar")} $active={action === "Criar" ? "show" : ""}>
                        Criar Escala
                    </Button>
                    <Button onClick={() => setAction("Editar")} $active={action === "Editar" ? "show" : ""}>
                        Editar Escala
                    </Button>
                </ButtonsContainer>
            }
            {action === "Criar" && <CriarEscalaComponent info={info} setUpdated={setUpdated} />}  
            {action === "Editar" && !carregando && <ScaleTableComponent type={"admin"} />}
        </Container>
    );
};

export default EscalasAdminComponent;

const Container = styled.div`
    width: 90%;
    flex-direction: column;
    align-items: center;
    margin-bottom: 50px;
    gap: 25px;
    padding: 20px;
`

const ButtonsContainer = styled.div`
    width: 50%;
    justify-content: center;
    gap: 30px;
`

const Button = styled.button`
    background-color: #F94A5F;
    border: ${({ $active }) => ($active === 'show' ? "3px solid #555" : "3px solid #ff5843")};
    &:hover {
        background-color: ${({ active }) => (active === 'show' ? "#ff5843" : "white")};
        color: ${({ active }) => (active === 'show' ?"white" : '#ff5843')};
        border: 3px solid #ff5843;
    };
`