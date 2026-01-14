import styled from 'styled-components';
import { FiSend } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion"; // Para animações suaves
import { useState, useRef, useEffect } from 'react';
import avatarAccerte from '../../assets/AvatarAccerte_2.png';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/apiService';

function ChatIAComponent() {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [startChat, setStartChat] = useState(false);
    const [aguardandoResposta, setAguardandoResposta] = useState(false);
    const [chatHistory, setChatHistory] = useState([
        {type:"resposta", text: "Qual sua dúvida quanto às nossas políticas?"}
    ]);
    const [inputValue, setInputValue] = useState("");
    const chatBlockRef = useRef(null);

    useEffect(() => {
        if (chatBlockRef.current) {
            chatBlockRef.current.scrollTop = chatBlockRef.current.scrollHeight;
        }
    }, [chatHistory, open]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (inputValue.trim() === "") return;
        // console.log("Enviando pergunta:", inputValue);
        
        const novaPergunta = { type: "pergunta", text: inputValue };
        const novoHistorico = [...chatHistory, novaPergunta];
        setChatHistory(novoHistorico);
        setInputValue("");
        setAguardandoResposta(true);
        
        try {
            let pergunta_anterior = "";
            let resposta_anterior = "";
            
            if (novoHistorico.length > 1) {
                // Encontrar a última pergunta (antes da nova pergunta)
                for (let i = novoHistorico.length - 2; i >= 0; i--) {
                    if (novoHistorico[i].type === "pergunta") {
                        pergunta_anterior = novoHistorico[i].text;
                        break;
                    }
                }
                
                // Encontrar a última resposta
                for (let i = novoHistorico.length - 2; i >= 0; i--) {
                    if (novoHistorico[i].type === "resposta") {
                        resposta_anterior = novoHistorico[i].text;
                        break;
                    }
                }
            }
            
            const body = {
                "email": user.mail,
                "pergunta": inputValue,
                "pergunta_anterior": pergunta_anterior,
                "resposta_anterior": resposta_anterior
            };
            // console.log(chatHistory);
            // console.log("Corpo da requisição:", body);
            const response = await apiService.ragQuery(body);
            // console.log("Resposta recebida:", response.data.answer);
            setChatHistory(prev => [...prev, { type: "resposta", text: response.data.answer }]);
        } catch (error) {
            console.error("Erro ao obter resposta:", error);
            setChatHistory(prev => [...prev, { type: "resposta", text: "Desculpe, ocorreu um erro ao processar sua pergunta." }]);
        } finally {
            setAguardandoResposta(false);
        }
    };

    return (
        <Overlay>
            {/* Botão do chat */}
            {open ?
                <CloseButton onClick={() => setOpen(!open)}>
                    <h2>X</h2>
                </CloseButton>
                :
                <>
                    <WelcomeBox>
                        <span>Olá</span>, como posso te ajudar?
                    </WelcomeBox>
                    <ChatButton onClick={() => setOpen(!open)}>
                        <img src={avatarAccerte} alt="Abrir chat" style={{ width: '100%', height: '100%', borderRadius: 0, padding: 0, margin: 0, display: 'block' }} />
                    </ChatButton>
                </>
            }
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 0 }}
                        transition={{ duration: 0 }}
                    >
                        {
                            !startChat &&
                            <ChatContainer>
                                <StartContainer>
                                <img src={avatarAccerte} alt="Abrir chat" />
                                <h2> NEO</h2>
                                <h3> online</h3>
                                <p>Olá seja bem-vindo(a)! <br/> Eu sou o NEO, seu assistente virtual, no momento estou preparado para responder suas dúvidas sobre as políticas da Accerte <br/> Para consultar os documentos: <a href="https://accerte.sharepoint.com/sites/AccerteTecnologiadaInformaoLtda/Documentos%20Compartilhados/Políticas"target='_blank'><br/> Políticas da Accerte </a></p>
                                </StartContainer>
                                <StartButton onClick={() => setStartChat(true)}> Iniciar </StartButton>
                            </ChatContainer>
                        }
                        {
                            startChat &&
                            <ChatContainer>
                                <ChatHeader>
                                    <img src={avatarAccerte} alt="Abrir chat" />
                                    <div>
                                        <span className="font-semibold">NEO</span>
                                        <h3> online</h3>
                                    </div>
                                    
                                </ChatHeader>
                                <ChatBlock ref={chatBlockRef}>
                                    {chatHistory.map((item, index) => (
                                        item.type === 'pergunta' ?
                                            <Pergunta className="chat-message" key={index}>
                                                {item.text}
                                            </Pergunta>
                                            :
                                            <Resposta className="chat-message" key={index}>
                                                {item.text}
                                            </Resposta>
                                    ))}
                                    {aguardandoResposta && (
                                        <Resposta className="chat-message">
                                            <TypingIndicator>
                                                <span>.</span>
                                                <span>.</span>
                                                <span>.</span>
                                            </TypingIndicator>
                                        </Resposta>
                                    )}
                                </ChatBlock>
                                <PromptContainer>
                                    <Prompt className="chat-prompt" onSubmit={handleSend} as="form">
                                        <input
                                            type="text"
                                            placeholder="Digite sua pergunta..."
                                            value={inputValue}
                                            onChange={e => setInputValue(e.target.value)}
                                        />
                                        <button type="submit"> <FiSend /> </button>
                                    </Prompt>
                                </PromptContainer>
                            </ChatContainer>
                        }
                    </motion.div>
            )}
            </AnimatePresence>
        </Overlay>
    );
}

export default ChatIAComponent;

const Overlay = styled.div`
    position: fixed;
    // background: red;
    bottom: 10px;
    right: 20px;
    width: auto;
    padding: 20px 15px;
    border-radius: 30px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: 0;
    z-index: 9;
`;

const StartContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 350px;
    padding-top: 25px;
    img{
        height: 150px;
        width: 150px;
        margin: 0 auto;
    }
    a{
        // font-size: 12px;
    }
    h3{
        color: gray;
        font-size: 15px;
        font-style: italic;
        margin-bottom: 10px;
    }
    p{
        margin: 5px;
        padding: 10px;
        line-height: 1.3;
        font-size: 14px;
        word-break: break-word;
        text-align: center;
    }
`

const ChatContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 350px;
    height: 450px;
    background: white;
    border-radius: 16px;
    box-sizing: border-box;
    position: relative;
    border: 1px solid #00000040;
`;

const StartButton = styled.button`
    background-color: #003997;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 10px 20px;
    width: 80%;
    margin: 0 auto;
    margin-top: 15px;
    justify-content: center;
`

const ChatHeader = styled.div`
    text-indent: 5px;
    margin-top: 5px;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    align-items: center;
    border-bottom: 1px solid #eee;
    img{
        width: 55px;
        height: 55px;
        margin: 0 10px;
        border-radius: 50%;
        vertical-align: middle;
        border: 1px solid gray;
    }
    div{
        height: 90%;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        gap: 3px;
    }
    h3{
        color: gray;
        font-size: 13px;
        font-style: italic;
    }
`;

const ChatBlock = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
    overflow-y: auto;
    padding: 16px 0;
    .chat-message {
        padding: 8px;
        margin-top: 5px;
        max-width: 85%;
        word-break: break-word;
    }
`

const PromptContainer = styled.div`
    position: sticky;
    border-radius: 30px;
    bottom: 0;
    z-index: 2;
    padding-top: 8px;
    padding: 2px 0;
    border-top: 1px solid #eee;
`;

const Pergunta = styled.div`
    background-color: #003997;
    color: white;
    align-self: flex-end;
    text-align: left;
    border-radius: 12px 12px 0 12px;
    font-size: 13px;
    line-height: 1.7;
    margin-right: 8px;
`;

const Resposta = styled.div`
    background-color: white;
    color: #001143;
    font-size: 13px;
    border: 1px solid #001143;
    align-self: flex-start;
    text-align: left;
    border-radius: 0 12px 12px 12px;
    line-height: 1.7;
    margin-left: 8px;
`;

const Prompt = styled.div`
    color: #001143;
    font-size: 15px;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    padding: 8px;
    gap: 8px;
    box-sizing: border-box;
    align-self: stretch;
    border-radius: 30px;
    input {
        font-size: 14px;
        flex: 1;
        padding: 8px;
        border: 1px solid #001143;
        border-radius: 6px;
        margin-right: 8px;
        min-width: 0;
    }
    button {
        padding: 8px;
        font-size: 15px;
        background-color: #003997;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.2s;
        white-space: nowrap;
    }
`;

const ChatButton = styled.button`
  background: white;
  font-size: 15px;
  padding: 5px;
  text-align: center;
  margin: 0;
  cursor: pointer;
  color: #001143;
  border: 7px solid transparent;
  background-image: linear-gradient(white, white), linear-gradient(180deg, #649AD9 0%, #004CB3 100%);
  background-origin: padding-box, border-box;
  background-clip: padding-box, border-box;
  overflow: hidden;
  border-radius: 50%;
  z-index: 10;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  &:hover {
    cursor: pointer;
    background-image: linear-gradient(white, white), linear-gradient(180deg, #549AC9 0%, #003BA3 100%);
    background-origin: padding-box, border-box;
    background-clip: padding-box, border-box;
    color: white;
    }
`;

const WelcomeBox = styled.div`
  background: white;
  color: #001143;
  font-size: 16px;
  width: 230px;
  padding: 12px 20px;
  padding-right: 35px;
  border-radius: 20px;
  box-shadow: 0px 4px 4px 0px #00000040;
  white-space: nowrap;
  z-index: 5;
  margin-right: -25px;
  span{
    font-weight: 600;
}
`;

const TypingIndicator = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  
  span {
    animation: blink 1.4s infinite;
    font-size: 20px;
    font-weight: bold;
  }
  
  span:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  span:nth-child(3) {
    animation-delay: 0.4s;
  }
  
  @keyframes blink {
    0%, 60%, 100% {
      opacity: 0;
    }
    30% {
      opacity: 1;
    }
  }
`;

const CloseButton = styled.button`
  background: transparent;
  top: 20px;
  right: 15px;
  width: 30px;
  text-align: center;
  position: absolute;
  font-size: 10px;
  padding: 5px;
  margin: 6px;
  cursor: pointer;
  color: #001143;
  border-radius: 50%;
  z-index: 10;
  h2{
    font-size: 16px;
    width: 27px;
    text-align: center;
  }
  &:hover {
    cursor: pointer;
    background:  #001143;
    color: white;
    }
`;