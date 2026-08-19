import styled from "styled-components";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import apiServiceBucket from "../services/apiServiceBucket";
import HeaderGGNewComponent from "../components/gentegestao/HeaderGGNewComponent";

const CalendarPage = () => {
    const { user } = useAuth();
    const [calendarios, setCalendarios] = useState([]);

    useEffect(() => {
        if (!user) return;
        const fetchCalendarios = async () => {
            const body = { email: user.mail };
            try {
                const response = await apiServiceBucket.buscarArquivosCloudPorGrupo("Calendário", body);
                setCalendarios(response.data || []);
            } catch (error) {
                console.error("Erro ao buscar calendários:", error);
            }
        };
        fetchCalendarios();
    }, [user]);

    return (
        <Container>
            <HeaderGGNewComponent  pageTitle={`Calendários`} />
            <List>
                {calendarios.map((file, index) => (
                    <div key={file.uniqueid ?? index}>
                        <a href={file.arquivo} target="_blank" download={`${file.descricao}.jpg`}>
                            <Button>Download imagem</Button>
                        </a>
                        <Image src={file.arquivo} alt={file.descricao} />
                    </div>
                ))}
            </List>
        </Container>
    );
};

export default CalendarPage;

const Container = styled.div`
    flex-direction: column;
    border-radius: 8px;
    align-items: center;
    min-height: 100vh;
    color: black;
`;

const Button = styled.button`
    top: -15px;
    right: -15px;
    position: absolute;
    width: 70px;
    font-size: 13px;
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


const List = styled.div`
    display: flex;
    gap: 40px;
    width: 90%;
    margin-top: 30px;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 20px;
    div {
        flex-direction: column;
        width: 500px;
        height: 700px;
        align-items: center;
        position: relative;
    }
`;

const Image = styled.img`
    height: 100%;
    width: auto;
    max-width: 100%;
    object-fit: contain;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;
