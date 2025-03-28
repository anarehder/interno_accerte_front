import { useRef, useState } from 'react';
import { toPng } from "html-to-image";
import download from "downloadjs";
import styled from 'styled-components';
import backgroundSignature from "../assets/FUNDO_SIGNATURE.png"; 
import HeaderComponent from '../components/HeaderComponent';

function SignatureEmailFormPage() {
    const [form, setForm] = useState({
        nome: "",
        sobrenome: "",
        cargo: "",
        ddd: "",
        whatsapp: "",
        email: "",
    });
    const [errors, setErrors] = useState({});
    const [displayImage, setDisplayImage] = useState(false);
    const imageRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Máscara para o DDD (apenas números e máximo de 2 dígitos)
        if (name === "ddd") {
          const formattedDDD = value.replace(/\D/g, "").slice(0, 2);
          setForm((prev) => ({ ...prev, [name]: formattedDDD }));
          return;
        }

        // Máscara para o WhatsApp (apenas números e máximo de 9 dígitos)
        if (name === "whatsapp") {
            const formattedWhatsApp = value
                .replace(/\D/g, "") // Remove tudo que não for número
                .slice(0, 10) // Limita a 9 dígitos
                .replace(/(\d{5})(\d{0,4})/, "$1-$2"); // Aplica a máscara 99999-9999
            setForm((prev) => ({ ...prev, [name]: formattedWhatsApp }));
            return;
        }

        if (name === "email"){
            const formattedText = value.toLowerCase()
            setForm((prev) => ({ ...prev, [name]: formattedText }));
            return;
        }
    
        setForm((prev) => ({ ...prev, [name]: value }));
    };
    
    const validate = () => {
        let tempErrors = {};
    
        if (!form.nome.trim()) tempErrors.nome = "Nome é obrigatório";
        if (!form.sobrenome.trim()) tempErrors.sobrenome = "Sobrenome é obrigatório";
        if (!form.cargo.trim()) tempErrors.cargo = "Cargo é obrigatório";
        if (!form.ddd) tempErrors.ddd = "DDD é obrigatório";
        if (!form.whatsapp) tempErrors.whatsapp = "WhatsApp é obrigatório";
        if (!form.email.includes("@")) tempErrors.email = "E-mail inválido";
    
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
          alert("Assinatura gerada com sucesso! ✅");
          setDisplayImage(true);
          setErrors({});
        }
    };

    const handleClear = () => {
        setForm({
          nome: "",
          sobrenome: "",
          cargo: "",
          ddd: "",
          whatsapp: "",
          email: "",
        });
        setDisplayImage(false);
        setErrors({});
    };
    
    const handleDownload = () => {
        if (imageRef.current) {
            toPng(imageRef.current, { quality: 1 })
                .then((dataUrl) => {
                    download(dataUrl, `mail_signature_${form.nome}.png`, "image/png");
                })
                .catch((error) => {
                    console.error("Erro ao gerar a imagem:", error);
                });
        }
    };

    return (
        <PageContainer>
            <HeaderComponent pageTitle={"Assinatura de E-mail"} type={"page"} />
            <FormContainer>
                <h2>Preencha o Formulário</h2>
                <form onSubmit={handleSubmit}>
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
                    <div>
                        <label>Cargo:</label>
                        <Input type="text" name="cargo" value={form.cargo} onChange={handleChange} />
                        {errors.cargo && <ErrorMessage>{errors.cargo}</ErrorMessage>}
                    </div>
                    <div>
                        <label>E-mail:</label>
                        <Input type="email" name="email" value={form.email} onChange={handleChange} />
                        {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
                    </div>
                    <div>
                        <label>DDD:</label>
                        <Input type="text" name="ddd" value={form.ddd} onChange={handleChange} maxLength="2" />
                        {errors.ddd && <ErrorMessage>{errors.ddd}</ErrorMessage>}
                    </div>
                    <div>
                        <label>WhatsApp:</label>
                        <Input type="text" name="whatsapp" value={form.whatsapp} onChange={handleChange} maxLength="10" />
                        {errors.whatsapp && <ErrorMessage>{errors.whatsapp}</ErrorMessage>}
                    </div>
                    <Button type="submit">Enviar</Button>
                </form>
            </FormContainer>
            {displayImage &&
            <SignatureContainer>
                <div>
                        <Button type="button" color={"clear"} onClick={handleClear}>Limpar Formulário</Button>
                        <Button onClick={handleDownload}>
                            Baixar Assinatura
                        </Button>
                </div>
                <ImageContainer ref={imageRef}>
                    <Name>
                        <p>{form.nome} <strong>{form.sobrenome}</strong></p>
                    </Name>
                    <Position>
                        <p>  <strong>{form.cargo}</strong></p>
                    </Position>
                    <WhatsApp>
                        <strong>({form.ddd})</strong> {form.whatsapp}
                    </WhatsApp>
                    <Site>
                        www.accerte.com.br
                    </Site>
                    <Mail>
                        {form.email}
                    </Mail>
                    <Phone>
                        <strong>(62)</strong> 3945-9510
                    </Phone>
                </ImageContainer>
            </SignatureContainer>
            }
        </PageContainer>
    )
}

export default SignatureEmailFormPage;


const PageContainer = styled.div`
    width: 100%;
    height: 100%;
    min-height: 100vh;
    flex-direction: column;
    align-items: center;
    gap: 30px;
`

const FormContainer = styled.div`
    max-width: 80%;
    gap: 25px;
    flex-direction: column;
    padding: 20px;
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
            gap: 10px;
            justify-content: flex-start;
            align-items: center;
            label {
                width: 15%;
            }
        }
        button { 
            margin-top: 20px;
        }
    }
`;

const Input = styled.input`
  width: 60%;
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

const Button = styled.button`
    width: 25%;
    justify-content: center;
`;

const SignatureContainer = styled.div`
    flex-direction: column;
    align-items: center;
    gap: 20px;
    div:first-of-type{
        justify-content: center;
        gap: 50px;    
    }
    button{
        width: 15%;
        height: 40px;
        justify-content: center;
    }
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

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin: 0;
  width: 15%;
`;