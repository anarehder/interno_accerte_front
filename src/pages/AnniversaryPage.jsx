import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import BannerTopo from "../assets/INTRANET_BANNER.png"
import { useAuth } from "../contexts/AuthContext";

const AnniversaryPage = () => {{
    const { dados } = useAuth();

    return (
        <Container>

            <Link to="/homepage">
                <ReturnButton> Voltar </ReturnButton>
            </Link>
            <HeaderContainer>
                <div>
                    <h1>Aniversários </h1>
                </div>
            </HeaderContainer>
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
`;

const Image = styled.img`
    width: 350px;
    height: 350px;
    object-fit: cover;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;