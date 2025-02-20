import { useEffect, useState } from "react";
import styled from "styled-components";
import TitleComponent from "../components/TitleComponent";

const ChatReportsPage = () => {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [serverStatus, setServerStatus] = useState('checking');
    const [messages, setMessages] = useState([{'text':'olá'}]);

    useEffect(() => {
        const checkServer = async () => {
          try {
            const response = await fetch('http://localhost:4004/api/health');
            if (response.ok) {
              setServerStatus('online');
              setError(null);
            } else {
              setServerStatus('error');
              setError('Servidor respondeu com erro');
            }
          } catch (err) {
            setServerStatus('offline');
            setError('Não foi possível conectar ao servidor. Certifique-se que ele está rodando na porta 4004');
          }
        };
    
        checkServer();
    }, []);    

    const handleSubmit = async (e) => {
    e.preventDefault();
    if (serverStatus !== 'online') {
      setError('Servidor não está online. Verifique a conexão.');
      return;
    }
    const inputMessage = message;
    setMessage('');
    setLoading(true);
    setError(null);
    const newInput = [...messages, { text: inputMessage, isUser: true }];
    setMessages(newInput);

    try {
        const response = await fetch('http://localhost:4004/api/chat', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1024,
            messages: [{
                role: 'user',
                content: inputMessage
            }]
            })
        });
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        // setResponse(data);
        const newInput = [...messages, { text: inputMessage, isUser: true },{ text: data, isUser: false }];
        setMessages(newInput);
    } catch (err) {
        const errorMessage = 'Erro ao conectar com a API: ' + err.message;
        // setError(errorMessage);
        const newInput = [...messages,{ text: message, isUser: true },{ text: errorMessage, isUser: false }];
        setMessages(newInput);
    } finally {
        setLoading(false);
    }
    };

    return (
        <PageContainer>
            <TitleComponent pageTitle={"CHAT RELATÓRIOS"} />
            <h2>{serverStatus}</h2>
            <ChatContainer>
                <MessagesContainer>
                    {messages.map((msg, index) => (
                        <Message key={index} isuser={msg.isUser}>{msg.text}</Message>
                    ))}
                </MessagesContainer>
                <InputContainer onSubmit={handleSubmit}>
                    <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Digite sua mensagem..."
                        rows="4"
                    />
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Enviando...' : 'Enviar'}
                    </Button>
                </InputContainer>
            </ChatContainer>
        </PageContainer>

    );
};

export default ChatReportsPage;


const PageContainer = styled.div`
    width: 100%;
    height: 100%;
    min-height: 100vh;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin-bottom: 25px;
`
const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 80vh;
  width: 60%;
  margin: auto;
  padding: 20px;
  background: rgba(30, 30, 30, 0.9);
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const Message = styled.div`
  padding: 10px;
  border-radius: 8px;
  margin: 5px 0;
  max-width: 80%;
  color: #fff;
  background: ${({ isuser }) => (isuser ? "#007bff" : "#444")};
  align-self: ${({ isuser }) => (isuser ? "flex-end" : "flex-start")};
  font-size: 15px;
`;

const InputContainer = styled.form`
  display: flex;
  border-top: 1px solid #444;
  gap: 20px;
  align-items: center;
  justify-content: center;
  height: 60px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  background: white;
  color: black;
  outline: none;
  font-size: 15px;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2563eb;
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;