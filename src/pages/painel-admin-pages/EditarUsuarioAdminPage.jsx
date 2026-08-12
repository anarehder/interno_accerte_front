import { useEffect, useState } from "react";
import styled from 'styled-components';
import { useAuth } from "../../contexts/AuthContext";
import apiService from "../../services/apiService";
import EditarUsuarioComponent from "../../components/admin/EditarUsuarioComponent";
import HeaderGGNewComponent from "../../components/gentegestao/HeaderGGNewComponent";

function EditarUsuarioAdminPage(){
    const { user } = useAuth();
    const [info, setInfo] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [updated, setUpdated] = useState(false);

    useEffect(() => {
        if (!user) return;
        const fetchInfo = async () => {
            try {
                const response = await apiService.buscarInfoCriarFunc();
                setInfo(response.data);
                setCarregando(false);
                setUpdated(false);
            } catch (error) {
                console.error("Erro ao buscar informações de funcionários:", error);
                setCarregando(false);
            }
        };

        fetchInfo();

    }, [user, updated]);

    return (
        <PageContainer>
            <HeaderGGNewComponent pageTitle={"Editar Usuário | Admin"} lastPage={"usuariosadmin"} />
            <Container>
                {carregando && <p>Carregando...</p>}
                {!carregando && info && <EditarUsuarioComponent info={info} setUpdated={setUpdated} />}
            </Container>
        </PageContainer>
    );
};

export default EditarUsuarioAdminPage;

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
    width: 100%;
    color: #555;
    border: none;
`
