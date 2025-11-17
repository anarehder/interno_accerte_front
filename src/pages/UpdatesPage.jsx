import styled from 'styled-components';
import ReactPlayer from 'react-player';
import { GiConversation } from "react-icons/gi";
import { PiMonitorPlayBold } from "react-icons/pi";
import { BsWebcam } from "react-icons/bs";
import { LuFileVideo2 } from "react-icons/lu";


import HeaderNewComponent from '../components/basic/HeaderNewComponent';

function UpdatesPage() {

    const webinars = [{"nome": "Eficiência Corporativa através da Gestão e Governança de Dados - 24/09/2025", "video":"https://www.youtube.com/watch?v=1HGU5Vjdxig"},{"nome": "SOC | Security Operation Center - Dos primeiros passos à segurança corporativa - 27/08/2025", "video":"https://www.youtube.com/watch?v=tAZbZuwbrlw"},{"nome": "Como Implementar Agentes de IA Generativa com Governança Empresarial - 30/07/2025", "video":"https://www.youtube.com/watch?v=JS5Jos2Ldis"}];

    const videos = [{"nome": "Tá na Hora da Berlinda (Berlinda News) 10/07/2025", "video":"https://www.youtube-nocookie.com/embed/06Coj1NXwt4?start=1920"},{"nome": "Programa Conta Pra Mim (Goiás é Mais TV) 02/07/2025", "video":"https://www.youtube-nocookie.com/embed/bN57ETLsl6c"},{"nome": "Programa Jeito Goiano (TV Goiânia) 08/06/2025", "video":"https://www.youtube-nocookie.com/embed/L1syK-T9RW4"},{"nome": "Programa Jeito Goiano (TV Goiânia) 25/05/2025", "video":"https://www.youtube-nocookie.com/embed/b6fB971Ii7A?start=1294"},{"nome":"Programa Panorama Goiás (PUC TV) 06/03/2025", "video": "https://www.youtube-nocookie.com/embed/HH8K0MYqZnU?si=7zvXk45DSzBmgD2U"},{"nome":"Programa Panorama Goiás (PUC TV) 20/03/2025", "video": "https://www.youtube-nocookie.com/embed/HsXLjxAG-ng?start=1223"}];
    
    const videosPapoReto = [{"nome": "Novembro/25", "video": "https://www.youtube.com/watch?v=xXH44I-31mA"},{"nome": "Outubro/25", "video": "https://www.youtube.com/watch?v=QwsJ4TZs1wI"},{"nome": "Setembro/25", "video": "https://www.youtube.com/watch?v=3faRtQcD2Qo"}, {"nome":"Agosto/25", "video": "https://youtu.be/EPqHYWVNz2U"},{"nome":"Julho/25", "video": "https://youtu.be/Wg0sSPaqwLc?si=bSAzXNc0UiDDwgQJ"},{"nome":"Junho/25", "video": "https://www.youtube.com/watch?v=TkhezPcYdDI"},{"nome":"Maio/25", "video": "https://www.youtube.com/watch?v=dd1bsHYYqjg"},{"nome":"Abril/25", "video": "https://youtu.be/hEtOEyRs6dg?si=6tyfq0pazh3zqySQ"},{'nome': "Março/25", "video":"https://www.youtube.com/watch?v=Er05a6jmn1w"},{"nome":"Fevereiro/25", "video": "https://www.youtube.com/watch?v=cr8sLxde1m8"},{"nome":"Fevereiro/25", "video": "https://youtu.be/9DgIMkcvW4A?si=W_FzYEG9VoGzXSJO"},{"nome":"Janeiro/25", "video": "https://www.youtube.com/watch?v=lg48Bi9DA54&ab_channel=TEDxTalks"}];


    return (
        <PageContainer>
            <HeaderNewComponent pageTitle={"Fique Por Dentro"}/>
            <Title><LuFileVideo2 size={40}/>  nossos webinars </Title>
            <Videos>
                {webinars.map((v) => (
                    <div key={v.video}>
                        <h3>{v.nome}</h3>
                        <ReactPlayer 
                            url={v.video}
                            controls
                            width="500px"
                            height="300px"
                        />
                    </div>
                ))}
            </Videos>
            <Title><PiMonitorPlayBold size={40}/>  na mídia </Title>
            <Videos>
                {videos.map((v) => (
                    <div key={v.video}>
                        <h3>{v.nome}</h3>
                        <ReactPlayer 
                            url={v.video}
                            controls
                            width="500px"
                            height="300px"
                        />
                    </div>
                ))}
            </Videos>
            <Title><GiConversation size={40} /> papo reto </Title>
            <Videos>
                {videosPapoReto.map((v) => (
                    <div key={v.video}>
                        <h3>{v.nome}</h3>
                        <ReactPlayer 
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
    color: #082764;
`

const Title = styled.div`
    display: flex;
    color: #082764;
    height: 60px;
    align-items: center;
    justify-content: center;
    font-size: 25px;
    font-weight: 500;
    margin-top: 25px;
    gap: 15px;
    img{
        margin-left: 20px;
        height: 49px;
    }
`

const Videos = styled.div`
    width: 85%;
    padding: 0 20px;
    justify-content: flex-start;
    display: flex;
    gap: 25px;
    border-radius: 10px;
    overflow-x: auto; /* Ativa o scroll horizontal */
    overflow-y: hidden; /* Evita scroll vertical */
    height: 380px;
    align-items: center;
    box-shadow: 2px 2px 3px 2px rgba(0, 0, 0, 0.3);
    div{
        flex-direction: column;
        align-items: center;
        color: #555;
        border-radius: 8px;
        gap: 15px;
        h3{
            font-size: 17px;
            line-height: 22px;
        }
    }
    &::-webkit-scrollbar {
    height: 6px; /* Altura da barra horizontal */
    }
    &::-webkit-scrollbar-thumb {
        background: #082764; /* Cor da barra de rolagem */
        border-radius: 10px; /* Bordas arredondadas */
    }
`
