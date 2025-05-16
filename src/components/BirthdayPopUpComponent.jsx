import styled from 'styled-components';
import { useEffect, useState } from "react";
import { useAuth } from '../contexts/AuthContext';
import MensagemAniversaio from '../assets//ANIVERSARIANTE_DIA.jpeg';

function BirthdayPopUpComponent() {
    const { user, carregando } = useAuth();
    const [closed, setClosed] = useState(true);

    useEffect(() => {
        // if (carregando || !dados || !dados.aniversarioDia || dados.aniversarioDia.length === 0) return;
        //buscar se tem aniversariante hoje, se tiver vejo se o email é o mesmo do user
        // se for eu renderizo
        // se nao so dou null
        if (user.mail !== 'augusto.cesar@accerte.com.br') return;
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

    }, [carregando]);

    const fecharPopup = () => {
        setClosed(true);
        localStorage.setItem("popupFechado", Date.now().toString());
    };

    // if (closed || !dados || !dados.aniversarioDia || dados.aniversarioDia.length === 0) return null;
    if (closed || user.mail !== 'augusto.cesar@accerte.com.br') return null;
    return (
        <Overlay>
            <CloseButton onClick={fecharPopup}>✖</CloseButton>
            <Modal>
                {/* {dados.aniversarioDia.map((aniv, index) => (
                    <AniversarianteImagem
                        key={index}
                        src={aniv.url}
                        alt={aniv.name}
                    />
                ))} */}
                <AniversarianteImagem
                        src={MensagemAniversaio}
                        alt={"Mensagem"}
                    />
                
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
