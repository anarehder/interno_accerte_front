import { useEffect, useState } from "react";
import styled from "styled-components";
import { useFuncionarios } from "../../contexts/FuncionariosContext";
import apiService from "../../services/apiService";
import GestoresListComponent from "../../components/admin/GestoresListComponent";
import HeaderGGNewComponent from "../../components/gentegestao/HeaderGGNewComponent";

function GestoresAdminPage() {
    const { dados, carregando, getData, getGestores } = useFuncionarios();
    const [areas, setAreas] = useState([]);

    useEffect(() => {
        getData();

        const fetchAreas = async () => {
            try {
                const response = await apiService.buscarAreas();
                setAreas(response.data);
            } catch (error) {
                console.error("Erro ao buscar áreas:", error);
            }
        };

        fetchAreas();
    }, []);

    return (
        <PageContainer>
            <HeaderGGNewComponent pageTitle={"Gestores por Área | Admin"} lastPage={"admin"} />
            <Container>
                {carregando && <p>Carregando...</p>}
                {!carregando && dados && (
                    <GestoresListComponent
                        funcionarios={dados.funcionarios}
                        gestores={dados.gestores}
                        areas={areas}
                        getData={getGestores}
                    />
                )}
            </Container>
        </PageContainer>
    );
}

export default GestoresAdminPage;

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
