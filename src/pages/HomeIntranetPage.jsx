import React from "react";
import styled from "styled-components";
import { FaMicrosoft } from "react-icons/fa";
import { Link } from "react-router-dom";
import Logo from "../assets/LOGO-INTRANET.png";
// import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../services/authConfig";

const HomeIntranetPage = () => {

  // const { instance } = useMsal();
  const handleLogin = () => {
    // instance.loginPopup(loginRequest).then((response) => {
    //   console.log("Usuário autenticado:", response.account);
    //   fetchUserData(response.account);
    // }).catch((error) => console.error(error));
    alert("Entrar com Microsoft");
  };

  // const fetchUserData = async (account) => {
  //   const response = await fetch("http://localhost:5000/auth", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ email: account.username }),
  //   });
  //   const data = await response.json();
  //   console.log("Usuário no banco:", data);
  // };

  return (
    <Container>
      <LogoContainer>
        <img src={Logo} alt="ACCERTE" />
        <h1>INTRANET</h1>
      </LogoContainer>
      <LoginBox>
        <Title>FAÇA SEU LOGIN</Title>
        <Title>PARA ACESSAR</Title>
        <Link to={'/intranet/portal'} >
          <OAuthButton onClick={handleLogin}>
            <FaMicrosoft /> Entrar com Microsoft
          </OAuthButton>
        </Link>
        {/* <OAuthButton onClick={handleLogin}>
            <FaMicrosoft /> Entrar AQUI com Microsoft
          </OAuthButton> */}
      </LoginBox>
    </Container>
  );
};

export default HomeIntranetPage;

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