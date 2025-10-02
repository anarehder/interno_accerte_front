import styled from 'styled-components';
import { useEffect, useState } from 'react';
import apiService from '../services/apiService';
import HeaderGGNewComponent from '../components/gentegestao/HeaderGGNewComponent';

function OrganogramaPage() {
    const [organograma, setOrganograma] = useState([]);
    // console.log(organograma);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiService.buscarOrganograma();
                setOrganograma(response.data.elements);
            } catch (error) {
                console.error("Erro ao buscar o organograma:", error);
            }
        };

        fetchData();

    }, []);

    return (
        <PageContainer>
            <HeaderGGNewComponent pageTitle={`Organograma`} />
            {organograma.length > 0 && organograma.map((i) => (
                <ImageContainer key={i.uniqueid}>
                    <a href={i.url} target="_blank" download={`${i.name.slice(0, -4)}.jpg`}>
                        <Button>Download imagem</Button>
                    </a>
                    <Image src={i.url} alt={`${i.name}`} />
                </ImageContainer>
            ))}
        </PageContainer>
    )
}

export default OrganogramaPage;

const PageContainer = styled.div`
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    color: #555;
    margin-bottom: 30px;
    background-color: #F0F5F9;
`

const ImageContainer = styled.div`
    width: 100%;
    flex-direction: column;
    align-items: center;
    margin: 0 auto;
    margin-top: 10px;
    position: relative;
`
const Image = styled.img`
    width: 98%;
    object-fit: cover;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const Button = styled.button`
    top: 5px;
    right: 25px;
    position: absolute;
    width: 100px;
    font-size: 15px;
    justify-content: center;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: #ED1F4C;
    color: white;
    &:hover {
        background-color: #ED1F4C;
    }
`;