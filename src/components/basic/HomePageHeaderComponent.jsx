import Header from "../../assets/header/header2.png";
import Alert from "../../assets/header/alert.png";
import { useAuth } from '../../contexts/AuthContext';
import { getToken } from '../../services/graph';
import { useEffect, useState } from 'react';
import { FiLogOut } from "react-icons/fi"; 
import { useMsal } from "@azure/msal-react";
import styled from 'styled-components';

function HomePageHeaderComponent() {
    const { user } = useAuth();
    const [imageUrl, setImageUrl] = useState(null);
    const [iniciais, setIniciais] = useState("");
    const { instance, accounts } = useMsal();
    
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
            postLogoutRedirectUri: "/",
            mainWindowRedirectUri: "/"
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
                        <img src={Alert} alt={'notificacao'} />
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
`

const HeaderContainer = styled.div`
    background-color: red;
    height: 200px;
    background: url(${Header}) no-repeat right center;
    background-size: cover;
    align-items: center;
    justify-content: space-between;
    background-color: #001143;
    padding: 0 5%;
    overflow: hidden;
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
    img { 
        height: 60px;
    }
    button{
        background-color: #001143;
    }
`
