import styled from 'styled-components';
import { useEffect, useState } from "react";
import { FaWhatsapp, FaEnvelope } from "react-icons/fa";
import BalloonAnimationComponent from './BalloonAnimationComponent';
import CloseIconButton from '../basic/CloseIconButton';
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

    const formatarTelefoneWhatsapp = (telefone) => {
        if (!telefone) return null;
        const apenasDigitos = telefone.replace(/\D/g, '');
        if (!apenasDigitos) return null;
        return apenasDigitos.startsWith('55') ? apenasDigitos : `55${apenasDigitos}`;
    };

    if (someBdayClosed) return null;
    if (!someBdayClosed && hasAnniversaryToday) {
        return (
            <Overlay>
            <BalloonAnimationComponent />

            <Modal>
                <PositionedCloseButton onClick={fecharPopup} />

                <IconBadge>🎂</IconBadge>

                <Title>Hoje tem aniversário! 🎉</Title>
                <Message>
                    Não esqueça de parabenizar
                </Message>

                <NamesList>
                    {aniversariantes.map((aniversariante, index) => (
                        <NameChip key={index}>
                            {aniversariante.nome} {aniversariante.sobrenome}
                        </NameChip>
                    ))}
                </NamesList>

                <Actions>
                    <EmailLink href={`mailto:${emailsAniversariantes}?subject=Feliz%20Aniversário`} target="_blank">
                        <FaEnvelope size={18} /> Enviar Email de Parabéns
                    </EmailLink>
                    {aniversariantes.map((aniversariante, index) => {
                        const telefoneWhatsapp = formatarTelefoneWhatsapp(aniversariante.telefone);
                        if (!telefoneWhatsapp) return null;
                        const mensagem = encodeURIComponent(`Feliz aniversário, ${aniversariante.nome}!`);
                        const rotulo = aniversariantes.length > 1
                            ? `WhatsApp para ${aniversariante.nome}`
                            : 'Enviar WhatsApp';
                        return (
                            <WhatsappLink
                                key={index}
                                href={`https://wa.me/${telefoneWhatsapp}?text=${mensagem}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FaWhatsapp size={18} /> {rotulo}
                            </WhatsappLink>
                        );
                    })}
                </Actions>
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
  background-color: rgba(0, 10, 40, 0.55);
  backdrop-filter: blur(3px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const Modal = styled.div`
  box-sizing: border-box;

  &, & *, & *::before, & *::after {
    box-sizing: border-box;
  }

  background-color: white;
  position: relative;
  z-index: 20;
  width: 440px;
  max-width: 90vw;
  padding: 48px 36px 36px;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #001143;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
  animation: pop 0.3s ease;

  @keyframes pop {
    from {
      opacity: 0;
      transform: scale(0.92);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const PositionedCloseButton = styled(CloseIconButton)`
  position: absolute;
  top: 16px;
  right: 16px;
`;

const IconBadge = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #eef3ff, #dde7ff);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin-bottom: 16px;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 800;
  color: #001143;
  margin-bottom: 6px;
  text-align: center;
  line-height: 1.4;
`;

const Message = styled.p`
  font-size: 15px;
  color: #6b7490;
  text-align: center;
  line-height: 1.5;
`;

const NamesList = styled.div`
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
`;

const NameChip = styled.div`
  font-size: 14px;
  color: #205fdd;
  font-weight: 700;
  text-align: center;
  background: #eef3ff;
  padding: 6px 14px;
  border-radius: 999px;
`;

const Actions = styled.div`
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const BaseActionLink = `
  padding: 13px 20px;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  text-align: center;

  &:hover {
    transform: translateY(-2px);
    color: white;
    text-decoration: none;
  }

  &:active {
    transform: translateY(0);
  }
`;

const WhatsappLink = styled.a`
  ${BaseActionLink}
  background: linear-gradient(to right, #25D366, #128C7E);
  box-shadow: 0 4px 14px rgba(37, 211, 102, 0.35);

  &:hover {
    box-shadow: 0 6px 18px rgba(37, 211, 102, 0.45);
  }
`;

const EmailLink = styled.a`
  ${BaseActionLink}
  background: linear-gradient(to right, #205fdd, #001143);
  box-shadow: 0 4px 14px rgba(32, 95, 221, 0.35);

  &:hover {
    box-shadow: 0 6px 18px rgba(32, 95, 221, 0.45);
  }
`;
