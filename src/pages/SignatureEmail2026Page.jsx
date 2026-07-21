import { useRef, useState } from 'react';
import download from "downloadjs";
import styled from 'styled-components';
import backgroundSignature from "../assets/ASSINATURA-2025.png";
import HeaderNewComponent from '../components/basic/HeaderNewComponent';
import { useAuth } from '../contexts/AuthContext';
import { ImWhatsapp } from "react-icons/im";
import { TfiEmail } from "react-icons/tfi";

function SignatureEmail2026Page() {
    const { user } = useAuth();
    const imageRef = useRef(null);
    const [errors, setErrors] = useState({});
    const [displayImage, setDisplayImage] = useState(false);
    const [version, setVersion] = useState("accerte");
    const [form, setForm] = useState({
        nome: "",
        sobrenome: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const inlineComputedStyles = (source, target) => {
        const computed = window.getComputedStyle(source);
        let styleStr = "";
        for (let i = 0; i < computed.length; i++) {
            const prop = computed[i];
            styleStr += `${prop}:${computed.getPropertyValue(prop)};`;
        }
        target.style.cssText = styleStr;

        const sourceChildren = source.children;
        const targetChildren = target.children;
        for (let i = 0; i < sourceChildren.length; i++) {
            inlineComputedStyles(sourceChildren[i], targetChildren[i]);
        }
    };

    const handleDownload = () => {
        if (imageRef.current) {
            const clone = imageRef.current.cloneNode(true);
            inlineComputedStyles(imageRef.current, clone);
            const { width, height } = imageRef.current.getBoundingClientRect();
            const htmlContent = `<!DOCTYPE html>
                <html>
                <head>
                <meta charset="UTF-8">
                <style>html,body{margin:0;padding:0;width:${width}px;height:${height}px;}</style>
                </head>
                <body>
                ${clone.outerHTML}
                </body>
                </html>`;
            download(htmlContent, `assinatura_${form?.nome}.html`, "text/html");
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
            <SignatureRow>
                <ButtonsColumn>
                    <Button
                        type="button"
                        $active={version === "accerte"}
                        onClick={() => setVersion("accerte")}
                    >
                        Assinatura Accerte
                    </Button>
                    <Button
                        $active={version === "grupo"}
                        onClick={() => setVersion("grupo")}
                    >
                        Assinatura Grupo Accerte
                    </Button>
                    <br/>
                    <Button onClick={handleDownload} $active={true}>
                        Baixar Assinatura
                    </Button>
                </ButtonsColumn>
                <ImageContainer ref={imageRef} $color={version === "accerte" ? "#0169EC" : "#D0021B"}>
                    <>
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
                    </>
                </ImageContainer>
            </SignatureRow>
        </PageContainer>
    )
}

export default SignatureEmail2026Page;


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
    margin-bottom: 20px;
    background: ${({ $active }) => $active
        ? "linear-gradient(to right,#205fdd, #001143)"
        : "#899be8"};
    opacity: ${({ $active }) => ($active ? 1 : 0.85)};
`;

const SignatureRow = styled.div`
    display: flex;
    width: 1000px;
    align-items: center;
    justify-content: space-between;
    margin: 40px;
    
`;

const ButtonsColumn = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 20px;
    width: 300px;

    button {
        margin-bottom: 0;
    }
`;

const ImageContainer = styled.div`
    background-color: ${({ $color }) => $color};
    position: relative;
    flex-direction: column;
    width: 600px;
    height: 220px;
    justify-content: right;
    font-family: "Sora", serif;
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
    padding: 0 20px 0 30px;
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
    width: 600px;
    padding: 0 20px;
    p{
        font-size: 24px;
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
    padding: 0 20px;
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
    padding: 0 20px;
` 
