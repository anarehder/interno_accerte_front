import React from "react";
import styled from "styled-components";

function ContactsComponent({contatos}){
    
    return (
        <Container>
            <List>
                <ContactCard>
                    <Info><span>Nome</span></Info>
                    <Info><span>E-mail</span></Info>
                    <Info><span>Telefone</span></Info>
                    <Info><span>Cargo</span></Info>
                    <Info><span>Gestor</span></Info>
                </ContactCard>
                {contatos
                .filter(contato => contato.officeLocation !== "NA" && contato.officeLocation !== "OFF")
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
}

export default ContactsComponent;
  

const Container = styled.div`
    flex-direction: column;
    border-radius: 8px;
    align-items: center;
    
`;
  
const List = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin: 30px 0;
`;

const ContactCard = styled.div`
    background: white;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 95%;
    height: 50px;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    &:nth-of-type(1) {
        background-color: #001F3F;
    }
`;

const Info = styled.p`
    color: #555;
    width: 18%;
    text-align: center;
    word-break: break-word;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1); // sombra suave
    &:nth-of-type(2) {
        width: 28%;
    }
    span{
        width: 100%;
        height: 100%;
        font-weight: bold;
        background-color: #001F3F;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;
  