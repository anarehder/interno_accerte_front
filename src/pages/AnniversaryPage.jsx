import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import HeaderGGNewComponent from "../components/gentegestao/HeaderGGNewComponent";

const AnniversaryPage = () => {
    const { dados } = useAuth();
    const mes = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date());
    const mesFormatado = mes.charAt(0).toUpperCase() + mes.slice(1).toLowerCase();
    return (
        <Container>
            <HeaderGGNewComponent pageTitle={`Aniversários`} subtitle={` | ${mesFormatado}`} />
            <List>
                {dados?.aniversarios?.map((file, index) => (
                    <a href={file.url} target={"_blank"} key={index}>
                        <Image src={file.url} alt={`Slide ${file.name}`} />
                    </a>
                ))}
            </List>
            <div>{dados.aniversarios[0].webUrl} </div>
        </Container>
    );
};

export default AnniversaryPage;

const Container = styled.div`
    flex-direction: column;
    border-radius: 8px;
    align-items: center;
    min-height: 100vh;
    color: black;
`;


const List = styled.div`
    display: flex;
    gap: 50px;
    width: 95%;
    margin-top: 30px;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 20px;
    a{
        background-color: red;
        width: 400px;
        height: 400px;
        flex-shrink: 0;
        border-radius: 10px;
    }
`;

const Image = styled.img`
    width: 400px;
    height: 400px;
    object-fit: cover;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;