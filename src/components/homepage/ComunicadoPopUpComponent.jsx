import styled from 'styled-components';
import { useEffect, useState } from "react";
import apiService from '../../services/apiService';
import { useAuth } from '../../contexts/AuthContext';
import MensagemAniversaio from '../../assets/ANIVERSARIANTE_DIA.jpeg';

function ComunicadoPopUpComponent() {
    const { user, carregando } = useAuth();
    const [closed, setClosed] = useState(true);
    const [temComunicado, setTemComunicado] = useState(false);

    useEffect(() => {
        const fetchScale = async () => {
            try {
                //busca se tem comunicado hoje e se ele ja foi lido pela pessoa
                const response = await apiService.getAniversariosDia();
                const isMyBirthday = response.data.some(item => item.email === user.mail);
                if(isMyBirthday){
                    setTemComunicado(true);
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

    }, [carregando, user]);

    const fecharPopup = () => {
        setClosed(true);
        localStorage.setItem("popupFechado", Date.now().toString());
    };

    const leituraPopup = () => {
        //enviar notificacao de lido, se for ok fecho o popup
        setClosed(true);
    };

    if (closed || !isMyBDay) return null;

    return (
        <Overlay>
            <CloseButton onClick={fecharPopup}>✖</CloseButton>
            <Modal>
                <AniversarianteImagem
                        src={MensagemAniversaio}
                        alt={"Mensagem"}
                    />
                
            </Modal>
        </Overlay>
    )
}

export default ComunicadoPopUpComponent;

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
  z-index: 9999;
`;

const Modal = styled.div`
  
  background-color: transparent;
  width: 900px;
  padding: 20px;
  min-width: 400px;
  border-radius: 12px;
  justify-content: space-around;
  align-items: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 2%;
  right: 25%;
  background: transparent;
  font-size: 25px;
  padding: 10px;
  cursor: pointer;
  color: white;
  border: 2px solid white;
  z-index: 10;

  &:hover {
    cursor: pointer;
    background: white;
    color: #FF5843;
    }
`;

const AniversarianteImagem = styled.img`
  width: 450px;
  border-radius: 10px;
  position: relative;
`;
