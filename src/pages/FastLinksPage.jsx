import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import HeaderComponent from "../components/HeaderComponent";
import AppleLogo from "../assets/logos-parceiros/apple_branco.png";
import AndroidLogo from "../assets/logos-parceiros/google_play.png";
import CajuLogo from "../assets/logos-parceiros/caju.png";  // Substitua pelos caminhos corretos
import OnflyLogo from "../assets/logos-parceiros/onfly.png";  // Substitua pelos caminhos corretos
import GymratsLogo from "../assets/logos-parceiros/gymrats.png"; 
import MarqpontoLogo from "../assets/logos-parceiros/marq.png"; 
import ClickSignLogo from "../assets/logos-parceiros/clicksign.png"; 
import WellhubLogo from "../assets/logos-parceiros/wellhub.png";

const FastLinksPage = () => {{
    const { dados } = useAuth();
    const [wallpaper, setWallpaper] = useState(false);
    const [documents, setDocuments] = useState(false);
    const imageMap = {
        Apple: AppleLogo,
        Android: AndroidLogo,
        Caju: CajuLogo,
        Onfly: OnflyLogo,
        Gympass: WellhubLogo,
        GymRats: GymratsLogo,
        MarqPonto: MarqpontoLogo,
        Clicksign: ClickSignLogo
        // Adicione outros rótulos e imagens conforme necessário
      };
      
    const fixedLinks = [
        {Caju: [
            {Apple: "https://apps.apple.com/br/app/caju-benef%C3%ADcios-por-inteiro/id1483671427" },
            {Android: "https://play.google.com/store/apps/details?id=com.caju.employeeApp&pcampaignid=web_share" }
        ]},
        {Gympass: [
            {Apple: "https://apps.apple.com/br/app/wellhub-gympass/id703761434" },
            {Android: "https://play.google.com/store/apps/details?id=com.gympass&hl=pt_BR" }
        ]},
        {MarqPonto: [
            {Apple: "https://apps.apple.com/br/app/marqponto/id1379890385" },
            {Android: "https://play.google.com/store/apps/details?id=br.com.marqponto" }
        ]},
        {Onfly: [
            {Apple: "https://apps.apple.com/br/app/onfly/id6443720203?l=en-GB" },
            {Android: "https://play.google.com/store/apps/details?id=com.onfly.app" }
        ]},
        {Clicksign: "https://app.clicksign.com/accounts/13505/tracking/notifications"},
        {GymRats: "https://share.gymrats.app/join?code=ITGCHBMV"},
    ];

    useEffect(() => {
        if (!dados) return;
        window.scrollTo(0, 0);
    }, [dados]);

    const renderLinks = (links, index) => {
        // Se for um array, mostra como dropdown
        if (Array.isArray(links)) {
            const options = links.map(linkObj => {
                const [label, url] = Object.entries(linkObj)[0];
                return { label, url };
            });

            return (
                <InfoButton key={links[index].url}>
                    <button>
                        {options.map((opt, i) => (
                            <a href={opt.url} target="_blank"> <img src={imageMap[opt.label]} alt={opt.label} /> </a>
                        ))}
                    </button>
                </InfoButton>
            );
        }
      
        // Caso seja link direto
        return (
          <InfoButton key={links}>
            <button onClick={() => window.open(links, "_blank")}>
              Acessar
            </button>
          </InfoButton>
        );
      };

    return (
        <Container>
            <HeaderComponent pageTitle={"Links Rápidos"} type={"page"} />
            {
                dados &&
                <>
                    <List>
                        <Card >
                            <Info>Fundos de Tela</Info>
                            <InfoButton>
                                <button onClick={() => setWallpaper(!wallpaper)}>
                                    {wallpaper ? "Ocultar" : "Exibir"}
                                </button>
                            </InfoButton>
                        </Card>
                        {wallpaper &&
                            <SmallList>
                                <PostsContainer>
                                    <div className="carousel" >
                                        {dados?.background?.map((p, index) => (
                                            <div className="card" key={index} >
                                                <a href={p.url} target="_blank">
                                                    <img src={p.url} alt={"Post do Linkedin"} />
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                    
                                </PostsContainer>
                                <p>clique para acessar a imagem</p>
                            </SmallList>
                        }
                        {fixedLinks.map((linkObj, ind) => (
                            <Card key={Object.keys(linkObj) || ind}>
                                <Info><img src={imageMap[Object.keys(linkObj)]} alt={Object.keys(linkObj)} /> </Info>
                                {Object.values(linkObj).map((links, index) => (
                                    <>
                                        {renderLinks(links, index)}
                                    </>
                                ))}
                            </Card>
                        ))}
                        <Card >
                            <Info>Documentos Padrão</Info>
                            <InfoButton>
                                <button onClick={() => setDocuments(!documents)}>
                                    {documents ? "Ocultar" : "Exibir"}
                                </button>
                            </InfoButton>
                        </Card>
                        {documents &&
                            <SmallList>
                                {dados?.docs?.map((file, index) => (
                                    <Card key={index}>
                                        <Info>{file.name.slice(0, -4)}</Info>
                                        <InfoButton><button><a href={file.url} target="_blank"> Acessar </a></button></InfoButton>
                                    </Card>
                                ))}
                            </SmallList>
                        }
                    </List>
                </>
            }
        </Container>
    );
};
}

export default FastLinksPage;
  

const Container = styled.div`
    flex-direction: column;
    border-radius: 8px;
    align-items: center;
    min-height: 110vh;
    color: gray;
    margin-bottom: 20px;
`;


const List = styled.div`
    display: flex;
    flex-direction: column;
    gap: 25px;
    margin: 30px 0 0 0;
    justify-content: center;
    align-items: center;
    width: 70%;
`;

const SmallList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: center;
    align-items: center;
    width: 95%;
    margin-bottom: 30px;
`;


const PostsContainer = styled.div`
    .carousel {
        display: flex;
        gap: 20px;
        overflow-x: auto; /* Ativa o scroll horizontal */
        overflow-y: hidden; /* Evita scroll vertical */
        height: 230px;
        padding-left: 10px;
        align-items: center;
    }
        /* Para navegadores baseados em WebKit (Chrome, Safari, Edge) */
    .carousel::-webkit-scrollbar {
        height: 6px; /* Altura da barra de rolagem */
    }

    .carousel::-webkit-scrollbar-track {
        background: transparent; /* Fundo da barra */
    }

    .carousel::-webkit-scrollbar-thumb {
        background: gray; /* Cor da barra de rolagem */
        border-radius: 10px; /* Bordas arredondadas */
    }

    .carousel::-webkit-scrollbar-thumb:hover {
        background: darkgray; /* Cor ao passar o mouse */
    }

  .card {
    flex: 0 0 260px;
    background: white;
    border-radius: 35px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease-in-out;
    width: 280px;
    margin: 5px 0;
    height: 160px;
    position: relative;
    display: inline-block;
    .card .link-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1; /* Garante que o link fique sobre a imagem */
        opacity: 0; /* Torna o link invisível */
        background-color: rgba(0, 0, 0, 0); /* Transparente, mas garante que o link será clicável */
    }

    &:hover {
      transform: scale(1.05);
      border-radius: 35px;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center; 
    }

    .content {
      padding: 10px;
      text-align: center;
      
      h3 {
        font-size: 18px;
        color: #222;
        margin-bottom: 10px;
      }

      p {
        font-size: 14px;
        color: #555;
      }
    }
`

const Card = styled.div`
    background: white;
    height: 60px;
    padding: 8px 25px;
    align-items: center;
    justify-content: space-around;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    gap: 10%;
    display: flex;
`;

const Info = styled.div`
    margin: 5px 0;
    display: flex;
    color: #555;
    text-align: left;
    font-size: 22px;
    gap: 20px;
    align-items: center;
    height: 30px;
    img {
        padding: 0;
        margin: 0;             // Espaçamento entre as imagens
        height: 40px;              // Mantém a proporção das imagens
        width: auto;
    }
`;

const InfoButton = styled.div`
    width: 220px;
    justify-content: center;
    font-size: 16px;
    align-items: center;
    gap: 10px;
    button { 
        width: 110px;
        height: 45px;
        font-size: 18px;
        align-items: center;
        border: 0.5px solid #E6E6E6 !important;
        justify-content: space-around;
    }
    img {
        padding: 0;
        margin: 0;             // Espaçamento entre as imagens
        height: 20px;              // Mantém a proporção das imagens
    }
`;
