import { Link } from 'react-router-dom';
import BannerTopo from "../assets/INTRANET_BANNER.png"
import styled from 'styled-components';

function HeaderComponent({pageTitle, type}) {
    
    return (
        <PageContainer>
            {type !== "homepage" &&
                <Link to="/homepage">
                    <ReturnButton> Voltar </ReturnButton>
                </Link>
            }
            <HeaderContainer>
                <div>
                    {type === "homepage" ? 
                    <h1>Olá, <span> {pageTitle} </span><br /> Seja Bem-Vindo(a)!</h1> :
                    <h1>{pageTitle}</h1>
                    }
                </div>
            </HeaderContainer>
        </PageContainer>
    )
}

export default HeaderComponent;

const PageContainer = styled.div`
    width: 100%;
    position: relative;
    justify-content: center;
`

const HeaderContainer = styled.div`
    background-color: #434343;
    height: 200px;
    background: url(${BannerTopo}) no-repeat right center;
    background-size: cover;
    color: #067DD1;
    overflow: hidden;
    div{
        width: 45%;
        background-color: white;
        border-bottom-right-radius: 80px;
        box-shadow: 12px -21px 3px 5px rgba(0, 0, 0, 0.2);
        justify-content: center;
        align-items: center;
        h1 {
            text-align: left;
            line-height: 50px;
            font-size: 36px;
        }
    }
`

const ReturnButton = styled.button`
    top: 10%;
    left: 2%;
    position: absolute;
    font-size: 16px;
    justify-content: center;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: #007bff;
    color: white;
    &:hover {
        background-color: #0056b3;
    }
`;
