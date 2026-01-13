import styled from 'styled-components';
import { useEffect, useState } from "react";
import BalloonAnimationComponent from './BalloonAnimationComponent';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/apiService';

function SomeoneBirthdayComponent() {
    const { user, dados, carregando } = useAuth();
    const [someBdayClosed, setSomeBdayClosed] = useState(false);
    const [hasAnniversaryToday, setHasAnniversaryToday] = useState(false);
    console.log(hasAnniversaryToday);
    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await apiService.getAniversariosDia();
                if(response.data.length > 0){
                    setHasAnniversaryToday(true);
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

    if (someBdayClosed) return null;
    if (!someBdayClosed && hasAnniversaryToday) {
        return (
            <Overlay>
            <BalloonAnimationComponent />
            <CloseButton onClick={fecharPopup}>✖</CloseButton>
            <Modal>
                <Title>🎉 Hoje é aniversário de alguém especial! 🎂</Title>
                <Message>
                    Temos aniversariantes na equipe hoje! 
                    <br />
                    Não esqueça de parabenizar! 🎈
                </Message>
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
  top: calc(50% - 90px);
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
`;

const Message = styled.p`
  font-size: 18px;
  color: #001143;
  text-align: center;
  line-height: 1.6;
`;
