import styled from 'styled-components';
import { FaComments } from "react-icons/fa"; // Ícone de chat
import { motion, AnimatePresence } from "framer-motion"; // Para animações suaves
import { useState } from 'react';

function ChatIAComponent() {
    const [open, setOpen] = useState(false);

  // Exemplo de histórico de conversas (pode vir de props, API, etc.)
    const ChatHistory = [
        {type:"pergunta", text: "Qual é a capital da França?"},
        {type:"resposta", text: "Paris."},
        {type:"pergunta", text: "Quem descobriu o Brasil?"},
        {type:"resposta", text: "Pedro Álvares Cabral."}
    ];

    return (
        <Overlay>
            {/* Botão do chat */}
            {open ?
                <CloseButton onClick={() => setOpen(!open)}>
                    <h2>X</h2>
                </CloseButton>
                :
                <ChatButton onClick={() => setOpen(!open)}>
                    <FaComments size={22} />
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
                        <ChatBlock>
                            <span className="font-semibold">Chat com IA 🤖</span>
                            {ChatHistory.map((item, index) => (
                                item.type === 'pergunta' ?
                                    <Pergunta>
                                        {item.text}
                                    </Pergunta>
                                    :
                                    <Resposta>
                                        {item.text}
                                    </Resposta>
                            ))}
                            <Prompt>
                                <input
                                    type="text"
                                    placeholder="Digite sua pergunta..."
                                />
                                <button> send </button>
                            </Prompt>

                        </ChatBlock>
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
    background-color: white;
    border: 2px solid #001143; 
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9;
`;

const ChatBlock = styled.div`
    flex-direction: column;
    padding: 20px;
    width: 250px;
    gap: 5px;
    div{
        width: 200px;
        padding: 20px;
        border-radius: 12px;
        margin-top: 5px;
    }
`

const Pergunta = styled.div`
    background-color: #001143;
    right: 0px;
    color: white;
`;

const Resposta = styled.div`
    background-color: white;
    left: 0px;
    color: #001143;
    font-size: 15px;
    border: 1px solid #001143;
`;

const Prompt = styled.div`
    background-color: white;
    color: #001143;
    font-size: 15px;
    border: 1px solid #001143;
    input{
        font-size: 14px;
    }
`;

const ChatButton = styled.button`
  background: transparent;
  font-size: 15px;
  padding: 3px 6px;
  margin: 5px;
  cursor: pointer;
  color: #001143;
  border: 1px solid #001143;
  z-index: 10;
  &:hover {
    cursor: pointer;
    background:  #001143;
    color: white;
    }
`;

const CloseButton = styled.button`
  background: transparent;
  top: 0;
  right: 0;
  position: absolute;
  font-size: 15px;
  padding: 3px 6px;
  margin: 5px;
  cursor: pointer;
  color: #001143;
  border: 1px solid #001143;
  z-index: 10;
  &:hover {
    cursor: pointer;
    background:  #001143;
    color: white;
    }
`;