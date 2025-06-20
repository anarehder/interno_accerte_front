import styled from 'styled-components';
import SobreNos1 from '../assets/SobreNos1.svg'
import SobreNos2 from '../assets/SobreNos2.svg'
import Valores from '../assets/Valores.png'
import HeaderNewComponent from '../components/basic/HeaderNewComponent';

function AboutUsPage() {

    return (
        <PageContainer>
            <HeaderNewComponent pageTitle={"Sobre nós"} />
            <ImageContainer src={SobreNos2} alt={"Sobre nós"} />
            <ImageContainer src={Valores} alt={"Valores"}/>
            <ImageContainer src={SobreNos1} alt={"Sobre nós"} />
        </PageContainer>
    )
}

export default AboutUsPage;

const PageContainer = styled.div`
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    color: #555;
    margin-bottom: 30px;
    background-color: #F0F5F9;
`

const ImageContainer = styled.img`
    width: 101%;
    display: block;
    margin: 0 auto;
    margin-top: 10px;
`