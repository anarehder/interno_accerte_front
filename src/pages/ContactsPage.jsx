import React from "react";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import HeaderComponent from "../components/HeaderComponent";

const ContactsPage = () => {{
    const { dados } = useAuth();

    return (
        <Container>
            <HeaderComponent pageTitle={"Contatos"} type={"page"}/>
            <List>
                <ContactCard>
                    <Info><span>Nome</span></Info>
                    <Info><span>Email</span></Info>
                    <Info><span>Telefone</span></Info>
                    <Info><span>Cargo</span></Info>
                    <Info><span>Gestor</span></Info>
                </ContactCard>
                {dados?.agenda
                ?.filter(contato => contato.officeLocation !== "NA" && contato.officeLocation !== "OFF")
                .map((contato, index) => (
                    <ContactCard key={index}>
                        <Info>{contato.name}</Info>
                        <Info>{contato.mail}</Info>
                        <Info>{contato.mobilePhone}</Info>
                        <Info>{contato.jobTitle}</Info>
                        <Info>{contato.manager}</Info>
                    </ContactCard>
                ))}
            </List>
        </Container>
    );
  };
}

export default ContactsPage;
  

const Container = styled.div`
    flex-direction: column;
    border-radius: 8px;
    align-items: center;
`;
  
const List = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 97%;
    margin: 30px 0;
`;

const ContactCard = styled.div`
    background: white;
    padding: 15px 0;
    align-items: center;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    gap: 30px;
    flex-wrap: wrap;
    justify-content: center;
`;

const Info = styled.p`
    margin: 5px 0;
    color: #555;
    width: 15%;
    text-align: center;
    word-break: break-word;
    &:nth-of-type(2) {
        width: 25%;
    }
    span{
      font-weight: bold;
    }
`;
  

  