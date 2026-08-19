import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import apiServiceBucket from "../services/apiServiceBucket";
import HeaderGGNewComponent from "../components/gentegestao/HeaderGGNewComponent";
import { HiOutlineZoomIn, HiOutlineX } from "react-icons/hi";

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

const CalendarPage = () => {
    const { user } = useAuth();
    const [calendarios, setCalendarios] = useState([]);
    const [imagemAmpliada, setImagemAmpliada] = useState(null);
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [arrastando, setArrastando] = useState(false);
    const modalImageRef = useRef(null);
    const arrastoRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (!user) return;
        const fetchCalendarios = async () => {
            const body = { email: user.mail };
            try {
                const response = await apiServiceBucket.buscarArquivosCloudPorGrupo("Calendário", body);
                setCalendarios(response.data || []);
            } catch (error) {
                console.error("Erro ao buscar calendários:", error);
            }
        };
        fetchCalendarios();
    }, [user]);

    useEffect(() => {
        setZoom(1);
        setPan({ x: 0, y: 0 });
        if (!imagemAmpliada) return undefined;

        const el = modalImageRef.current;
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
    }, [imagemAmpliada]);

    const abrirImagemAmpliada = (url) => {
        setImagemAmpliada(url);
    };

    const fecharImagemAmpliada = () => {
        setImagemAmpliada(null);
    };

    const handlePointerDown = (e) => {
        if (zoom <= MIN_ZOOM) return;
        setArrastando(true);
        arrastoRef.current = { x: e.clientX, y: e.clientY };
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e) => {
        if (!arrastando) return;
        const deltaX = e.clientX - arrastoRef.current.x;
        const deltaY = e.clientY - arrastoRef.current.y;
        arrastoRef.current = { x: e.clientX, y: e.clientY };
        setPan((prev) => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
    };

    const handlePointerUp = (e) => {
        setArrastando(false);
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }
    };

    return (
        <Container>
            <HeaderGGNewComponent  pageTitle={`Calendários`} />
            <List>
                {calendarios.map((file, index) => (
                    <CardWrapper key={file.uniqueid ?? index}>
                        <ImageWrapper>
                            <Image src={file.arquivo} alt={file.descricao} />
                            <ZoomButton
                                type="button"
                                title="Ampliar imagem"
                                onClick={() => abrirImagemAmpliada(file.arquivo)}
                            >
                                <HiOutlineZoomIn size={26} />
                            </ZoomButton>
                        </ImageWrapper>
                    </CardWrapper>
                ))}
            </List>

            {imagemAmpliada && (
                <ModalOverlay onClick={fecharImagemAmpliada}>
                    <ModalCloseButton
                        type="button"
                        title="Fechar"
                        onClick={fecharImagemAmpliada}
                    >
                        <HiOutlineX size={28} />
                    </ModalCloseButton>
                    <ModalImage
                        ref={modalImageRef}
                        src={imagemAmpliada}
                        alt="Imagem ampliada"
                        $zoom={zoom}
                        $pan={pan}
                        $arrastando={arrastando}
                        onClick={(e) => e.stopPropagation()}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerLeave={handlePointerUp}
                        draggable={false}
                    />
                </ModalOverlay>
            )}
        </Container>
    );
};

export default CalendarPage;

const Container = styled.div`
    flex-direction: column;
    border-radius: 8px;
    align-items: center;
    min-height: 100vh;
    color: black;
`;

const List = styled.div`
    display: flex;
    gap: 40px;
    width: 90%;
    margin-top: 30px;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 20px;
`;

const CardWrapper = styled.div`
    flex-direction: column;
    width: 500px;
    height: 700px;
    align-items: center;
`;

const ImageWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
`;

const Image = styled.img`
    height: 100%;
    width: auto;
    max-width: 100%;
    object-fit: contain;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const ZoomButton = styled.button`
    position: absolute;
    top: 14px;
    right: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border: none;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);

    &:hover {
        background-color: rgba(0, 0, 0, 0.85);
    }
`;

const ModalOverlay = styled.div`
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.85);
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const ModalCloseButton = styled.button`
    position: fixed;
    top: 24px;
    right: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border: none;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.15);
    color: white;
    cursor: pointer;
    z-index: 1001;

    &:hover {
        background-color: rgba(255, 255, 255, 0.3);
    }
`;

const ModalImage = styled.img`
    max-width: 90vw;
    max-height: 90vh;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    transform: ${({ $zoom, $pan }) => `translate(${$pan.x}px, ${$pan.y}px) scale(${$zoom})`};
    transition: ${({ $arrastando }) => ($arrastando ? "none" : "transform 0.08s ease-out")};
    touch-action: none;
    cursor: ${({ $zoom, $arrastando }) => {
        if ($zoom <= MIN_ZOOM) return "zoom-in";
        return $arrastando ? "grabbing" : "grab";
    }};
`;
