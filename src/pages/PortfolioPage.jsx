import styled from 'styled-components';
import HeaderNewComponent from '../components/basic/HeaderNewComponent';
import CapaPortfolio from '../assets/CAPA PORTFOLIO.png';
function PortfolioPage() {

    return (
        <PageContainer>
            <HeaderNewComponent pageTitle={"Portfólio"} />
            <a href={'https://accerte.sharepoint.com/sites/AccerteTecnologiadaInformaoLtda/Documentos%20Compartilhados/Extras/PORTFOLIO/PORTFOLIO%20ATUAL.pdf'} target="_blank">
            <ImageContainer src={CapaPortfolio} alt={"Portfolio"}/>
            </a>
        </PageContainer>
    )
}

export default PortfolioPage;

const PageContainer = styled.div`
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    color: #555;
    margin-bottom: 30px;
    background-color: #F0F5F9;
`

const ImageContainer = styled.img`
    width: 60%;
    display: block;
    margin: 0 auto;
    margin-top: 10px;
`