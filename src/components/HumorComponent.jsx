import { useState } from 'react';
import styled from "styled-components";
import { useAuth } from '../contexts/AuthContext';
import { LuMessageCircleMore } from "react-icons/lu";

import Humor1 from '../assets/humor/1.png'
import Humor2 from '../assets/humor/2.png'
import Humor3 from '../assets/humor/3.png'
import Humor4 from '../assets/humor/4.png'
import Humor5 from '../assets/humor/5.png'

function HumorComponent() {
    const { user } = useAuth();
    const [humor, setHumor] = useState("");
    const [mensagem, setMensagem] = useState('');
    
    console.log(humor);

    const handleEnviar = async () => {
        alert(`humor selecionado! ${humor}`);
        const body = {email: user.mail, humor, mensagem};
        // const novoNome = `${area} (${user.displayName}) - ${arquivo.name}`;
        // const local = 'BANCO DE TALENTOS';
        // const novoArquivo = new File([arquivo], novoNome, {
        //     type: arquivo.type,
        // });

        // const response = await postVagaIndicada(instance, accounts, local, novoArquivo);
        // alert(`Indicação Finalizada com Sucesso! Obrigada!`);
        // setArquivo(null);
        // setArea("");
        // console.log(response.webUrl);

    };

    return (
        <Container>
            <h2><LuMessageCircleMore sice={24}/> Como você está se sentindo hoje?</h2>
            <ItensContainer>
                <HumorContainer>
                    <HumorDiv onClick={() => setHumor(1)} opacidade={humor === 1 ? 'nao' : 'sim'}>
                        {/* <img src={Humor1} alt={"1"} /> */}
                        <p>😡</p> 
                    </HumorDiv>
                    {/* 😶‍🌫️😤😢🙂 😬😊*/}
                    <HumorDiv onClick={() => setHumor(2)} opacidade={humor === 2 ? 'nao' : 'sim'}>
                        {/* <img src={Humor2} alt={"2"} /> */}
                        <p>🥹</p>
                    </HumorDiv>
                    <HumorDiv onClick={() => setHumor(3)} opacidade={humor === 3 ? 'nao' : 'sim'}>
                        {/* <img src={Humor3} alt={"3"} /> */}
                        <p>😐</p>
                    </HumorDiv>
                    <HumorDiv onClick={() => setHumor(4)} opacidade={humor === 4 ? 'nao' : 'sim'}>
                        {/* <img src={Humor4} alt={"4"} /> */}
                        <p>😁</p>
                    </HumorDiv>
                    <HumorDiv onClick={() => setHumor(5)} opacidade={humor === 5 ? 'nao' : 'sim'}>
                        {/* <img src={Humor5} alt={"5"} /> */}
                        <p>🤩</p>
                    </HumorDiv>
                </HumorContainer>

                <textarea
                    placeholder='Gostaria de nos contar porque se sente assim?'
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    rows="5"
                />
                <Button onClick={handleEnviar} disabled={!humor}> Enviar Humor </Button>
            </ItensContainer>
        </Container>
    );
};

export default HumorComponent;

const Container = styled.div`
    width: 90%;
    color: #555;
    margin-top: 30px;
    flex-direction: column;
    justify-content: center;
    gap: 25px;
    margin-bottom: 10px;
    h2{
        color:#067DD1;
        text-align: center;
        font-size: 26px;
        margin: 10px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        svg {
            margin-right: 10px;
        }
    }
}
`

const ItensContainer = styled.div`
    font-size: 20px;
    gap: 25px;
    align-items: center; 
    flex-direction: column;
    justify-content: space-between;
    textarea {
        width: 55%; 
        height: 50px; 
        border-radius: 10px;
        color: #555;
        font-family: "Poppins", serif;
        // padding: 5px;
        padding: 5px 5px 5px 10px;
        &::placeholder{
            margin-left: 15px;
        }
    }
`

const HumorContainer = styled.div`
    width: 500px;
    gap: 30px;
`

const HumorDiv = styled.div`
    cursor: pointer;
    max-width: 75px;
    height: 75px;
    justify-content: center;
    align-items: center;
    box-shadow: 3px 5px 5px rgba(0, 0, 0, 0.4);
    border-radius: 50px;
    // border: ${({ borda }) => (borda  === 'sim' ? "2px solid #555" : "2px solid #D9D9D9")};
    opacity: ${({ opacidade }) => (opacidade  === 'sim' ? "0.5" : "1")};
    img { 
        width: 70px;
    }
    p {
        font-size: 55px;
    }
`

const Button = styled.button`
    min-width: 200px;
    height: 40px;
    // margin: 0 auto;
    justify-content: center;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    
`;
