import { useEffect, useState } from 'react';
import styled from "styled-components";
import { useAuth } from '../contexts/AuthContext';
import { LuMessageCircleMore } from "react-icons/lu";
import apiService from '../services/apiService';

function HumorComponent() {
    const { user } = useAuth();
    const [humor, setHumor] = useState("");
    const [savedHumor, setSavedHumor] = useState([]);
    const [mensagem, setMensagem] = useState('');
    const [carregando, setCarregando] = useState(true);
    const today = new Date().toISOString().slice(0, 10);
    // console.log(humor);
    useEffect(() => {
        if (!user) return;
        const fetchScale = async () => {
            try {
                const body = { email: user.mail, data: today };
                const response = await apiService.buscarHumorFuncionario(body);
                if (response.data.length === 1){
                    setSavedHumor(response.data);
                    setHumor(response.data[0].humor);
                    // setMensagem(response.data[0].mensagem);
                }
                setCarregando(false);
            } catch (error) {
                console.error(error.response.data.message);
                setCarregando(false);
            }
        };

        fetchScale();

    }, [user, savedHumor]);

    const handleSelect = (number) =>{
        if(savedHumor.length === 0){
            setHumor(number);
        }
    }

    const handleEnviar = async () => {
        const body = { email: user.mail, humor, mensagem };
        try {
            const response = await apiService.criarHumor(body);
            let array = [];
            array.push(response);
            setSavedHumor(array);
            setCarregando(false);
        } catch (error) {
            console.error(error.response.data.message);
            setCarregando(false);
        }

    };

    return (
        <Container>
            <h2><LuMessageCircleMore sice={24}/> Como você está se sentindo hoje?</h2>
            <ItensContainer>
                <HumorContainer>
                    <HumorDiv onClick={()=>handleSelect(1)} $opacidade={humor === 1 ? 'nao' : 'sim'}>
                        <div>😡</div> 
                    </HumorDiv>
                    {/* 😶‍🌫️😤😢🙂 😬😊*/}
                    <HumorDiv onClick={()=>handleSelect(2)} $opacidade={humor === 2 ? 'nao' : 'sim'}>
                        <div>🥹</div>
                    </HumorDiv>
                    <HumorDiv onClick={()=>handleSelect(3)} $opacidade={humor === 3 ? 'nao' : 'sim'}>
                        <div>😐</div>
                    </HumorDiv>
                    <HumorDiv onClick={()=>handleSelect(4)} $opacidade={humor === 4 ? 'nao' : 'sim'}>
                        <div>😁</div>
                    </HumorDiv>
                    <HumorDiv onClick={()=>handleSelect(5)} $opacidade={humor === 5 ? 'nao' : 'sim'}>
                        <div>🤩</div>
                    </HumorDiv>
                </HumorContainer>

                <textarea
                    placeholder={savedHumor.length === 0 ? 'Gostaria de nos contar porque se sente assim?' : 'Você já enviou seu humor hoje.'}
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    rows="5"
                    disabled={savedHumor.length !== 0}
                />
                <p>Fique à vontade para falar o que sente. Essa informação é privada e será lida somente por alguém que quer te ver feliz.</p>
                <Button onClick={handleEnviar} disabled={savedHumor.length >0}> Enviar Humor </Button>
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
    gap: 20px;
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
    p{
        font-size: 12px;
        font-style: italic;
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
