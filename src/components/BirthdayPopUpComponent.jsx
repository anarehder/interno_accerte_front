import styled from 'styled-components';
import { useEffect, useState } from "react";
import { useAuth } from '../contexts/AuthContext';

function BirthdayPopUpComponent() {
    const { dados, carregando } = useAuth();
    const [closed, setClosed] = useState(true);
    
    useEffect(() => {
        if (carregando || dados.aniversarioDia.lenght === 0) return;

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

    }, [carregando, dados]);

    const fecharPopup = () => {
        setClosed(true);
        localStorage.setItem("popupFechado", Date.now().toString());
    };
    // console.log(dados.aniversarioDia);
    if (closed || dados.aniversarioDia.lenght === 0) return null;
    return (
        <Overlay>
            <CloseButton onClick={fecharPopup}>✖</CloseButton>
            <Modal>
                {dados.aniversarioDia.map((aniv, index) => (
                    <AniversarianteImagem
                        key={index}
                        src={aniv.url}
                        alt={aniv.name}
                    />
                ))}
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
  position: relative;
  background-color: white;
  width: 900px;
  padding: 20px;
  min-width: 400px;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  justify-content: space-around;
  align-items: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 8%;
  right: 10%;
  background: transparent;
  font-size: 25px;
  padding: 10px;
  cursor: pointer;
  color: white;
  border: 2px solid white;

  &:hover {
    cursor: pointer;
    background: white;
    color: #FF5843;
    }
`;

const AniversarianteImagem = styled.img`
  max-width: 400px;
  max-height: 80vh;
  border-radius: 10px;
`;
