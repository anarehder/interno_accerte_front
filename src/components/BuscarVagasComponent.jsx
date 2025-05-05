import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import apiService from '../services/apiService';

function BuscarVagasComponent() {
    const { user } = useAuth();
    const [errorMessage, setErrorMessage] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [vagas, setVagas] = useState([]);


    useEffect(() => {
        if (!user) return;
        const fetchScale = async () => {
            try {
                // const body = {adminEmail: "wandyna.oliveira@accerte.com.br"};
                const body = {adminEmail: user.mail};
                const response = await apiService.getVagas(body);
                setVagas(response.data);
                setCarregando(false);
            } catch (error) {
                setErrorMessage(error.response.data.message);
                setCarregando(false);
            }
        };

        fetchScale();

    }, [user]);

    return (
        <PageContainer>
            <h2>Acompanhamento Contratações</h2>
            {errorMessage && <h3>{errorMessage}</h3>}
            {(vagas.length === 0 && !carregando) && <h3>Sem vagas para exibir na sua área.</h3>}
            {(vagas.length !== 0 && !carregando) && <h3>Tenho {vagas.length} vagas.</h3>}
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