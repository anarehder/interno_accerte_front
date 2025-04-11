import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import HeaderComponent from "../components/HeaderComponent";

const FastLinksPage = () => {{
    const { dados } = useAuth();
    const [wallpaper, setWallpaper] = useState(false);
    const [documents, setDocuments] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    // console.log(dados?.docs);
    return (
        <Container>
            <HeaderComponent pageTitle={"Links Rápidos"} type={"page"} />
            {
                dados &&
                <>
                    <List>
                        <Card >
                            <Info>Fundos de Tela</Info>
                            <Info>
                                <button onClick={() => setWallpaper(!wallpaper)}>
                                    {wallpaper ? "Ocultar" : "Exibir"}
                                </button>
                            </Info>
                        </Card>
                        {wallpaper &&
                            <SmallList>
                                {dados?.background?.map((file, index) => (
                                    <Card key={index}>
                                        <Info>{file.name.slice(0, -4)}</Info>
                                        <Info><button><a href={file.url} target="_blank"> Acessar </a></button></Info>
                                    </Card>
                                ))}
                            </SmallList>
                        }
                        <Card >
                            <Info>Documentos Padrão</Info>
                            <Info>
                                <button onClick={() => setDocuments(!documents)}>
                                    {documents ? "Ocultar" : "Exibir"}
                                </button>
                            </Info>
                        </Card>
                    
                    {documents &&
                        <SmallList>
                            {dados?.docs?.map((file, index) => (
                                <Card key={index}>
                                    <Info>{file.name.slice(0, -4)}</Info>
                                    <Info><button><a href={file.url} target="_blank"> Acessar </a></button></Info>
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
    color: black;
`;


const List = styled.div`
    display: flex;
    flex-direction: column;
    gap: 25px;
    margin: 30px 0 0 0;
    justify-content: center;
    align-items: center;
    width: 65%;
`;

const SmallList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: center;
    align-items: center;
    width: 75%;
    margin-bottom: 30px;
`;

const Card = styled.div`
    background: white;
    padding: 8px 25px;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    gap: 10%;
    flex-wrap: wrap;
    p:first-child {
        width: 70%;
    }
`;

const Info = styled.p`
    margin: 5px 0;
    color: #555;
    text-align: left;
    backgro
`;