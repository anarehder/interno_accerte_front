import Header from "../../assets/header/header2.png";
import Alert from "../../assets/header/alert.png";
import { useAuth } from '../../contexts/AuthContext';
import { getToken } from '../../services/graph';
import { useEffect, useState } from 'react';
import { FiLogOut } from "react-icons/fi"; 
import { useMsal } from "@azure/msal-react";
import styled from 'styled-components';
import { FaRegBell } from "react-icons/fa";

function HomePageHeaderComponent({temNotificacao}) {
    const { user } = useAuth();
    const [imageUrl, setImageUrl] = useState(null);
    const [iniciais, setIniciais] = useState("");
    const [open, setOpen] = useState(false);
    const { instance, accounts } = useMsal();
    console.log(temNotificacao);
    function getIniciais(nome) {
        const palavras = nome.trim().split(/\s+/); // separa por espaços
        const iniciais = palavras.map(p => p[0].toUpperCase()).join(""); // pega todas as iniciais
        const resultado = iniciais[0] + iniciais[iniciais.length - 1]; // primeira + última
        return resultado;
    }

    useEffect(() => {
        async function fetchData() {
            if (!user) {
                await getData();
            }
            const response = await getToken(instance, accounts);
            const foto = await fetch("https://graph.microsoft.com/v1.0/me/photo/$value", {
                headers: {
                    Authorization: `Bearer ${response.accessToken}`,
                }
            });

            // 👇 Aqui você trata a imagem corretamente
            const blob = await foto.blob();

            // 👉 Cria uma URL temporária para exibir no navegador
            setImageUrl(URL.createObjectURL(blob));

            const letras = getIniciais(user.displayName); // "AR"
            setIniciais(letras);
        }

        fetchData();
    }, [user]);

     const handleLogout = () => {
        instance.logoutPopup({
            postLogoutRedirectUri: "/login",
            mainWindowRedirectUri: "/login"
        });
        sessionStorage.removeItem("posts");
        sessionStorage.removeItem("sharePoint");
        sessionStorage.removeItem("userMSAL");
    }
    
    return (
        <PageContainer>
            <HeaderContainer>
                <Block>
                    <Photo>
                        {imageUrl ? <img src={imageUrl} alt={"teste"} /> : <div>{iniciais}</div>}
                    </Photo>
                    <Texto>
                        {user ? <h1>Olá, <span> {user.givenName} </span><br /> <h2>Seja Bem-Vindo(a)!</h2></h1>
                            : <h1>Olá, <span> </span><br /> Seja Bem-Vindo(a)!</h1>}
                    </Texto>
                </Block>
                <Block>
                    <Mensagem>
                        <h1>Tecnologia que <span>conecta</span>, <br/> Soluções que <span>transformam</span></h1>
                    </Mensagem>
                </Block>
                <Block>
                    <Alerta>
                        <button onClick={handleLogout}> <FiLogOut size={20} /> </button>
                        {temNotificacao.length === 0 ?
                            <BellWrapper>
                                <img src={Alert} alt={'notificacao'} />
                            </BellWrapper> :
                            <BellWrapper onClick={() => setOpen(!open)}>
                                <img src={Alert} alt={'notificacao'} />
                                <RedDot />
                                {open && (
                                    <Dropdown>
                                        {temNotificacao.map((tip, index) => (
                                            <TipItem key={index}>
                                                <span>{tip.tipo}</span>
                                            </TipItem>
                                        ))}
                                    </Dropdown>
                                )} </BellWrapper>}
                        {/* {temNotificacao.length > 0 && } */}

                        {/* <BellWrapper >
                            <img src={Alert} alt={'notificacao'} onClick={() => setOpen(!open)}/>
                            {temNotificacao.length > 0 && <RedDot />}
                            {open && (
                                <Dropdown>
                                    {temNotificacao.map((tip, index) => (
                                        <TipItem key={index}>
                                            <span>{tip.tipo}</span>
                                        </TipItem>
                                    ))}
                                </Dropdown>
                            )}
                        </BellWrapper> */}
                    </Alerta>
                </Block>
            </HeaderContainer>
        </PageContainer>
    )
}

export default HomePageHeaderComponent;

const PageContainer = styled.div`
    width: 100%;
    position: relative;
    justify-content: center;
    z-index: 4;
    overflow-y: show;
`

const HeaderContainer = styled.div`
    height: 200px;
    background: url(${Header}) no-repeat right center;
    background-size: cover;
    align-items: center;
    justify-content: space-between;
    background-color: #001143;
    padding: 0 5%;
`
const Block = styled.div`
    width: 30%;
    justify-content: center;
    align-items: center;
    color: #00538A;
`

const Photo = styled.div`
    width: 140px;
    height: 140px;
    border-radius: 170px;
    border: 10px solid white;
    color: white;
    margin-right: 20px;
    div{
        font-size: 70px;
        line-height: 140px;
        justify-content: center;
    }
    img{
        width: 140px;
        height: 140px;
        border-radius: 170px;
    }
`

const Texto = styled.div`
    color: white;
    justify-content: center;
    h1{
        line-height: 45px;
    }  
    h2{
        line-height: 45px;
    }   
    span{
        color: #81cdff;    
    }
`

const Mensagem = styled.div`
    color: white;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 160px;
    font-weight: 400;
    border-left: 1px solid white;
    h1{
        line-height: 45px;
        font-size: 25px;
        font-weight: 300;
    }  
`

const Alerta = styled.div`
    width: 100%;
    height: 170px;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    z-index: 4;
    img { 
        height: 60px;
        width: 55px;
    }
    button{
        background-color: #001143;
    }
`

const BellWrapper = styled.div`
    width: 100%;
    position: relative;
    justify-content: flex-end;
`;

const RedDot = styled.div`
    position: absolute;
    top: -5px;
    right: -5px;
    width: 15px;
    height: 15px;
    background-color: red;
    border-radius: 50%;
    border: 2px solid white;
    z-index: 5;
`;

const Dropdown = styled.div`
    position: absolute;
    flex-direction: column;
    padding: 10px;
    top: 40px;
    right: 40px;
    justify-content: flex-start;
    background-color: #fff;
    width: 150px;
    max-height: 200px;
    overflow-y: auto;
    overflow-x: hidden;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
    z-index: 5;
`;

const TipItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #eee;
  width: 95%;

  &:last-child {
    border-bottom: none;
  }

  span {
    font-weight: 700;
    font-size: 16px;
    color: #021121;
    min-width: 95px;
  }

  p {
    margin: 4px 0 0;
    font-size: 15px;

  }
`;