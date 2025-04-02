import { Link } from 'react-router-dom';
import BannerTopo from "../assets/Banner-GenteGestao-2.png"
import styled from 'styled-components';

function HeaderGGComponent({pageTitle}) {
    
    return (
        <PageContainer>
            <Link to="/homepage">
                <ReturnButton> Voltar </ReturnButton>
            </Link>
            <HeaderContainer>
                <div>
                    <h1>{pageTitle}</h1>
                </div>
            </HeaderContainer>
        </PageContainer>
    )
}

export default HeaderGGComponent;

const PageContainer = styled.div`
    width: 100%;
    position: relative;
    justify-content: center;
`

const HeaderContainer = styled.div`
    background-color: #434343;
    height: 200px;
    background: url(${BannerTopo}) no-repeat right center;
    background-size: contain;
    color: #ED1F4C;
    overflow: hidden;
    div{
        width: 40%;
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
    background-color: white;
    border: 1px solid #ED1F4C;
    color: #ED1F4C;
    &:hover {
        background-color: #ED1F4C;
        color:white;
    }
`;
