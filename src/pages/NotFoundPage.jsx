import { Link } from "react-router-dom";
import styled from "styled-components";

function NotFoundPage() {
  return (
    <Container>
      <h1>404 - Página Não Encontrada</h1>
      <p>A página que você procura não existe.</p>
      <Link to="/">Voltar para a Home</Link>
    </Container>
  );
}

export default NotFoundPage;


const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: #D9D9D9;
  gap: 20px;
  position: relative;
  font-family: 'Conthrax', sans-serif;
  h1 {
    padding-top: 50px;
    font-family: 'Conthrax', sans-serif;
  }
`;