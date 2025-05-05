import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import apiService from '../services/apiService';

function BuscarVagasComponent() {
    const { user } = useAuth();
    const [carregando, setCarregando] = useState(true);


    useEffect(() => {
        if (!user) return;

        const fetchScale = async () => {
            try {
                const body = {adminEmail: user.mail};
                const response = await apiService.getFullVagas(body);
                console.log(response.data);
                setCarregando(false);
            } catch (error) {
                console.error("Erro ao buscar informacoes vagas:", error);
                setCarregando(false);
            }
        };

        fetchScale();

    }, [user]);

    return (
        <PageContainer>
            <h2>Status Vagas</h2>
        </PageContainer>
    )
}

export default BuscarVagasComponent;

const PageContainer = styled.div`
    margin: 0 10px 0 350px;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    gap: 10px;
    height: 60vh;
    color: #555;
    border: none;
    position: relative;
    overflow-y: scroll;
    h2 {
        margin: 10px 0;
    }
`