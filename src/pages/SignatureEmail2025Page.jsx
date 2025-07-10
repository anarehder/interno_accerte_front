import { useRef, useState } from 'react';
import { toPng } from "html-to-image";
import download from "downloadjs";
import styled from 'styled-components';
import backgroundSignature from "../assets/ASSINATURA-2025.png";
import HeaderNewComponent from '../components/basic/HeaderNewComponent';
import { useAuth } from '../contexts/AuthContext';
import { ImWhatsapp } from "react-icons/im";
import { TfiEmail } from "react-icons/tfi";

function SignatureEmail2025Page() {
    const { user } = useAuth();
    const imageRef = useRef(null);
    const [errors, setErrors] = useState({});
    const [displayImage, setDisplayImage] = useState(false);
    const [form, setForm] = useState({
        nome: "",
        sobrenome: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleDownload = () => {
        // alert("Ao configurar sua assinatura no outlook, lembre-se de ajustar o tamanho da imagem. Basta clicar com o botão direito em cima da imagem e selecionar tamanho e depois a opção melhor ajuste.");
        if (imageRef.current) {
            toPng(imageRef.current, { quality: 1 })
                .then((dataUrl) => {
                    download(dataUrl, `assinatura_${form?.nome}.png`, "image/png");
                })
                .catch((error) => {
                    console.error("Erro ao gerar a imagem:", error);
                });
        }
    };

    return (
        <PageContainer>
            <HeaderNewComponent pageTitle={"Assinatura de E-mail"}/>
            <FormContainer>
                <h2>Nome de exibição da Assinatura</h2>
                <form>
                    <div>
                        <label>Nome:</label>
                        <Input type="text" name="nome" value={form.nome} onChange={handleChange} />
                        {errors.nome && <ErrorMessage>{errors.nome}</ErrorMessage>}
                    </div>
                    <div>
                        <label>Sobrenome:</label>
                        <Input type="text" name="sobrenome" value={form.sobrenome} onChange={handleChange} />
                        {errors.sobrenome && <ErrorMessage>{errors.sobrenome}</ErrorMessage>}
                    </div>
                </form>
            </FormContainer>
            <Button onClick={handleDownload}>
                Baixar Assinatura
            </Button>
            <ImageContainer ref={imageRef}>
                <FullName>
                    <Name>{form?.nome} </Name> <Surname>{form?.sobrenome}</Surname>
                </FullName>
                <Position>
                    <p>{user?.jobTitle}</p>
                    {/* <p>Diretor de Comunicação, Marketing e Canais</p> */}
                </Position>
                <WhatsApp>   
                    <ImWhatsapp size={24}/> <strong>{user?.mobilePhone.slice(0, 4)}</strong> {user?.mobilePhone.slice(4, 15)}
                </WhatsApp>
                <Mail>
                    <TfiEmail size={24}/>{user?.mail}
                </Mail>
            </ImageContainer>
        </PageContainer>
    )
}

export default SignatureEmail2025Page;


const PageContainer = styled.div`
    width: 100%;
    height: 100%;
    min-height: 100vh;
    flex-direction: column;
    align-items: center;
    gap: 45px;
`

const FormContainer = styled.div`
    max-width: 65%;
    gap: 25px;
    flex-direction: column;
    padding: 20px;
    color: #555;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
    h2{
        width: 100%;
    }
    form{
        justify-content: space-around;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;

        div {
            width: 45%;
            gap: 15px;
            justify-content: flex-start;
            align-items: center;
            label {
                // width: 20%;
            }
        }
        button { 
            margin-top: 20px;
        }
    }
`;

const Input = styled.input`
  width: 70%;
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

const Button = styled.button`
    width: 300px;
    justify-content: center;
    background: linear-gradient(to right,#205fdd, #001143);
    margin-bottom: 25px;
`;

const ImageContainer = styled.div`
    position: relative;
    flex-direction: column;
    width: 1200px;
    height: 250px;
    // border: 5px solid red;
    background-color: white;
    background-image: url(${backgroundSignature});
    background-position: left;
    background-repeat: no-repeat;
    justify-content: right;
    font-family: "Poppins", serif;
    border-top-left-radius: 35px;
    border-bottom-left-radius: 35px;
`;

const FullName = styled.div`
    font-family: "Poppins", serif;
    width: auto;
    max-width: 550px;
    min-width: 200px;
    height: 60px;
    position: absolute;
    background: linear-gradient(to right, #0169EC,#002367);
    color: white;
    border-top-left-radius: 15px;
    border-bottom-left-radius: 15px;
    top: 20px;
    right: 0;
    padding: 0 30px 0 40px;
    justify-content: left;
    align-items: center;
    gap: 12px;    
    box-shadow: 2px 4px 12px rgba(0, 0, 0, 0.6);
`

const Name = styled.div`
    font-size: 32px;
    line-height: 30px;
    font-weight: 400;
    width: auto;
`

const Surname = styled.div`
    font-size: 32px;
    line-height: 30px;
    font-weight: 600;
    width: auto;
`

const Position = styled.div`
    position: absolute;
    color: #002367;
    top: 80px;
    right: 0;
    justify-content: right;
    align-items: center;
    text-align: right;
    height: 60px;
    width: 550px;
    padding: 0 30px;
    p{
        font-size: 25px;
    }
`

const Mail = styled.div`
    position: absolute;
    color: #002367;
    top: 210px;
    right: 0;
    font-size: 23px;
    gap: 7px;
    width: auto;
    padding: 0 30px;
    align-items: center;
` 

const WhatsApp = styled.div`
    position: absolute;
    color: #002367;
    top: 170px;
    right: 0;
    font-size: 23px;
    align-items: center;
    gap: 7px;
    width: auto;
    padding: 0 30px;
` 
