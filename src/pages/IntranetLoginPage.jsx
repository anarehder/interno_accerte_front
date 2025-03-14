import React, { useEffect } from "react";
import styled from "styled-components";
import { FaMicrosoft } from "react-icons/fa";
import Logo from "../assets/LOGO-INTRANET.png";
import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";

function IntranetLoginPage() {
    const { instance } = useMsal();
    const navigate = useNavigate();

    const checkLogin = async () => {
      await instance.initialize(); 
      await instance.handleRedirectPromise();
      const accounts = instance.getAllAccounts();
      if (accounts.length > 0) {
        navigate("/intranet/homepage");
      } else {
        return accounts
      }
    };

    useEffect(() => {
      const accounts = instance.getAllAccounts();
      if (accounts.length > 0) {
        navigate("/intranet/homepage");
      }
      checkLogin();
    }, [instance, navigate]);

    const handleLogin = async () => {
      const accounts = await checkLogin();
      if (accounts.length === 0) {
        // No user signed in
        instance.loginRedirect();
      }
    };

    return (
        <Container>
            <LogoContainer>
                <img src={Logo} alt="ACCERTE" />
                <h1>INTRANET</h1>
            </LogoContainer>
            <LoginBox>
                <Title>FAÇA SEU LOGIN</Title>
                <Title>PARA ACESSAR</Title>
                <OAuthButton onClick={handleLogin}>
                    <FaMicrosoft /> Entrar com Microsoft
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