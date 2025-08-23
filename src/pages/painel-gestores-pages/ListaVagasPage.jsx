import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import apiService from '../../services/apiService';
import ListagemVagasGestoresComponent from '../../components/ListagemVagasGestoresComponent';
import HeaderImageComponent from '../../components/basic/HeaderImageComponent';
import MinhasVagas from '../../assets/painel-gestores/minhas-vagas.png';

function ListaVagasPage() {
    const { user } = useAuth();
    const [errorMessage, setErrorMessage] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [vagas, setVagas] = useState([]);
    const [updated, setUpdated] = useState(false);

    useEffect(() => {
        if (!user) return;
        const fetchScale = async () => {
            try {
                const body = {adminEmail: user.mail};
                const response = await apiService.getVagas(body);
                setVagas(response.data);
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
            <HeaderImageComponent pageTitle={"Minhas"} subtitle={"Vagas"} lastPage={"painelgestores"} image={MinhasVagas} />
            <Container>
            <h2>Acompanhamento Contratações</h2>
            {errorMessage && <h3>{errorMessage}</h3>}
            {(vagas.length === 0 && !carregando) && <h3>Sem vagas para exibir na sua área.</h3>}
            
            {vagas.length !== 0 && !carregando && (
                <CardsContainer>
                    {vagas.map((v, index) => (
                        <ListagemVagasGestoresComponent key={index} vaga={v}  setUpdated={setUpdated}/>
                    ))}
                </CardsContainer>
            )}   
            </Container>
        </PageContainer>
    )
}

export default ListaVagasPage;

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
}
`
const CardsContainer = styled.div`
    flex-wrap: wrap;
    gap: 5%;
    justify-content: center;
`