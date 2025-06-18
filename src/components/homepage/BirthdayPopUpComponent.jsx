import styled from 'styled-components';
import { useEffect, useState } from "react";
import apiService from '../../services/apiService';
import { useAuth } from '../../contexts/AuthContext';
import MensagemAniversaio from '../../assets/ANIVERSARIANTE_DIA.jpeg';

function BirthdayPopUpComponent() {
    const { user, dados, carregando } = useAuth();
    const [closed, setClosed] = useState(true);
    const [isMyBDay, setIsMyBDay] = useState(false);

    console.log(dados);
    useEffect(() => {
        const fetchScale = async () => {
            try {
                const response = await apiService.getAniversariosDia();
                const isMyBirthday = response.data.some(item => item.email === user.mail);
                if(isMyBirthday){
                    setIsMyBDay(true);
                }
                //pegar se é aniversario de alguém
                else {
                    return;
                }
            } catch (error) {
                console.error("Erro ao buscar informacoes vagas:", error);
                return;
            }
        };

        fetchScale();

        const lastClosed = localStorage.getItem("popupFechado");
        
        if (!lastClosed) {
            setClosed(false);
            return;
        }

        const agora = new Date();
        const ultimaData = new Date(parseInt(lastClosed, 10));
        const diffMin = (agora - ultimaData) / 60000;

        if (diffMin >= 30) {
            setClosed(false);
        }

    }, [carregando, user, dados]);

    const fecharPopup = () => {
        setClosed(true);
        localStorage.setItem("popupFechado", Date.now().toString());
    };

    if (closed || !isMyBDay) return null;

    return (
        <Overlay>
            <Modal>
                <MyBDayImagem
                        src={MensagemAniversaio}
                        alt={"Mensagem"}
                    />
                <CloseButton onClick={fecharPopup}>✖</CloseButton>
            </Modal>
        </Overlay>
    )
}

export default BirthdayPopUpComponent;

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
  z-index: 15;
`;

const Modal = styled.div`
  background-color: transparent;
  position: relative;
  flex-wrap: wrap;
  width: 80%;
  height: 90%;
  padding: 20px;
  border-radius: 12px;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  color: #E40D5C;
  button{
    background: linear-gradient(to bottom, #F1314D,rgb(152, 8, 61));
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 8%;
  right: 21%;
  background: transparent;
  font-size: 20px;
  padding: 10px;
  cursor: pointer;
  color: white;
  border: 2px solid #E40D5C;
  z-index: 20;

  &:hover {
    cursor: pointer;
    background: white;
    color: #E40D5C;
    border: 2px solid #E40D5C;
    }
`;

const AniversarianteImagem = styled.img`
  height: 70%;
  border-radius: 10px;
`;

const MyBDayImagem = styled.img`
  height: 99%;
  border-radius: 10px;
`;