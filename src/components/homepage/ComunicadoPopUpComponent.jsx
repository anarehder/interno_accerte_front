import styled, { keyframes } from 'styled-components';
import { useEffect, useRef, useState } from "react";
import { HiOutlineX, HiOutlineCheckCircle } from "react-icons/hi";
import apiService from '../../services/apiService';
import { useAuth } from '../../contexts/AuthContext';

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

function ComunicadoPopUpComponent({setUpdated}) {
    const { user, carregando } = useAuth();
    const [closed, setClosed] = useState(false);
    const [comunicado, setComunicado] = useState(null);
    const [leitura, setLeitura] = useState(false);
    const [buscando, setBuscando] = useState(true);
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [arrastando, setArrastando] = useState(false);
    const arrastoAreaRef = useRef(null);
    const arrastoRef = useRef({ x: 0, y: 0 });
    const moveuRef = useRef(false);
  // console.log(comunicado)
    useEffect(() => {
        const fetchScale = async () => {
            try {
                const body = {email: user.mail};
                const response = await apiService.buscarComunicadosHoje(body);
                setComunicado(response.data[0]);
                setBuscando(false);
                if(response.data[0].LeituraComunicados[0].confLeitura === true){
                    setLeitura(true);
                }
            } catch (error) {
                console.error("Erro ao buscar informacoes vagas:", error);
                setBuscando(false);
                return;
            }
        };

        fetchScale();

    }, [carregando, user]);

    useEffect(() => {
        setZoom(1);
        setPan({ x: 0, y: 0 });
    }, [comunicado?.id]);

    useEffect(() => {
        const el = arrastoAreaRef.current;
        if (!el) return undefined;

        const handleWheel = (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.2 : 0.2;
            setZoom((prev) => {
                const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, +(prev + delta).toFixed(2)));
                if (next === MIN_ZOOM) setPan({ x: 0, y: 0 });
                return next;
            });
        };

        el.addEventListener("wheel", handleWheel, { passive: false });
        return () => el.removeEventListener("wheel", handleWheel);
    }, [comunicado?.id]);

    const fecharPopup = () => {
        setClosed(true);
    };

    const leituraPopup = async () => {
        try {
            const body = { email: user.mail, comunicadoId: comunicado.id };
      const response = await apiService.confirmarLeituraComunicado(body);
      if (response.status = 200) {
        setClosed(true);
        setUpdated(true);
      }
    } catch (error) {
      console.error("Erro ao buscar informacoes vagas:", error);
      return;
    }
  };

  const handlePointerDown = (e) => {
    e.preventDefault();
    if (zoom <= MIN_ZOOM) return;
    setArrastando(true);
    moveuRef.current = false;
    arrastoRef.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!arrastando) return;
    const deltaX = e.clientX - arrastoRef.current.x;
    const deltaY = e.clientY - arrastoRef.current.y;
    if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) moveuRef.current = true;
    arrastoRef.current = { x: e.clientX, y: e.clientY };
    setPan((prev) => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
  };

  const handlePointerUp = (e) => {
    setArrastando(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const handleLinkClick = (e) => {
    if (moveuRef.current) {
      e.preventDefault();
      moveuRef.current = false;
    }
  };

  if (closed || leitura) return null;
  if (buscando) return null;

  const temLegenda = comunicado?.legenda && comunicado.legenda.length > 2;
  const linkExterno = (comunicado?.linkExterno && comunicado?.linkExterno !== '-') ? comunicado.linkExterno : undefined;

  return (
    <Overlay>
      <Modal>
        <CloseButton onClick={fecharPopup} title="Fechar">
          <HiOutlineX size={30} />
        </CloseButton>

        <ImagemLado>
          <AreaArraste
            ref={arrastoAreaRef}
            href={linkExterno}
            target="_blank"
            rel="noreferrer"
            onClick={handleLinkClick}
            $zoom={zoom}
            $arrastando={arrastando}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            <Imagem
              src={comunicado?.imagemUrl}
              alt={comunicado?.titulo || "Mensagem"}
              $zoom={zoom}
              $pan={pan}
              $arrastando={arrastando}
              draggable={false}
            />
          </AreaArraste>
        </ImagemLado>

        <InfoLado $centralizado={!temLegenda}>
          <Titulo>{comunicado?.titulo}</Titulo>

          {temLegenda && (
            <Legenda>
              {comunicado.legenda.split('\n').map((linha, index) => (
                <p key={index}>{linha}</p>
              ))}
            </Legenda>
          )}

          <ConfirmarButton onClick={leituraPopup}>
            <HiOutlineCheckCircle size={22} />
            Confirmar Leitura
          </ConfirmarButton>
        </InfoLado>
      </Modal>
    </Overlay>
  )
}

export default ComunicadoPopUpComponent;

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 6, 30, 0.65);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9;
`;

const Modal = styled.div`
  position: relative;
  width: 80%;
  max-width: 980px;
  height: 78vh;
  max-height: 620px;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 8, 40, 0.45);
  overflow: hidden;
  animation: ${fadeIn} 0.25s ease-out;
`;

const ImagemLado = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 58%;
  height: 100%;
  background-color: #0a0f28;
  align-items: center;
  justify-content: center;
  padding: 24px;
  box-sizing: border-box;
  overflow: hidden;
  user-select: none;
  -webkit-user-select: none;
`;

const AreaArraste = styled.a`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  touch-action: none;
  cursor: ${({ $zoom, $arrastando }) => {
    if (!$zoom || $zoom <= MIN_ZOOM) return "zoom-in";
    return $arrastando ? "grabbing" : "grab";
  }};
`;

const Imagem = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
  transform: ${({ $zoom, $pan }) => `translate(${$pan?.x || 0}px, ${$pan?.y || 0}px) scale(${$zoom || 1})`};
  transition: ${({ $arrastando }) => ($arrastando ? "none" : "transform 0.08s ease-out")};
  pointer-events: none;
`;

const InfoLado = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 42%;
  height: 100%;
  flex-direction: column;
  justify-content: ${({ $centralizado }) => ($centralizado ? 'center' : 'flex-start')};
  align-items: ${({ $centralizado }) => ($centralizado ? 'center' : 'stretch')};
  text-align: ${({ $centralizado }) => ($centralizado ? 'center' : 'left')};
  gap: 18px;
  padding: 40px 32px;
  box-sizing: border-box;
`;

const Titulo = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  line-height: 1.25;
  color: #001143;
`;

const Legenda = styled.div`
  flex: 1;
  overflow-y: auto;
  color: #4b4a4b;
  font-size: 15px;
  line-height: 24px;
  padding-right: 4px;

  p {
    margin: 0 0 10px 0;
  }
`;

const ConfirmarButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 14px 22px;
  border: none;
  border-radius: 999px;
  font-size: 16px;
  font-weight: 700;
  color: white;
  cursor: pointer;
  background: linear-gradient(135deg, #2e7cf6, #001143);
  box-shadow: 0 8px 20px rgba(32, 95, 221, 0.4);
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 12px 26px rgba(32, 95, 221, 0.5);
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.85);
  color: #001143;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  transition: background-color 0.15s ease, transform 0.15s ease, color 0.15s ease;

  &:hover {
    background-color: #001143;
    color: white;
    transform: rotate(90deg);
  }
`;
