import { useRef } from 'react';
import { toPng } from "html-to-image";
import download from "downloadjs";
import styled from 'styled-components';
import backgroundSignature from "../assets/FUNDO_SIGNATURE.png"; 
import HeaderComponent from '../components/HeaderComponent';
import { useAuth } from '../contexts/AuthContext';

function SignatureEmailPage() {
    const { user } = useAuth();
    const imageRef = useRef(null);
    
    const handleDownload = () => {
        if (imageRef.current) {
            toPng(imageRef.current, { quality: 1 })
                .then((dataUrl) => {
                    download(dataUrl, `assinatura_${user?.givenName}.png`, "image/png");
                })
                .catch((error) => {
                    console.error("Erro ao gerar a imagem:", error);
                });
        }
    };

    return (
        <PageContainer>
            <HeaderComponent pageTitle={"Assinatura de E-mail"} type={"page"} />
            <Button onClick={handleDownload}>
                Baixar Assinatura
            </Button>
            <ImageContainer ref={imageRef}>
                <Name>
                    <p>{user?.givenName} <strong>{user?.surname}</strong></p>
                </Name>
                <Position>
                    <p>  <strong>{user?.jobTitle}</strong></p>
                </Position>
                <WhatsApp>
                    <strong>{user?.mobilePhone.slice(0, 4)}</strong> {user?.mobilePhone.slice(4, 15)}
                </WhatsApp>
                <Site>
                    www.accerte.com.br
                </Site>
                <Mail>
                    {user?.mail}
                </Mail>
                <Phone>
                    <strong>(62)</strong> 3945-9510
                </Phone>
            </ImageContainer>
        </PageContainer>
    )
}

export default SignatureEmailPage;


const PageContainer = styled.div`
    width: 100%;
    height: 100%;
    min-height: 100vh;
    flex-direction: column;
    align-items: center;
    gap: 30px;
`

const Button = styled.button`
    width: 25%;
    justify-content: center;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 1414px;
  height: 433px;
  background-image: url(${backgroundSignature});
  background-size: cover;
  background-position: center;
  font-family: "Poppins", serif;
  font-weight: 500;
  font-style: normal;
`;

const Name = styled.div`
    position: absolute;
    color: white;
    top: 80px;
    left: 560px;
    width: 450px;
    justify-content: center;
    align-items: center;
    height: 60px;
    p{
        font-size: 30px;
    }
`

const Position = styled.div`
    position: absolute;
    color: white;
    top: 80px;
    left: 1020px;
    width: 390px;
    justify-content: center;
    align-items: center;
    height: 60px;
    p{
        font-size: 27px;
    }
`

const Mail = styled.div`
    position: absolute;
    color: #3976C2;
    top: 44%;
    left: 43%;
    font-size: 20px;
` 

const WhatsApp = styled.div`
    position: absolute;
    color: #3976C2;
    top: 54%;
    left: 43%;
    font-size: 19px;
    gap: 7px;
` 

const Site = styled.div`
    position: absolute;
    color: #3976C2;
    top: 64%;
    left: 43%;
    font-size: 20px;
` 

const Phone = styled.div`
    position: absolute;
    color: #3976C2;
    top: 73%;
    left: 43%;
    font-size: 19px;
    gap: 7px;
` 