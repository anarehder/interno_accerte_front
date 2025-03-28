import React from "react";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import HeaderComponent from "../components/HeaderComponent";

const PolicyPage = () => {{
    const { dados } = useAuth();

    return (
        <Container>
            <HeaderComponent pageTitle={"Políticas"} type={"page"} />
            <List>
                {dados?.politicas?.map((file, index) => (
                <Card key={index}>
                    <Info>{file.name.slice(0,-4)}</Info>
                    <Info><button><a href={file.url} target="_blank"> Acessar </a></button></Info>
                </Card>
            ))}
            </List>
        </Container>
    );
  };
}

export default PolicyPage;
  

const Container = styled.div`
    flex-direction: column;
    border-radius: 8px;
    align-items: center;
    min-height: 100vh;
    color: black;
`;


const List = styled.div`
    display: flex;
    flex-direction: column;
    gap: 40px;
    margin: 30px 0;
    justify-content: center;
    align-items: center;
    width: 55%;
`;

const Card = styled.div`
    background: white;
    padding: 15px 25px;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    gap: 10%;
    flex-wrap: wrap;
    p:first-child {
        width: 70%;
    }
`;

const Info = styled.p`
    margin: 5px 0;
    color: #555;
    text-align: left;
`;
  