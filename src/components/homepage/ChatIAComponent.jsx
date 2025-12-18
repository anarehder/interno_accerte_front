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
    const [aguardandoResposta, setAguardandoResposta] = useState(false);
    const [chatHistory, setChatHistory] = useState([
        {type:"pergunta", text: "Qual sua dúvida quanto às nossas políticas?"}
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
        console.log("Enviando pergunta:", inputValue);
        
        const novaPergunta = { type: "pergunta", text: inputValue };
        setChatHistory([...chatHistory, novaPergunta]);
        setInputValue("");
        setAguardandoResposta(true);
        
        try {
            const body = {"email": user.mail, "question": inputValue};
            const response = await apiService.ragQuery(body);
            console.log("Resposta recebida:", response.data.response);
            setChatHistory(prev => [...prev, { type: "resposta", text: response.data.response }]);
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
                <ChatButton onClick={() => setOpen(!open)}>
                    <img src={avatarAccerte} alt="Abrir chat" style={{ width: '100%', height: '100%', borderRadius: 0, padding: 0, margin: 0, display: 'block' }} />
                </ChatButton>
            }
            <AnimatePresence>
            {open && (
                <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 0 }}
                        transition={{ duration: 0 }}
                    >
                        <ChatContainer>
                            <ChatHeader>
                                <span className="font-semibold">Fale com o NEO 🤖</span>
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
                    </motion.div>
            )}
            </AnimatePresence>
        </Overlay>
    );
}

export default ChatIAComponent;

const Overlay = styled.div`
    position: fixed;
    bottom: 10px;
    right: 20px;
    width: auto;
    padding: 10px;
    background-color: white;
    border: 2px solid #001143; 
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9;
`;

const ChatContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 350px;
    height: 400px;
    background: white;
    border-radius: 16px;
    box-sizing: border-box;
    position: relative;
`;

const ChatHeader = styled.div`
    position: sticky;
    padding: 5px;
    top: 0;
    background: white;
    border-radius: 15px;
    z-index: 2;
    padding-bottom: 8px;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    border-bottom: 1px solid #eee;
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
    bottom: 0;
    background: white;
    z-index: 2;
    padding-top: 8px;
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
`;

const Prompt = styled.div`
    background-color: white;
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
  background: transparent;
  font-size: 15px;
  padding: 0;
  margin: 0;
  cursor: pointer;
  color: #001143;
  border: none;
  z-index: 10;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    cursor: pointer;
    background:  #001143;
    color: white;
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
  top: 0;
  right: 0;
  position: absolute;
  font-size: 10px;
  padding: 4px;
  margin: 6px;
  margin-right: 12px;
  cursor: pointer;
  color: #001143;
  z-index: 10;
  &:hover {
    cursor: pointer;
    background:  #001143;
    color: white;
    }
`;