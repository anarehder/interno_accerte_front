import { Link } from 'react-router-dom';
import logo from "../assets/LOGO_PNG.png";
import styled from 'styled-components';

function TitleComponent({pageTitle}) {
    
    return (
        <PageContainer>
            <Link to="/intranet/homepage">
                <Button> Voltar </Button>
            </Link>
            <TitleContainer>
                <img src={logo} alt="Logo" />
                <div>
                    <p>PORTAL ACCERTE</p>
                    {pageTitle}
                </div>
            </TitleContainer>
        </PageContainer>
    )
}

export default TitleComponent;

const PageContainer = styled.div`
    width: 100%;
    position: relative;
    justify-content: center;   
`

const TitleContainer = styled.div`
    width: 80%;
    gap: 15px;
    justify-content: center;
    margin-top: 30px;
    align-items: center;
    font-family: "Lato", serif;
    font-weight: 400;
    font-style: normal;
    font-size: 30px;
    div{
        flex-direction: column;
        align-items: center;
        gap: 10px;
    }
    p {
        font-size: 50px;
        font-family: "Dosis", serif;
        word-spacing: 10px;
    }
    img {
        width: 100px;
        position: absolute;
        left: 10%;
    }
}
`

const Button = styled.button`
  top: 28%;
  left: 2%;
  position: absolute;
  font-size: 16px;
  justify-content: center;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: ${(props) => (props.color === "clear" ? "#ba1d2a" : "#007bff")};
  color: white;
  &:hover {
    background-color: ${(props) => (props.color === "clear"  ? "#962831" : "#0056b3")};
  }
`;