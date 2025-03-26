import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import BannerTopo from "../assets/INTRANET_BANNER.png"
import { useAuth } from "../contexts/AuthContext";

const ContactsPage = () => {{
    const { dados } = useAuth();

    return (
        <Container>

            <Link to="/homepage">
                <ReturnButton> Voltar </ReturnButton>
            </Link>
            <HeaderContainer>
                <div>
                    <h1>Contatos </h1>
                </div>
            </HeaderContainer>
            {/* <Title>Lista de Contatos</Title> */}
            <List>
                {dados?.agenda?.map((contato, index) => (
                    <ContactCard key={index}>
                        <Name>{contato.name}</Name>
                        <Info>Email: {contato.mail}</Info>
                        <Info>Telefone: {contato.mobilePhone}</Info>
                        <Info>Cargo: {contato.jobTitle}</Info>
                        <Info>Local: {contato.officeLocation}</Info>
                    </ContactCard>
                ))}
            </List>
        </Container>
    );
  };
}

export default ContactsPage;
  
const HeaderContainer = styled.div`
    background-color: #434343;
    height: 200px;
    background: url(${BannerTopo}) no-repeat right center;
    background-size: cover;
    color: #067DD1;
    overflow: hidden;
    div{
        width: 50%;
        background-color: white;
        border-bottom-right-radius: 80px;
        box-shadow: 12px -21px 3px 5px rgba(0, 0, 0, 0.2);
        justify-content: center;
        align-items: center;
        h1 {
            width: 80%;
            text-align: left;
            line-height: 50px;
            font-size: 36px;
            // background-color: red;
        }
    }
`
const ReturnButton = styled.button`
    top: 2%;
    left: 2%;
    position: absolute;
    font-size: 16px;
    justify-content: center;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: #007bff;
    color: white;
    &:hover {
        background-color: #0056b3;
    }
`;

const Container = styled.div`
    flex-direction: column;
    border-radius: 8px;
    align-items: center;
`;
  
const List = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 90%;
    margin-top: 30px;
`;
  
  const ContactCard = styled.div`
    background: white;
    padding: 15px 25px;
    align-items: center;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    gap: 20px;
    flex-wrap: wrap;
  `;
  
  const Name = styled.h3`
    margin: 0;
    color: #007bff;
    width: 200px;
  `;
  
  const Info = styled.p`
    margin: 5px 0;
    color: #555;
    width: 250px;
  `;
  

  