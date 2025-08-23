import { useEffect, useState } from "react";
import styled from 'styled-components';
// import apiService from "../services/apiService";
import { useAuth } from "../contexts/AuthContext";
import apiService from "../services/apiService";
import CriarUsuarioComponent from "../components/admin/CriarUsuarioComponent";
import EditarUsuarioComponent from "../components/admin/EditarUsuarioComponent";

function UsuariosAdminComponent(){
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
                        Criar Usuario
                    </Button>
                    <Button onClick={() => setAction("Editar")} $active={action === "Editar" ? "show" : ""}>
                        Editar Usuario
                    </Button>
                </ButtonsContainer>
            }
            {action === "Criar" && <CriarUsuarioComponent info={info} setUpdated={setUpdated} />}  
            {action === "Editar" && <EditarUsuarioComponent info={info} setUpdated={setUpdated} />}            
        </Container>
    );
};

export default UsuariosAdminComponent;

const Container = styled.div`
    width: 60%;
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