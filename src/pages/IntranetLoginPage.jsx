import React, { useEffect } from "react";
import styled from "styled-components";
import { useMsal } from "@azure/msal-react";
import { useIsAuthenticated } from '@azure/msal-react';
import { useNavigate  } from "react-router-dom";
import { FaMicrosoft } from "react-icons/fa";
import Logo from "../assets/LOGO_HOME.png";
import { loginRequest } from "../services/authConfig";
import ImgFundo from "../assets/FUNDO_HOME.png"
import Accerte from "../assets/ACCERTE_HOME.png"

function IntranetLoginPage() {
    const { instance } = useMsal();
    const isAuthenticated = useIsAuthenticated();
    const navigate = useNavigate(); 
    // console.log(import.meta.env.VITE_APP_CLIENT);
    // console.log(import.meta.env.VITE_API_URL);
    useEffect(() => {
      if (isAuthenticated) {
        navigate("/intranet/homepage");
      }
    }, [isAuthenticated, navigate]);

  const handleLogin = async (loginType) => {
    if (loginType === "popup") {
      await instance.loginPopup(loginRequest).catch(e => {
        console.log(e);
      });
    } else if (loginType === "redirect") {
      await instance.loginRedirect(loginRequest).catch(e => {
        console.log(e);
      });
    }
  }

    return (
        <PageContainer>
            <LogoContainer>
                <img src={Logo} alt="ACCERTE" />
                {/* <h1>INTRANET</h1> */}
            </LogoContainer>
            <LoginBox>
                <Title>Intra<span>net</span></Title>
                <img src={Accerte} alt="ACCERTE" />
                {/* <OAuthButton onClick={() => handleLogin("popup")}>
                    <FaMicrosoft /> Entrar com Microsoft - PopUp
                </OAuthButton> */}
                <OAuthButton onClick={() => handleLogin("redirect")}>
                    <FaMicrosoft /> ENTRAR
                </OAuthButton>
            </LoginBox>
        </PageContainer>
    );
}

export default IntranetLoginPage;

// 🎨 Estilização com Styled Components
const PageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: url(${ImgFundo}) no-repeat center center;
  background-size: cover;
  gap: 50px;
`;

const LogoContainer = styled.div`
  flex-direction: column;
  height: 75vh;
  width: 40%;
  border-right: 3px solid WHITE;
  justify-content: center;
  align-items: flex-end;
  gap: 15px;
  // background-color: red;
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
  border-radius: 8px;
  // background-color: red;
  height: 55vh;
  width: 600px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 50px;
  img {
    width: 418px;
  }
`;

const Title = styled.h2`
  color: white;
  line-height: 30px;
  font-family: "Poppins", serif;
  font-weight:  300;
  font-size: 120px;
  font-style: normal;
  margin-top: 25px;
  span {
    font-weight:  700;
  }
`;

const OAuthButton = styled.button`
  width: 85%;
  height: 70px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  gap: 8px;
  font-family: "Poppins", serif;
  background: white;
      color: #067DD1;
      &:hover {
        background: #1a1a1a;
  }
`;