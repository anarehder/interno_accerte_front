import { useEffect, useState } from "react";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import apiService from "../services/apiService";
import HeaderNewComponent from "../components/basic/HeaderNewComponent";
import { HiOutlineMail, HiOutlineMailOpen, HiOutlineZoomIn, HiOutlineX } from "react-icons/hi";

const formatarDataBR = (dataIso) => {
    if (!dataIso) return null;
    const data = new Date(dataIso);
    const [ano, mes, dia] = data.toISOString().slice(0, 10).split("-");
    return `${dia}/${mes}/${ano}`;
};

const ComunicadosPage = () => {
    const { user } = useAuth();
    const [comunicados, setComunicados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updated, setUpdated] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [imagemAmpliada, setImagemAmpliada] = useState(null);

    useEffect(() => {
        if (!user) return;
        const fetchComunicados = async () => {
            setLoading(true);
            try {
                const body = { email: user.mail };
                const response = await apiService.buscarComunicadosEmail(body);
                const comunicadosFiltrados = response.data.filter((c) => c.tipo === "Geral");
                setComunicados(comunicadosFiltrados);
                setUpdated(false);
            } catch (error) {
                console.error("Erro ao buscar comunicados:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchComunicados();
    }, [updated, user]);

    useEffect(() => {
        if (comunicados.length === 0) {
            setSelectedId(null);
            return;
        }
        if (!comunicados.some((c) => c.id === selectedId)) {
            setSelectedId(comunicados[0].id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [comunicados.length]);

    const selecionado = comunicados.find((c) => c.id === selectedId) || null;

    const leituraComunicado = async (id) => {
        try {
            const body = { email: user.mail, comunicadoId: id };
            const response = await apiService.confirmarLeituraComunicado(body);
            if (response.status = 200) {
                setUpdated(true);
            }
        } catch (error) {
            console.error("Erro ao buscar informacoes vagas:", error);
            return;
        }
    };

    const abrirImagemAmpliada = (e, url) => {
        e.preventDefault();
        e.stopPropagation();
        setImagemAmpliada(url);
    };

    return (
        <PageContainer>
            <HeaderNewComponent pageTitle={"Comunicados"} />

            <ExplorerContainer>
                <ListPanel>
                    {loading && <EmptyState>Carregando...</EmptyState>}
                    {!loading && comunicados.length === 0 && (
                        <EmptyState>Nenhum comunicado encontrado.</EmptyState>
                    )}
                    {!loading && comunicados.map((comunicado) => {
                        const lido = comunicado.LeituraComunicados?.[0]?.confLeitura === true;
                        return (
                            <ListItem
                                key={comunicado.id}
                                $active={comunicado.id === selectedId}
                                onClick={() => setSelectedId(comunicado.id)}
                            >
                                <MailIcon>
                                    {lido ? <HiOutlineMailOpen size={26} /> : <HiOutlineMail size={26} />}
                                </MailIcon>
                                <ListItemInfo>
                                    <ListItemTitle $unread={!lido}>{comunicado.titulo}</ListItemTitle>
                                    <ListItemMeta>
                                        <span>{formatarDataBR(comunicado.dataDivulgacao)}</span>
                                    </ListItemMeta>
                                </ListItemInfo>
                            </ListItem>
                        );
                    })}
                </ListPanel>

                <PreviewPanel>
                    {selecionado ? (
                        <>
                            <ImageWrapper>
                                {(selecionado?.linkExterno && selecionado?.linkExterno !== "-") ? (
                                    <a href={selecionado.linkExterno} target="_blank" rel="noreferrer">
                                        <PreviewImage src={selecionado.imagemUrl} alt={selecionado.titulo} />
                                    </a>
                                ) : (
                                    <PreviewImage src={selecionado.imagemUrl} alt={selecionado.titulo} />
                                )}
                                <ZoomButton
                                    type="button"
                                    title="Ampliar imagem"
                                    onClick={(e) => abrirImagemAmpliada(e, selecionado.imagemUrl)}
                                >
                                    <HiOutlineZoomIn size={26} />
                                </ZoomButton>
                            </ImageWrapper>
                            <PreviewTitle>{selecionado.titulo}</PreviewTitle>
                            <PreviewDetails>
                                <div><strong>Data Divulgação:&nbsp;</strong>{formatarDataBR(selecionado.dataDivulgacao)}</div>
                                {selecionado.linkExterno && selecionado.linkExterno !== "-" && (
                                    <div>
                                        <a href={selecionado.linkExterno} target="_blank" rel="noreferrer">
                                            Abrir link externo
                                        </a>
                                    </div>
                                )}
                                {selecionado.legenda?.length > 3 && <div>{selecionado.legenda}</div>}
                            </PreviewDetails>
                            <ConfirmButton
                                onClick={() => leituraComunicado(selecionado.id)}
                                disabled={selecionado.LeituraComunicados?.[0]?.confLeitura === true}
                            >
                                {selecionado.LeituraComunicados?.[0]?.confLeitura === true ? "Lido" : "Confirmar Leitura"}
                            </ConfirmButton>
                        </>
                    ) : (
                        <EmptyState>Selecione um comunicado na lista.</EmptyState>
                    )}
                </PreviewPanel>
            </ExplorerContainer>

            {imagemAmpliada && (
                <ModalOverlay onClick={() => setImagemAmpliada(null)}>
                    <ModalCloseButton
                        type="button"
                        title="Fechar"
                        onClick={() => setImagemAmpliada(null)}
                    >
                        <HiOutlineX size={28} />
                    </ModalCloseButton>
                    <ModalImage
                        src={imagemAmpliada}
                        alt="Imagem ampliada"
                        onClick={(e) => e.stopPropagation()}
                    />
                </ModalOverlay>
            )}
        </PageContainer>
    );
};

export default ComunicadosPage;

const PageContainer = styled.div`
    width: 100%;
    min-height: 100%;
    flex-direction: column;
    align-items: center;
    position: absolute;
    gap: 20px;
    color: rgb(75, 74, 75);
`;

const ExplorerContainer = styled.div`
    width: 90%;
    max-width: 1200px;
    height: 650px;
    margin: 30px 0 40px 0;
    border: 1px solid #9ca3af;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 4px 4px 8px 4px rgba(0, 0, 0, 0.15);
`;

const ListPanel = styled.div`
    width: 55%;
    height: 100%;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
    border-right: 1px solid #d1d5db;
    background-color: white;
    box-sizing: border-box;
`;

const ListItem = styled.div`
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    cursor: pointer;
    border-bottom: 1px solid #e5e7eb;
    box-sizing: border-box;
    background-color: ${({ $active }) => ($active ? "#dbe4ff" : "white")};

    &:hover {
        background-color: ${({ $active }) => ($active ? "#dbe4ff" : "#f3f4f6")};
    }
`;

const MailIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    color: #495f96;
`;

const ListItemInfo = styled.div`
    flex-direction: column;
    gap: 6px;
    overflow: hidden;
`;

const ListItemTitle = styled.div`
    font-size: 15px;
    line-height: 1.4;
    padding-bottom: 2px;
    font-weight: ${({ $unread }) => ($unread ? 700 : 600)};
    color: #1f2937;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const ListItemMeta = styled.div`
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #6b7280;
`;

const PreviewPanel = styled.div`
    width: 45%;
    height: 100%;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    gap: 12px;
    background-color: #f9fafb;
    overflow-y: auto;
    overflow-x: hidden;
    box-sizing: border-box;
`;

const ImageWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 390px;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    border: 1px solid #d1d5db;
    background-color: white;
    overflow: hidden;

    a {
        display: flex;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
    }
`;

const PreviewImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
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

const PreviewTitle = styled.div`
    font-size: 18px;
    font-weight: 700;
    color: #1f2937;
    text-align: center;
`;

const PreviewDetails = styled.div`
    flex-direction: column;
    gap: 8px;
    font-size: 14px;
    color: #374151;
    width: 100%;

    a {
        color: #003289;
        font-weight: 600;
    }
`;

const ConfirmButton = styled.button`
    background: linear-gradient(to right,#205fdd, #001143);
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    font-size: 15px;
    cursor: pointer;

    &:disabled {
        background: #9ca3af;
        color: white;
        cursor: not-allowed;
    }
`;

const EmptyState = styled.div`
    padding: 20px;
    color: #6b7280;
    font-size: 14px;
    text-align: center;
    width: 100%;
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
`;
