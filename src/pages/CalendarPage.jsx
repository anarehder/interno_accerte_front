import React from "react";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import HeaderGGComponent from "../components/HeaderGGComponent";

const CalendarPage = () => {{
    const { dados } = useAuth();

    return (
        <Container>
            <HeaderGGComponent pageTitle={"Calendários"} />
            <List>
            {dados?.calendario?.map((file, index) => (
                <div key={index}>
                    <h1>{file.name.slice(0,-5)}</h1>
                    <Image  src={file.url} alt={`Aniversário ${file.name}`} />
                </div>
                
            ))}
            </List>
        </Container>
    );
  };
}

export default CalendarPage;

const Container = styled.div`
    flex-direction: column;
    border-radius: 8px;
    align-items: center;
    min-height: 100vh;
    color: black;
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
        width: 45%;
        align-items: center;
    }
`;

const Image = styled.img`
    width: 450px;
    height: 650px;
    object-fit: cover;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;