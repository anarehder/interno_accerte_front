import styled from 'styled-components';
import { Link } from 'react-router-dom';
import logo from "../assets/LOGO_PNG.png";
import CertificationsValueComponent from '../components/CertificationsValuesComponent';

function CertificationsPage() {
    
    return (
        <PageContainer>
            <Link to="/portal">
                <Button> Voltar </Button>
            </Link>
            <TitleContainer>
                <img src={logo} alt="Logo"/>
                <div>
                <p>PORTAL ACCERTE</p>
                CERTIFICAÇÕES
                </div>
            </TitleContainer>
            <ButtonsContainer>
                <Button>VALORES</Button>
                <Button>MICROSOFT</Button>
                <Button>ORACLE</Button>
                <Button>DENODO</Button>
                <Button>FORTINET</Button>
                <Button>SEGURANÇA</Button>
                <Button>LPIC</Button>
                <Button>ZABBIX</Button>
            </ButtonsContainer>
            
            <CertificationsValueComponent />
        </PageContainer>
    )
}

export default CertificationsPage;

const PageContainer = styled.div`
    width: 100%;
    height: 100%;
    min-height: 100vh;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    a {
        position: absolute;
        left: 2%;
        top: 3%;
    }
`

const TitleContainer = styled.div`
    width: 80%;
    gap: 15px;
    justify-content: center;
    margin: 10px 0;
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
  width: 100%;
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

const ButtonsContainer = styled.div`
    width: 80%;
    gap: 15px;
    margin-top: 15px;
    button {
        background-color: #345B68;
    }
`