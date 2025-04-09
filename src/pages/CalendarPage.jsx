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
                        <a href={file.url} target="_blank" download={`${file.name.slice(0, -4)}.jpg`}>
                            <Button>Download imagem</Button>
                        </a>
                        <Image src={file.url} alt={`Aniversário ${file.name}`} />
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
        align-items: center;
        position: relative;
    }
`;

const Image = styled.img`
    width: 500px;
    height: 500px;
    object-fit: cover;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;