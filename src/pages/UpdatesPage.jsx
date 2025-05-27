import styled from 'styled-components';
import HeaderComponent from '../components/HeaderComponent';
import Logo from '../assets/LOGO-PNG.png';
import { GiMegaphone } from "react-icons/gi";
import ReactPlayer from 'react-player';

function UpdatesPage() {
    const videos = [{"nome": "Programa Jeito Goiano (TV Goiânia) 25/05/2025", "video":"https://www.youtube-nocookie.com/embed/b6fB971Ii7A?start=1294"},{"nome":"Programa Panorama Goiás (PUC TV) 06/03/2025", "video": "https://www.youtube-nocookie.com/embed/HH8K0MYqZnU?si=7zvXk45DSzBmgD2U"},{"nome":"Programa Panorama Goiás (PUC TV) 20/03/2025", "video": "https://www.youtube-nocookie.com/embed/HsXLjxAG-ng?start=1223"}];
    
    const videosPapoReto = [{"nome":"Maio/25", "video": "https://www.youtube.com/watch?v=dd1bsHYYqjg"},{"nome":"Abril/25", "video": "https://youtu.be/hEtOEyRs6dg?si=6tyfq0pazh3zqySQ"},{'nome': "Março/25", "video":"https://www.youtube.com/watch?v=Er05a6jmn1w"},{"nome":"Fevereiro/25", "video": "https://www.youtube.com/watch?v=cr8sLxde1m8"},{"nome":"Fevereiro/25", "video": "https://youtu.be/9DgIMkcvW4A?si=W_FzYEG9VoGzXSJO"},{"nome":"Janeiro/25", "video": "https://www.youtube.com/watch?v=lg48Bi9DA54&ab_channel=TEDxTalks"}];


    return (
        <PageContainer>
            <HeaderComponent pageTitle={"Fique Por Dentro"} type={"page"} />
            <Title><GiMegaphone size={60} style={{ transform: 'rotate(-15deg)', position: 'relative', top: '-5' }} /> <img src={Logo} style={{ color: '#067DD1' }} /> na mídia </Title>
            <Videos>
                {videos.map((v, index) => (
                    <div>
                        <h3>{v.nome}</h3>
                        <ReactPlayer key={index}
                            url={v.video}
                            controls
                            width="500px"
                            height="300px"
                        />
                    </div>
                ))}
            </Videos>
            <Title><GiMegaphone size={60} style={{ transform: 'rotate(-15deg)', position: 'relative', top: '-5' }} /> <img src={Logo} style={{ color: '#067DD1' }} /> papo reto </Title>
            <Videos>
                {videosPapoReto.map((v, index) => (
                    <div>
                        <h3>{v.nome}</h3>
                        <ReactPlayer key={index}
                            url={v.video}
                            controls
                            width="500px"
                            height="300px"
                        />
                    </div>
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
    margin-bottom: 50px;
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
    justify-content: flex-start;
    display: flex;
    gap: 25px;
    overflow-x: auto; /* Ativa o scroll horizontal */
    overflow-y: hidden; /* Evita scroll vertical */
    height: 350px;
    align-items: center;
    div{
        flex-direction: column;
        align-items: center;
        color: #555;
        gap: 15px;
    }
`
