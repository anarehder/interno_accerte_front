import { useEffect, useState } from 'react';
import styled from "styled-components";
import { useAuth } from '../../contexts/AuthContext';
import { LuMessageCircleMore } from "react-icons/lu";
import apiService from '../../services/apiService';
import { FaPaperPlane } from "react-icons/fa";

function HumorComponent() {
    const { user } = useAuth();
    const [humor, setHumor] = useState("");
    const [savedHumor, setSavedHumor] = useState([]);
    const [mensagem, setMensagem] = useState('-');
    const [carregando, setCarregando] = useState(true);
    const [updated, setUpdated] = useState(false);
    const today = new Date().toISOString().slice(0, 10);

    useEffect(() => {
        if (!user) return;
        const fetchScale = async () => {
            try {
                setCarregando(true);
                const body = { email: user.mail, data: today };
                const response = await apiService.buscarHumorFuncionario(body);
                if (response.data.length === 1){
                    setSavedHumor(response.data);
                    setHumor(response.data[0].humor);
                    setUpdated(false);
                    setMensagem(response.data[0].mensagem);
                }
                setCarregando(false);
            } catch (error) {
                console.error(error.response.data.message);
                setCarregando(false);
            }
        };

        fetchScale();

    }, [user, updated]);

    const handleSelect = (number) =>{
        if(savedHumor.length === 0){
            setHumor(number);
        }
    }

    const handleEnviar = async () => {
        const body = { email: user.mail, humor, mensagem };
        try {
            const response = await apiService.criarHumor(body);
            if(response.status === 200){
                setUpdated(true);
                alert("Enviado com sucesso!");
            }
        } catch (error) {
            console.error(error.response.data.message);
            setCarregando(false);
        }

    };

    return (
        <Container>
            
            <ItensContainer>
                <TextContainer>
                    <h2>Como você está se sentindo hoje?</h2>
                    <HumorContainer>  
                        {/* 😶‍🌫️😤😢🙂 😬😊*/}
                        <HumorDetails>
                            <HumorDiv onClick={() => handleSelect(1)} $opacidade={humor === 1 ? 'nao' : 'sim'}>
                            <div>😡</div>
                            </HumorDiv>
                            irritado
                        </HumorDetails>
                        <HumorDetails>
                            <HumorDiv onClick={() => handleSelect(2)} $opacidade={humor === 2 ? 'nao' : 'sim'}>
                            <div>😢</div>
                            </HumorDiv>
                            triste
                        </HumorDetails>
                        <HumorDetails>
                            <HumorDiv onClick={() => handleSelect(3)} $opacidade={humor === 3 ? 'nao' : 'sim'}>
                                <div>😐</div>
                            </HumorDiv>
                            normal
                        </HumorDetails>
                        <HumorDetails>
                            <HumorDiv onClick={() => handleSelect(4)} $opacidade={humor === 4 ? 'nao' : 'sim'}>
                                <div>😁</div>
                            </HumorDiv>
                            feliz
                        </HumorDetails>
                        <HumorDetails>
                            <HumorDiv onClick={() => handleSelect(5)} $opacidade={humor === 5 ? 'nao' : 'sim'}>
                            <div>🤩</div>
                            </HumorDiv>
                            muito feliz
                        </HumorDetails>
                    </HumorContainer>
                </TextContainer>

                <TextContainer>
                    <textarea
                        placeholder={savedHumor.length === 0 ? 'Gostaria de nos contar porque se sente assim?' : 'Você já enviou seu humor hoje.'}
                        onChange={(e) => setMensagem(e.target.value)}
                        rows="5"
                        disabled={savedHumor.length !== 0}
                    />
                    <SubmitContainer>
                        <p>Fique à vontade para falar o que sente. <br/> Essa informação é privada e será lida somente por alguém que quer te ver feliz.</p>
                        <Button onClick={handleEnviar} disabled={savedHumor.length > 0}> ENVIAR HUMOR <FaPaperPlane size={24} /> </Button>
                    </SubmitContainer>
                </TextContainer>
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
        text-align: center;
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
`

const ItensContainer = styled.div`
    font-size: 20px;
    gap: 20px;
    align-items: center; 
    justify-content: center;
    color: #09307e;
    p{
        font-size: 12px;
        font-style: italic;
    }
`

const HumorContainer = styled.div`
    // width: 500px;
    gap: 30px;
    flex-wrap: wrap;
    justify-content: center;
`

const HumorDiv = styled.div`
    cursor: pointer;
    max-width: 75px;
    height: 75px;
    justify-content: center;
    align-items: center;
    box-shadow: 3px 5px 5px rgba(0, 0, 0, 0.4);
    border-radius: 50px;
    opacity: ${({ $opacidade }) => ($opacidade  === 'sim' ? "0.5" : "1")};
    img { 
        width: 70px;
    }
    p {
        font-size: 55px;
    }
    div {
        font-size: 55px;
        caret-color: transparent;
        justify-content: center;
        align-items: center;
        &:hover {
            transform: scale(1.5);
        }
    }
`

const HumorDetails = styled.div`
    max-width: 75px;
    flex-direction: column;
    align-items: center;
    font-size: 12px;
    gap: 10px;
`

const SubmitContainer = styled.div`
    justify-content: center;
`
const TextContainer = styled.div`
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    width: 55%;
    &:first-of-type{
        // background-color: red;
        width: 40%;    
        border-right: 1px solid #09307e;
    }
    textarea {
        box-shadow: 2px 2px 3px 2px rgba(0, 0, 0, 0.2);
        width: 95%;
        height: 50px; 
        border-radius: 10px;
        background-color: #ededed;
        color: #555;
        font-family: "Poppins", serif;
        padding: 5px 5px 5px 10px;
        &::placeholder{
            margin-left: 15px;
        }
    }
    button{
        color: white;
        background: linear-gradient(to right,#205fdd, #001143);
    }
    p{
        display: flex;
        align-items: center;
    }
`

const Button = styled.button`
    min-width: 200px;
    height: 50px;
    margin-left: 25px;
    // margin: 0 auto;
    justify-content: space-between;
    font-size: 16px;
    font-weight: 700;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    
`;
