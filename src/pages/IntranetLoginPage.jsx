import React, { useEffect } from "react";
import styled from "styled-components";
import { useMsal } from "@azure/msal-react";
import { useIsAuthenticated } from '@azure/msal-react';
import { useNavigate  } from "react-router-dom";
import { FaMicrosoft } from "react-icons/fa";
import Logo from "../assets/LOGO-INTRANET.png";
import { Link } from 'react-router-dom';
import { loginRequest } from "../services/authConfig";

function IntranetLoginPage() {
    const { instance } = useMsal();
    const isAuthenticated = useIsAuthenticated();
    const navigate = useNavigate(); 
    
    useEffect(() => {
      if (isAuthenticated) {
        navigate("/intranet/homepage");
      }
    }, [isAuthenticated, navigate]);

    const handleLogin = (loginType) => {
      if (loginType === "popup") {
          instance.loginPopup(loginRequest).catch(e => {
              console.log(e);
          });
      } else if (loginType === "redirect") {
        instance.loginRedirect(loginRequest).catch(e => {
              console.log(e);
          });
      }
    }

    return (
        <Container>
            <LogoContainer>
                <img src={Logo} alt="ACCERTE" />
                <h1>INTRANET</h1>
            </LogoContainer>
            <LoginBox>
                <Title>FAÇA SEU LOGIN</Title>
                <Title>PARA ACESSAR</Title>
                <Link to={"/intranet/homepage"}>
                <OAuthButton >
                    <FaMicrosoft /> Entrar com Microsoft
                </OAuthButton>
                </Link>
                <OAuthButton onClick={() => handleLogin("popup")}>
                    <FaMicrosoft /> Entrar com Microsoft - PopUp
                </OAuthButton>
                <OAuthButton onClick={() => handleLogin("redirect")}>
                    <FaMicrosoft /> Entrar com Microsoft - Redirect
                </OAuthButton>
            </LoginBox>
        </Container>
    );
}

export default IntranetLoginPage;

// 🎨 Estilização com Styled Components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #D9D9D9;
  gap: 50px;
`;

const LogoContainer = styled.div`
  flex-direction: column;
  height: 85vh;
  width: 50vw;
  border-right: 5px solid #343434;
  justify-content: center;
  align-items: flex-end;
  gap: 15px;
  padding-right: 50px;
  img{
    width: 50vw;
  }
  h1{
    font-size: 76px;
    color: #343434;
    font-family: 'Conthrax', sans-serif;
  }
`

const LoginBox = styled.div`
  background-color: #D9D9D9;
  padding: 2rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  width: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  color: #343434;
  line-height: 30px;
  font-family: 'Conthrax', sans-serif;
`;

const OAuthButton = styled.button`
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  margin-top: 2rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  gap: 8px;
  font-family: 'Conthrax', sans-serif;
  background: #2f2f2f;
      color: white;
      &:hover {
        background: #1a1a1a;
  }
`;