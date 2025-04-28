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
        {Clicksign: "https://app.clicksign.com/accounts/13505/tracking/notifications"},
        {MarqPonto: [
            {Apple: "https://apps.apple.com/br/app/marqponto/id1379890385" },
            {Android: "https://play.google.com/store/apps/details?id=br.com.marqponto" }
        ]},
        {GymRats: "https://share.gymrats.app/join?code=ITGCHBMV"},
        {Onfly: [
            {Apple: "https://apps.apple.com/br/app/onfly/id6443720203?l=en-GB" },
            {Android: "https://play.google.com/store/apps/details?id=com.onfly.app" }
        ]},
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
                            <Info>Fundos de Tela</Info>
                            <InfoButton>
                                <button onClick={() => setWallpaper(!wallpaper)}>
                                    {wallpaper ? "Ocultar" : "Exibir"}
                                </button>
                            </InfoButton>
                        </Card>
                        {wallpaper &&
                            <SmallList>
                                {dados?.background?.map((file, index) => (
                                    <Card key={index}>
                                        <Info>{file.name.slice(0, -4)}</Info>
                                        <InfoButton><button><a href={file.url} target="_blank"> Acessar </a></button></InfoButton>
                                    </Card>
                                ))}
                            </SmallList>
                        }

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
    width: 60%;
`;

const SmallList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: center;
    align-items: center;
    width: 90%;
    margin-bottom: 30px;
`;

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
