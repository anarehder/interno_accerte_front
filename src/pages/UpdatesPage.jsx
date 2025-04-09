import styled from 'styled-components';
import HeaderComponent from '../components/HeaderComponent';
import Logo from '../assets/LOGO-SVG.svg';
import { GiMegaphone } from "react-icons/gi";

function UpdatesPage() {
    return (
        <PageContainer>
            <HeaderComponent pageTitle={"Fique Por Dentro"} type={"page"}/>
            <Title><GiMegaphone size={60} style={{ transform: 'rotate(-15deg)' }}/> <img src={Logo} style={{ color: '#067DD1' }}/> na mídia </Title>
            <Videos>
                <iframe
                    width="500"
                    height="300"
                    src="https://www.youtube.com/embed/HH8K0MYqZnU?si=7zvXk45DSzBmgD2U"
                    title="YouTube video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
                <iframe
                    width="500"
                    height="300"
                    src="https://www.youtube.com/embed/HsXLjxAG-ng?autoplay=1&start=1223"
                    title="YouTube video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </Videos>
            
        </PageContainer>
    )
}

export default UpdatesPage;

const PageContainer = styled.div`
    width: 100%;
    height: 100%;
    min-height: 100vh;
    flex-direction: column;
    align-items: center;
    gap: 20px;
`

const Title = styled.div`
    display: flex;
    color:#1064AB;
    height:60px;
    align-items: center;
    justify-content: center;
    // background-color: red;
    font-size: 25px;
    font-weight: 500;
    gap: 5px;
    img{
        margin-left: 20px;
        height: 50px;
    }
`

const Videos = styled.div`
    width: 80%;
    justify-content: space-around;
`
