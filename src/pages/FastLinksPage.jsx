import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import HeaderComponent from "../components/HeaderComponent";

const FastLinksPage = () => {{
    const { dados } = useAuth();
    const [wallpaper, setWallpaper] = useState(false);
    const [documents, setDocuments] = useState(false);
    const [selected, setSelected] = useState('');
    
    const fixedLinks = [
        {Caju: [
            {Apple: "https://apps.apple.com/br/app/caju-benef%C3%ADcios-por-inteiro/id1483671427" },
            {Android: "https://play.google.com/store/apps/details?id=com.caju.employeeApp&pcampaignid=web_share" }
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
      
          const handleSelect = (e) => {
            const url = e.target.value;
            if (url) {
              window.open(url, '_blank');
              setSelected(''); // <-- reseta o select para o placeholder
            }
          };

          return (
              <InfoButton key={links[index].url}>
                  <StyledSelect onChange={handleSelect} value={selected}>
                      <StyeldOption value="" >Acessar 🡫</StyeldOption>
                      {options.map((opt, i) => (
                          <StyeldOption key={opt.value || i} value={opt.url}>
                              {opt.label}
                          </StyeldOption>
                      ))}
                  </StyledSelect>
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
                                <Info>{Object.keys(linkObj)}</Info>
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
    gap: 20px;
`;

const InfoButton = styled.div`
    width: 250px;
    justify-content: center;
    font-size: 16px;
    align-items: center;
    gap: 10px;
    button, select { 
        width: 120px;
        font-size: 16px;
        justify-content: center;
        border: 0.5px solid #E6E6E6 !important;
    }
`;

const StyledSelect = styled.select`
    background-color: #007bff;
    color: white;
    border: 0.5px solid #E6E6E6;
    padding: 10px 15px;
    margin:0;
    border-radius: 16px;
    font-size: 14px;
    cursor: pointer;
    appearance: none;
    justify-content: space-between;
    align-items: center;
    transition: border-color 0.25s;
    text-align: center;
    font-weight: 400;
    &:hover {
        background-color: #0056b3;
        cursor: pointer;
        border: 0.5px solid #E6E6E6;
        
    }
    &:focus {
        outline: none;
        
    }
`;

const StyeldOption = styled.option`
    background-color: white;
    color: #555;
`
