import { useEffect, useState } from "react";
import styled from 'styled-components';
import { useAuth } from "../../contexts/AuthContext";
import apiService from "../../services/apiService";
import CriarUsuarioComponent from "../../components/admin/CriarUsuarioComponent";
import EditarUsuarioComponent from "../../components/admin/EditarUsuarioComponent";
import HeaderGGNewComponent from "../../components/gentegestao/HeaderGGNewComponent";

function UsuariosAdminPage(){
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
         <HeaderGGNewComponent pageTitle={"Painel Usuários | Admin"} lastPage={"admin"} />
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
        </PageContainer>
    );
};

export default UsuariosAdminPage;

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
        background-color: ${({ $active }) => ($active === 'show' ? "#ff5843" : "white")};
        color: ${({ $active }) => ($active === 'show' ?"white" : '#ff5843')};
        border: 3px solid #ff5843;
    };
`