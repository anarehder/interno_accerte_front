import styled from 'styled-components';
import { useEffect, useState } from "react";
import BalloonAnimationComponent from './BalloonAnimationComponent';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/apiService';

function SomeoneBirthdayComponent() {
    const { user, dados, carregando } = useAuth();
    const [someBdayClosed, setSomeBdayClosed] = useState(false);
    const [hasAnniversaryToday, setHasAnniversaryToday] = useState(false);
    const [aniversariantes, setAniversariantes] = useState([]);
    // console.log(hasAnniversaryToday);
    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await apiService.getAniversariosDia();
                // console.log(response.data);
                if(response.data.length > 0){
                    setHasAnniversaryToday(true);
                    const aniversariantesOrdenados = response.data.sort((a, b) => {
                        const nomeA = `${a.nome} ${a.sobrenome}`.toLowerCase();
                        const nomeB = `${b.nome} ${b.sobrenome}`.toLowerCase();
                        return nomeA.localeCompare(nomeB);
                    });
                    setAniversariantes(aniversariantesOrdenados);
                }
                else {
                    setHasAnniversaryToday(false);
                    return;
                }
            } catch (error) {
                console.error("Erro ao buscar informacoes vagas:", error);
                setHasAnniversaryToday(false);
                return;
            }
        };

        fetch();

        const lastClosedDate = localStorage.getItem("someBdayClosed");
        const today = new Date().toISOString().split('T')[0];
        
        if (!lastClosedDate) {
            setSomeBdayClosed(false);
            return;
        }

        if (lastClosedDate !== today) {
            localStorage.removeItem("someBdayClosed");
            setSomeBdayClosed(false);
            return;
        }

        setSomeBdayClosed(true);

    }, [carregando, user, dados]);

    const fecharPopup = () => {
        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem("someBdayClosed", today);
        setSomeBdayClosed(true);
    };

    const emailsAniversariantes = aniversariantes.map(a => a.email).filter(Boolean).join(',');

    if (someBdayClosed) return null;
    if (!someBdayClosed && hasAnniversaryToday) {
        return (
            <Overlay>
            <BalloonAnimationComponent />
            <CloseButton onClick={fecharPopup}>✖</CloseButton>
            <Modal>
                <Title>🎉 Hoje é aniversário de alguém especial! 🎂</Title>
                <Message>
                    Não esqueça de parabenizar! 🎈
                </Message>
                <AniversariantesList>
                    {aniversariantes.map((aniversariante, index) => (
                        <div key={index}>{aniversariante.nome} {aniversariante.sobrenome}</div>
                    ))}
                </AniversariantesList>
                <EmailLink href={`mailto:${emailsAniversariantes}?subject=Feliz%20Aniversário`} target="_blank">
                    📧 Enviar Email de Parabéns
                </EmailLink>
            </Modal>
        </Overlay>
        );
    }
}

export default SomeoneBirthdayComponent;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const Modal = styled.div`
  background-color: white;
  position: relative;
  width: 500px;
  padding: 40px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #001143;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
`;

const CloseButton = styled.button`
  position: absolute;
  top: calc(50% - 140px);
  right: calc(50% - 270px);
  background-color: white;
  font-size: 20px;
  padding: 7px;
  cursor: pointer;
  color: #FF455E;
  border: 2px solid #FF455E;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 11;
  
  &:hover {
    cursor: pointer;
    background: #FF455E;
    color: white;
  }
`;

const Title = styled.h2`
  font-size: 26px;
  font-weight: bold;
  color: #001143;
  margin-bottom: 20px;
  text-align: center;
  line-height: 1.4;
`;

const Message = styled.p`
  font-size: 18px;
  color: #001143;
  text-align: center;
  line-height: 1.6;
`;

const AniversariantesList = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  
  div {
    font-size: 16px;
    color: #205fdd;
    font-weight: 600;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    
    &::before {
      content: "•";
      font-size: 24px;
      color: #205fdd;
    }
  }
`;

const EmailLink = styled.a`
  margin-top: 25px;
  padding: 12px 24px;
  background: linear-gradient(to right, #205fdd, #001143);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  display: inline-block;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    color: white;
    text-decoration: none;
  }
  
  &:active {
    transform: translateY(0);
  }
`;
