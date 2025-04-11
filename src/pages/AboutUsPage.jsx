import styled from 'styled-components';
import HeaderComponent from '../components/HeaderComponent';
import SobreNos1 from '../assets/SobreNos1.svg'
import SobreNos2 from '../assets/SobreNos2.svg'
import Valores from '../assets/Valores.png'

function AboutUsPage() {

    return (
        <PageContainer>
            <HeaderComponent pageTitle={"Sobre nós"} />
            <img src={SobreNos2} alt={"Sobre nós"} />
            <img src={Valores} alt={"Valores"}/>
            
            <img src={SobreNos1} alt={"Sobre nós"} />
        </PageContainer>
    )
}

export default AboutUsPage;

const PageContainer = styled.div`
    width: 100%;
    height: 100%;
    min-height: 100vh;
    flex-direction: column;
    align-items: center;
    // img:first-of-type {
    //     margin: 15px;
    //     width: 90%;
    // }
    img{
        width: 101%;
        display: block;
        margin: 0 auto;
    }
`