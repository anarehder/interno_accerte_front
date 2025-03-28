import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import BannerTopo from "../assets/INTRANET_BANNER.png"
import { useAuth } from "../contexts/AuthContext";
import HeaderComponent from "../components/HeaderComponent";

const AnniversaryPage = () => {{
    const { dados } = useAuth();
    const mes = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date());
    const mesFormatado = mes.charAt(0).toUpperCase() + mes.slice(1).toLowerCase();
    return (
        <Container>
            <HeaderComponent pageTitle={`Aniversários - ${mesFormatado}`} type={"page"} />
            <List>
            {dados?.aniversarios?.map((file, index) => (
                <Image key={index} src={file.url} alt={`Aniversário ${file.name}`} />
            ))}
            </List>
            <div>{dados.aniversarios[0].webUrl} </div>
        </Container>
    );
  };
}

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
    width: 90%;
    margin-top: 30px;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 20px;
`;

const Image = styled.img`
    width: 350px;
    height: 350px;
    object-fit: cover;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;