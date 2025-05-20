// SugestoesComponent.jsx
import { useState } from 'react';
import styled from "styled-components";
import { BsPersonVcardFill } from "react-icons/bs";
import { postVagaIndicada } from "../services/graph";
import { useAuth } from '../contexts/AuthContext';
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
            <h2>Como você está se sentindo hoje?</h2>
            <ItensContainer>
                <HumorContainer>
                    <HumorDiv onClick={() => setHumor(1)} borda={humor === 1 ? 'sim' : 'nao'}>
                        <img src={Humor1} alt={"1"} />
                    </HumorDiv>
                    <HumorDiv onClick={() => setHumor(2)} borda={humor === 2 ? 'sim' : 'nao'}>
                        <img src={Humor2} alt={"2"} />
                    </HumorDiv>
                    <HumorDiv onClick={() => setHumor(3)} borda={humor === 3 ? 'sim' : 'nao'}>
                        <img src={Humor3} alt={"3"} />
                    </HumorDiv>
                    <HumorDiv onClick={() => setHumor(4)} borda={humor === 4 ? 'sim' : 'nao'}>
                        <img src={Humor4} alt={"4"} />
                    </HumorDiv>
                    <HumorDiv onClick={() => setHumor(5)} borda={humor === 5 ? 'sim' : 'nao'}>
                        <img src={Humor5} alt={"5"} />
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
            {/* <ItensContainer>
                  <textarea
                        placeholder='Gostaria de nos contar porque se sente assim?'
                        value={mensagem}
                        onChange={(e) => setMensagem(e.target.value)}
                        rows="5"
                  />
            </ItensContainer>
            <Button onClick={handleEnviar} disabled={!humor}> Enviar Humor </Button> */}
        </Container>
    );
};

export default HumorComponent;

const Container = styled.div`
    width: 90%;
    color: #555;
    flex-direction: column;
    justify-content: flex-start;
    gap: 30px;
    margin-bottom: 50px;
    h2{
        color:#067DD1;
        text-align: left;
        font-size: 26px;
        margin: 15px 0;
        display: flex;
        align-items: center;
        svg {
            margin-right: 10px;
        }
    }
}
`

const ItensContainer = styled.div`
    font-size: 20px;
    height: 90px;
    align-items: center; 
    justify-content: space-between;
    textarea {
        min-width: 450px; 
        height: 70px; 
        border-radius: 10px;
        color: #555;
        font-family: "Poppins", serif;
        padding: 5px;
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
    border: ${({ borda }) => (borda  === 'sim' ? "2px solid #555" : "none")};
    img { 
        width: 70px;
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
