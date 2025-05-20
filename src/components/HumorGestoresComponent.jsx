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

function HumorGestoresComponent() {
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
            <h2>Como sua equipe está se sentindo hoje...</h2>
            <ItensContainer>
                <HumorContainer>
                    <div>
                        Funcionario 1:
                    </div>
                    <div>Está se sentindo: <img src={Humor1} alt={"1"} /></div>
                    <div>OBS.: texto se tiver</div>
                </HumorContainer>
                <HumorContainer>
                    Funcionario 2: Está se sentindo <img src={Humor4} alt={"1"} /> OBS.: texto se tiver
                </HumorContainer>
                <HumorContainer>
                    Funcionario 3: Está se sentindo <img src={Humor3} alt={"1"} /> OBS.: texto se tiver
                </HumorContainer>
            </ItensContainer>
        </Container>
    );
};

export default HumorGestoresComponent;

const Container = styled.div`
    margin: 0 10px 0 350px;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    gap: 10px;
    height: 60vh;
    color: #555;
    border: none;
    position: relative;
    overflow-y: scroll;
    h2 {
        margin: 10px 0;
    }
}
`

const ItensContainer = styled.div`
    width: 85%;
    margin-top: 30px;
    font-size: 20px;
    height: 90px;
    align-items: center; 
    flex-direction: column;
    gap: 40px;
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
    gap: 30px;
    justify-content: flex-start;
    background-color: red;
    align-items: center;
    div{
        justify-content: flex-start;
        align-items: center;
        gap: 10px;
    }
    img {
        width: 50px;
    }
`
