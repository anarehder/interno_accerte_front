import { useEffect, useState } from "react";
import styled from "styled-components";
import { useFuncionarios } from "../../contexts/FuncionariosContext";
import apiService from "../../services/apiService";
import FuncionariosListComponent from "../../components/admin/FuncionariosListComponent";
import HeaderGGNewComponent from "../../components/gentegestao/HeaderGGNewComponent";

function FuncionariosAdminPage() {
    const { dados, carregando } = useFuncionarios();
    const [info, setInfo] = useState(null);

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const response = await apiService.buscarInfoCriarFunc();
                setInfo(response.data);
            } catch (error) {
                console.error("Erro ao buscar informações de funcionários:", error);
            }
        };

        fetchInfo();
    }, []);

    return (
        <PageContainer>
            <HeaderGGNewComponent pageTitle={"Funcionários | Admin"} lastPage={"admin"} />
            <Container>
                {carregando && <p>Carregando...</p>}
                {!carregando && dados && (
                    <FuncionariosListComponent funcionarios={dados.funcionarios} gestores={dados.gestores} info={info} />
                )}
            </Container>
        </PageContainer>
    );
}

export default FuncionariosAdminPage;

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
