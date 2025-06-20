import React, { useEffect } from "react";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import HeaderNewComponent from "../components/basic/HeaderNewComponent";

const CompliancePage = () => {{
    const { dados } = useAuth();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <Container>
            <HeaderNewComponent pageTitle={"Compliance"}/>
            <List>
                <h1>Canais de Denúncias
                    <div>
                        <div>
                        <h2>Telefone: (62) 3945-9510</h2>
                        <h2> canaldedenuncia@accerte.com.br</h2>
                        </div>
                        {/* <p>opção 7 - Fale conosco <br/> (agente interno)</p>
                        <p>opção 8 - Canal de denúncia <br/>(agente externo)</p> */}
                    </div>   
                </h1>
            </List> 
            <List>
                {dados?.compliance?.map((file, index) => (
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

export default CompliancePage;
  

const Container = styled.div`
    flex-direction: column;
    border-radius: 8px;
    align-items: center;
    min-height: 100vh;
    color: rgb(75, 74, 75);
`;


const List = styled.div`
    display: flex;
    flex-direction: column;
    gap: 40px;
    margin: 30px 0;
    justify-content: center;
    align-items: center;
    width: 55%;
    h1 {
        div {
            margin-top: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
            p{
                width: 200px;
                font-size: 18px;
            }
            div {
                flex-direction: column;
                width: 450px;
            }
        }
    }
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