import { useRef } from 'react';
import { toPng } from "html-to-image";
import download from "downloadjs";
import styled from 'styled-components';
import backgroundSignature from "/home/accerte/interno_accerte_front/src/assets/FUNDO_SIGNATURE.png"; 

function SignatureEmailPage() {

    const imageRef = useRef(null);

    const handleDownload = () => {
        if (imageRef.current) {
            toPng(imageRef.current, { quality: 1 })
                .then((dataUrl) => {
                    download(dataUrl, "mail_signature.png", "image/png");
                })
                .catch((error) => {
                    console.error("Erro ao gerar a imagem:", error);
                });
        }
    };

    return (
        <PageContainer>
            <div>
                <DownloadButton onClick={handleDownload}>
                    Baixar como PNG
                </DownloadButton>
            </div>
            <ImageContainer ref={imageRef}>
                <Name>
                    <p>Matheus <strong>Vilarino</strong></p>
                </Name>
                <Position>
                    <p>  <strong>Analista de Licitação</strong></p>
                </Position>
                <WhatsApp>
                    <strong>(62)</strong> 99222-9999
                </WhatsApp>
                <Site>
                    www.accerte.com.br
                </Site>
                <Mail>
                    colaborador@accerte.com.br
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
    height: 100vh;
    flex-direction: column;
`

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
        font-size: 33px;
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

const DownloadButton = styled.button`
  padding: 10px 20px;
  background-color: #005CBC;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;