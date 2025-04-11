import styled from 'styled-components';
import HeaderComponent from '../components/HeaderComponent';
import Logo from '../assets/LOGO-PNG.png';
import { GiMegaphone } from "react-icons/gi";
import ReactPlayer from 'react-player';

function UpdatesPage() {
    const videos = ["https://www.youtube-nocookie.com/embed/HH8K0MYqZnU?si=7zvXk45DSzBmgD2U", "https://www.youtube-nocookie.com/embed/HsXLjxAG-ng?start=1223"];
    const videosPapoReto = ["https://youtu.be/lg48Bi9DA54?si=EDnZU3lw7Y6nR3Ta", "https://youtu.be/hEtOEyRs6dg?si=6tyfq0pazh3zqySQ"];

    return (
        <PageContainer>
            <HeaderComponent pageTitle={"Fique Por Dentro"} type={"page"} />
            <Title><GiMegaphone size={60} style={{ transform: 'rotate(-15deg)', position: 'relative', top: '-5' }} /> <img src={Logo} style={{ color: '#067DD1' }} /> na mídia </Title>
            <Videos>
                {videos.map((v, index) => (
                    <ReactPlayer key={index}
                        url={v}
                        controls
                        width="500px"
                        height="300px"
                    />
                ))}
            </Videos>
            <Title><GiMegaphone size={60} style={{ transform: 'rotate(-15deg)', position: 'relative', top: '-5' }} /> <img src={Logo} style={{ color: '#067DD1' }} /> papo reto </Title>
            <Videos>
                {videosPapoReto.map((v, index) => (
                    <ReactPlayer key={index}
                        url={v}
                        controls
                        width="500px"
                        height="300px"
                    />
                ))}
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
    font-size: 25px;
    font-weight: 500;
    margin-top: 25px;
    gap: 5px;
    img{
        margin-left: 20px;
        height: 49px;
    }
`

const Videos = styled.div`
    width: 80%;
    justify-content: space-around;
`
