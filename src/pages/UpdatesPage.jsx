import styled from 'styled-components';
import HeaderComponent from '../components/HeaderComponent';
import Logo from '../assets/LOGO-SVG.svg';
import { GiMegaphone } from "react-icons/gi";

function UpdatesPage() {
    const videos = ["https://www.youtube-nocookie.com/embed/HH8K0MYqZnU?si=7zvXk45DSzBmgD2U", "https://www.youtube-nocookie.com/embed/HsXLjxAG-ng?start=1223"];

    return (
        <PageContainer>
            <HeaderComponent pageTitle={"Fique Por Dentro"} type={"page"} />
            <Title><GiMegaphone size={60} style={{ transform: 'rotate(-15deg)', position: 'relative', top: '-5' }} /> <img src={Logo} style={{ color: '#067DD1' }} /> na mídia </Title>
            <Videos>
                {videos.map((v, index) => (
                    <iframe key={index}
                        width="500"
                        height="300"
                        src={v}
                        title="YouTube video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
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
