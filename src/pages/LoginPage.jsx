import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useMsal } from "@azure/msal-react";
import { useIsAuthenticated } from '@azure/msal-react';
import { useNavigate  } from "react-router-dom";
import { FaMicrosoft } from "react-icons/fa";
import { loginRequest } from "../services/authConfig";
import Background from "../assets/basic/pagina-inicial.png"

function LoginPage() {
    const { instance } = useMsal();
    const isAuthenticated = useIsAuthenticated();
    const navigate = useNavigate(); 
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    useEffect(() => {
      if (isAuthenticated) {
        setIsAuthenticating(true);
        // Aguarda 1 segundo antes de redirecionar
        const timer = setTimeout(() => {
          navigate("/homepage");
        }, 1000);
        
        return () => clearTimeout(timer);
      }
    }, [isAuthenticated, navigate]);

  const handleLogin = async (loginType) => {
    if (loginType === "popup") {
      await instance.loginPopup(loginRequest).catch(e => {
        // console.log(e);
      });
    } else if (loginType === "redirect") {
      await instance.loginRedirect(loginRequest).catch(e => {
        // console.log(e);
      });
    }
  }

    return (
        <PageContainer>
            <LogoContainer>
            </LogoContainer>
            <LoginBox>
                <Title><span>Intra</span>net</Title>
                <SubTitle>accerte</SubTitle>
                {isAuthenticating ? (
                    <LoadingMessage>Carregando...</LoadingMessage>
                ) : (
                    <OAuthButton onClick={() => handleLogin("redirect")}>
                        <FaMicrosoft /> ENTRAR
                    </OAuthButton>
                )}
            </LoginBox>
        </PageContainer>
    );
}

export default LoginPage;

// 🎨 Estilização com Styled Components
const PageContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 100vh;
  // background-size: auto 105%;
  background: #0056BF url(${Background}) no-repeat top center;
  background-size: cover;
`;

const LogoContainer = styled.div`
  flex-direction: column;
  height: 75vh;
  width: 40%;
  justify-content: center;
  align-items: flex-end;
  gap: 15px;
  img{
    width: 35vw;
  }
  h1{
    font-size: 76px;
    color: #343434;
    font-family: 'Conthrax', sans-serif;
  }
`

const LoginBox = styled.div`
  width: 30%;
  // border-radius: 8px;
  border-left: 1px solid white;
  margin-bottom: 5%;
  // background-color: red;
  height: 250px;
  width: 600px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  gap: 20px;
  img {
    width: 418px;
  }
`;

const Title = styled.h2`
  color: white;
  line-height: 30px;
  font-family: "Poppins", serif;
  font-weight:  400;
  font-size: 110px;
  font-style: normal;
  span {
    font-weight:  700;
  }
`;

const SubTitle = styled.h2`
  color: white;
  line-height: 30px;
  font-family: "Conthrax";
  font-weight:  300;
  font-size: 65px;
  font-style: normal;
  margin-top: 25px;
  span {
    font-weight:  700;
  }
`;

const OAuthButton = styled.button`
  width: 250px;
  height: 70px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 45px;
  font-weight: 700;
  font-size: 30px;
  gap: 8px;
  font-family: "Poppins", serif;
  background: linear-gradient(109.11deg, #FFFFFF 37.13%, #BABABA 100.91%);
  color:  #082764;
    &:hover {
      background: linear-gradient(to right,#205fdd, #001143);
      color: white;
    }
`;

const LoadingMessage = styled.div`
  color: white;
  width: 250px;
  font-size: 24px;
  font-family: "Poppins", serif;
  font-weight: 400;
  margin-top: 45px;
  text-align: center;
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;