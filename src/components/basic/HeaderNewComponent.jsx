import { Link } from 'react-router-dom';
import Header from "../../assets/header/accerte-background.png";
import Logo from "../../assets/header/logo-accerte.png";
import styled from 'styled-components';

function HeaderNewComponent({pageTitle, subtitle}) {
    
    return (
        <PageContainer>
            <Link to="/">
                <ReturnButton> voltar </ReturnButton>
            </Link>
            <HeaderContainer>
                <ImageContainer>
                    {/* <h1>accerte</h1> */}
                    <img src={Logo} alt={"gente e gestao"} />
                </ImageContainer>
                <Title>
                    <h1>{pageTitle}</h1><h2>{subtitle && subtitle}</h2>
                </Title>
            </HeaderContainer>
        </PageContainer>
    )
}

export default HeaderNewComponent;

const PageContainer = styled.div`
    width: 100%;
    position: relative;
    justify-content: center;
    box-shadow: 4px 4px 8px 4px rgba(0, 0, 0, 0.4);
    gap: 1px;
`

const HeaderContainer = styled.div`
    background-color: white;
    height: 160px;
    color: #001143;
    overflow: hidden;
`

const ImageContainer = styled.div`
    width: 550px;
    justify-content: center;
    align-items: center;
    img{
        height: 60px;
    } 
    h1{
        font-weight: bold;
        color: #001143;
        font-family: "Conthrax";
        font-size: 36px;
    }
`

const Title = styled.div`
    background: url(${Header}) no-repeat center;
    background-size: 120%;
    border-bottom-left-radius: 20px;
    border-top-left-radius: 20px;
    box-shadow: 12px -21px 3px 5px rgba(0, 0, 0, 0.2);
    justify-content: flex-start;
    align-items: center;
    h1 {
        color: white;
        text-align: left;
        text-indent: 35px;
        line-height: 50px;
        font-size: 36px;
    }
    h2{
        color: white;
        font-weight: 400;
        line-height: 50px;
        font-size: 36px;
    }
`

const ReturnButton = styled.button`
    top: 10%;
    left: 1%;
    position: absolute;
    font-size: 16px;
    justify-content: center;
    border: none;
    border-radius: 5px;
    padding: 10px;
    cursor: pointer;
    background-color: white;
    border: 1px solid #001143;
    color: #001143;
    &:hover {
        background-color: #001143;
        color:white;
    }
`;
