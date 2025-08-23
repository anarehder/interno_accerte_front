import { Link } from 'react-router-dom';
import Logo from "../assets/LOGO-INTRANET.png";
import styled from 'styled-components';

function IntranetHeaderComponent({pageTitle}) {
    
    return (
        <PageContainer>
            <Link to="/">
                <Button> Voltar </Button>
            </Link>
            <TitleContainer>
                <img src={Logo} alt="Logo" />
                <h1>INTRANET</h1>
                <h1> - </h1>
                <h1>{pageTitle}</h1>
            </TitleContainer>
        </PageContainer>
    )
}

export default IntranetHeaderComponent;

const PageContainer = styled.div`
    width: 100%;
    position: relative;
    justify-content: center;
    h1 {
        color: #343434;
        font-family: 'Conthrax', sans-serif;
        font-size: 40px;
    }
`

const TitleContainer = styled.div`
    width: 80%;
    gap: 15px;
    justify-content: center;
    margin-top: 30px;
    img {
        width: 200px;
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
  background-color: #343434;;
  color: white;
  &:hover {
    background-color: #021121;
  }
`;