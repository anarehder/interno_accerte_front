// import IPOG1 from "../assets/IPOG/IPOG1.png";
import Ipog1 from '../assets/IPOG/IPOG1.png';
import Ipog2 from '../assets/IPOG/IPOG2.png';
import Ipog3 from '../assets/IPOG/IPOG3.png';
import Ipog4 from '../assets/IPOG/IPOG4.png';
import Ipog5 from '../assets/IPOG/IPOG5.png';
import Ipog6 from '../assets/IPOG/IPOG6.png';
import Ipog7 from '../assets/IPOG/IPOG7.jpg';
import Ipog8 from '../assets/IPOG/IPOG8.png';
import styled from 'styled-components';

function ParceriaEducacionalComponent() {
    
    return (
        <PageContainer>
            <ThreeDiv>
                <img src={Ipog1} alt={'ipog'} />
                <img src={Ipog4} alt={'ipog'} />
                <img src={Ipog2} alt={'ipog'} />
            </ThreeDiv>
            <ThreeDiv>
                <img src={Ipog5} alt={'ipog'} />
                <img src={Ipog7} alt={'ipog'} />
                <img src={Ipog3} alt={'ipog'} />
            </ThreeDiv>
            <DividedDiv>
                <img src={Ipog8} alt={'ipog'} />
                <img src={Ipog6} alt={'ipog'} />        
            </DividedDiv>
        </PageContainer>
    )
}

export default ParceriaEducacionalComponent;

const PageContainer = styled.div`
    width: 100%;
    position: relative;
    justify-content: center; 
    flex-direction: column;
`
const ThreeDiv = styled.div`
    margin-bottom: 10px;
    flex-wrap: wrap;
    justify-content: space-between;
    img {
        width: 33%;
    }   
`

const DividedDiv = styled.div`
    margin-bottom: 10px;
    height: auto;
    flex-wrap: wrap;
    justify-content: space-between;
    img {
        width: 47%;
    }   
`