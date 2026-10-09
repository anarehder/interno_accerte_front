import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';
import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { toPng } from "html-to-image";
import download from "downloadjs";
import EditScaleComponent from '../components/EditScaleComponent';
import EditEscalaPadraoComponent from '../components/EditEscalaPadraoComponent';
import ModalComponent from '../components/ModalComponent';
import { FiEdit3, FiCalendar, FiSearch, FiX, FiDownload } from 'react-icons/fi';

function normalizeText(str) {
    return (str || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

function ScaleTableComponent({type}) {
    const imageRef = useRef(null);
    const { user, dados } = useAuth();
    const [scale, setScale] = useState("");
    const [selectedScale, setSelectedScale] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedButton, setSelectedButton] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editScale, setEditScale] = useState(false);
    const [scaleToEdit, setScaleToEdit] = useState(null);
    const [updatedScale, setUpdatedScale] = useState(false);
    const [areas, setAreas] = useState([]);
    const [editEscalaPadrao, setEditEscalaPadrao] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const cores = { "Home": "blue", "Home - Manhã ": "blue", "Home - Tarde": "blue", "Presencial - GYN": "green", "Presencial - BSB": "green","Presencial": "green", "Férias - CLT": "orange", "Recesso - Estágio": "orange", "Feriado": "#f94860", "Pausa - PJ": "orange", "Folga": "purple", "Banco de Horas": "purple", "Plantão": "gray", "Trabalho Remoto": "black", "Trabalho Externo": "black", "Viagem": "#fc7e00", "Licença Maternidade": "#f94860", "Licença Paternidade": "#f94860", "Day OFF":"purple", "Outros": "black" };

    useEffect(() => {
        if (!dados) return;
        const fetchScale = async () => {
            try {
                const response = await apiService.getEscala();
                const response2 = await apiService.buscarAreas();
                setScale(response.data);
                const areaFormatada = response2.data
                    .filter(item => item.area !== "Admin-Intranet")
                    .sort((a, b) => {
                        if (a.area === "Presidência") return -1; // vai pro topo
                        if (b.area === "Presidência") return 1;
                        return 0;
                    });
                setAreas(areaFormatada);
                setLoading(false);

                if(updatedScale && selectedButton){
                    handleSelect(response.data[selectedButton][0], selectedButton);
                    setUpdatedScale(false);
                }
            } catch (error) {
                console.error("Erro ao buscar a escala:", error);
                setLoading(false);
            }

        };

        fetchScale();
    
    }, [updatedScale, dados]);

    const handleSelect = (escalas, tipo) => {
        
        setSelectedScale(escalas.Escalas);
        const date = `${formatarDataBR(escalas.inicioSemana)} a ${formatarDataBR(escalas.fimSemana)}`;
        setSelectedDate(date);
        if(type !== 'admin'){
            const toEdit =  escalas.Escalas.find(f => f.Funcionarios.email === user.mail);
            setScaleToEdit(toEdit);
        }
        setSelectedButton(tipo);
    };

    function formatarDataBR(dataIso) {
        const data = new Date(dataIso);
        const [ano, mes, dia] = data.toISOString().slice(0, 10).split("-");
        return `${dia}/${mes}/${ano}`;
    }

    const normalizedSearch = normalizeText(searchTerm);
    const matchedScale = normalizedSearch
        ? selectedScale.filter((item) =>
            normalizeText(`${item.Funcionarios.nome} ${item.Funcionarios.sobrenome}`).includes(normalizedSearch)
          )
        : selectedScale;

    const handleDownload = () => {
        if (imageRef.current) {
            toPng(imageRef.current, { quality: 1 })
                .then((dataUrl) => {
                    download(dataUrl, `escala_${selectedDate}.png`, "image/png");
                })
                .catch((error) => {
                    console.error("Erro ao gerar a imagem:", error);
                });
        }
    };

    return (
        <PageContainer>
            <HeaderPanel>
                <ToolbarRow>
                    <ToolbarActions>
                        {/* {type !== 'admin' &&
                            <ActionButton $ativo={editEscalaPadrao} onClick={()=> setEditEscalaPadrao(true)} ><FiCalendar size={18} /> Escala Padrão</ActionButton>
                        } */}
                        {type !== 'admin' && selectedScale.length > 0 &&
                            <ActionButton $ativo={editScale} onClick={()=> setEditScale(true)} ><FiEdit3 size={18} /> Editar Minha Escala</ActionButton>
                        }
                    </ToolbarActions>
                    {selectedScale.length > 0 &&
                        <DownloadButton onClick={handleDownload}>
                            <FiDownload size={16} /> Baixar Escala Como Imagem
                        </DownloadButton>
                    }
                </ToolbarRow>
                {dados && scale &&
                    <ScaleSelectRow>
                        <ScaleSelectGroup>
                            <ScaleSelectLabel>Selecione uma escala:</ScaleSelectLabel>
                            <ScaleButtonsRow>
                                <Button onClick={() => handleSelect(scale.atual[0], "atual")} $selecionado={selectedButton === "atual" ? 'show' : undefined}>{formatarDataBR(scale.atual[0].inicioSemana)} a {formatarDataBR(scale.atual[0].fimSemana)} </Button>
                                {scale.proxima &&
                                    <Button onClick={() => handleSelect(scale.proxima[0], "proximo")} $selecionado={selectedButton === "proximo" ? 'show' : undefined}>{formatarDataBR(scale.proxima[0].inicioSemana)} a {formatarDataBR(scale.proxima[0].fimSemana)} </Button>
                                }
                            </ScaleButtonsRow>
                        </ScaleSelectGroup>
                        {selectedScale.length > 0 &&
                            <SearchBar>
                                <FiSearch size={18} />
                                <SearchInput
                                    type="text"
                                    placeholder="Buscar por nome ou sobrenome..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {searchTerm &&
                                    <ClearSearchButton type="button" onClick={() => setSearchTerm("")} aria-label="Limpar busca">
                                        <FiX size={16} />
                                    </ClearSearchButton>
                                }
                            </SearchBar>
                        }
                    </ScaleSelectRow>
                }
            </HeaderPanel>
            {editScale &&
                <ModalComponent onFechar={() => setEditScale(false)}>
                    < EditScaleComponent scale={scaleToEdit} opcoes={Object.keys(cores).filter(key => key !== "Presencial").sort()} setUpdatedScale={setUpdatedScale} setEditScale={setEditScale} editScale={editScale}/>
                </ModalComponent>
            }
            {editEscalaPadrao &&
                <ModalComponent onFechar={() => setEditEscalaPadrao(false)}>
                    < EditEscalaPadraoComponent onClose={() => setEditEscalaPadrao(false)} />
                </ModalComponent>
            }
            {loading && <h2> Carregando escala...</h2>}
            <ImageContainer ref={imageRef}>
                {selectedScale.length > 0 &&
                 <DepartmentContainer>
                    <h2>Escala Semanal {selectedDate}</h2>
                    <WeekHeader $cor={'#F94860'}>
                        <Day>Nome</Day>
                        <Day >Segunda</Day>
                        <Day >Terça</Day>
                        <Day >Quarta</Day>
                        <Day >Quinta</Day>
                        <Day >Sexta</Day>
                        {type === 'admin' && <EditAdminScaleButton disabled={true} style={{ cursor: "default" }} > Ação</EditAdminScaleButton>}
                    </WeekHeader>
                </DepartmentContainer>}
            {selectedScale.length > 0 && normalizedSearch && matchedScale.length === 0 &&
                <NoResults>Nenhum funcionário encontrado para &ldquo;{searchTerm}&rdquo;.</NoResults>
            }
            {matchedScale.length > 0 && areas.map((a) => {
                const scaleBySector = matchedScale.filter(item => item.Funcionarios.Areas.area === a.area);

                // Não renderizar a área se não houver funcionários
                if (scaleBySector.length === 0) return null;
                
                return (
                    <DepartmentContainer key={a.area}>
                        <Title>
                            <h3>{a.area}</h3>
                        </Title>
                        
                        {scaleBySector.map((scale, index) => (
                            <Week key={index}>
                                <Day data-label="Nome">{scale.Funcionarios.nome} {scale.Funcionarios.sobrenome}</Day>
                                <Day data-label="Segunda" $cor={cores[scale.segunda]}>{scale.segunda}</Day>
                                <Day data-label="Terça" $cor={cores[scale.terca]}>{scale.terca}</Day>
                                <Day data-label="Quarta" $cor={cores[scale.quarta]}>{scale.quarta}</Day>
                                <Day data-label="Quinta" $cor={cores[scale.quinta]}>{scale.quinta}</Day>
                                <Day data-label="Sexta" $cor={cores[scale.sexta]}>{scale.sexta}</Day>
                                {type === 'admin' && <EditAdminScaleButton onClick={() => {setScaleToEdit(scale); setEditScale(true)}}>Editar</EditAdminScaleButton>}
                            </Week>
                        ))}
                    </DepartmentContainer>
                );
            })}
            </ImageContainer>
        </PageContainer>
    )
}

export default ScaleTableComponent;

const PageContainer = styled.div`
    width: 100%;
    height: 100%;
    min-height: 100vh;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin-bottom: 35px;
    position: relative;
    background-color: #FFFFFF;
`

const Button = styled.button`
    background-color: ${({ $selecionado }) => ($selecionado === 'show'  ?  "#F94860 !important" : "white !important")};
    border: 1.5px solid #ED1F4C;
    color: ${({ $selecionado }) => ($selecionado === 'show' ? "#fff" : "#ED1F4C")};
    height: 44px;
    min-width: 190px;
    border-radius: 50px;
    padding: 0 22px;
    font-size: 15px;
    font-weight: 600;
    justify-content: center;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
    transition: box-shadow .15s ease, transform .15s ease;
    &:hover {
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        transform: translateY(-1px);
    }
    &:nth-of-type(n + 3) {
  background-color: black;
}
`


const EditAdminScaleButton = styled.button`
    background-color: ${({ selecionado }) => (selecionado === 'show'  ?  "#F94860 !important" : "white !important")};
    border: 2px solid #ED1F4C;
    color: ${({ selecionado }) => (selecionado === 'show' ? "#fff" : "#ED1F4C")};
    max-height: 40px;
    width: 80px;
    font-size: 15px;
    justify-content: center;
    @media (max-width: 768px) {
        width: calc(100% - 32px);
        max-height: none;
        margin: 10px 16px 14px;
    }
`

const HeaderPanel = styled.div`
    width: calc(85% - 56px);
    flex-direction: column;
    gap: 18px;
    margin: 24px 0 0;
    padding: 22px 28px;
    background-color: #FBFBFC;
    border: 1px solid #ECECEF;
    border-radius: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
    @media (max-width: 900px) {
        padding: 18px;
    }
`

const ToolbarRow = styled.div`
    width: 100%;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    @media (max-width: 900px) {
        justify-content: center;
    }
`

const ToolbarActions = styled.div`
    width: auto;
    gap: 12px;
    flex-wrap: wrap;
    @media (max-width: 900px) {
        justify-content: center;
    }
`

const ScaleSelectRow = styled.div`
    width: 100%;
    flex-wrap: wrap;
    align-items: center;
    gap: 16px;
    padding-top: 18px;
    border-top: 1px solid #ECECEF;
    @media (max-width: 900px) {
        justify-content: center;
        text-align: center;
    }
`

const ScaleSelectGroup = styled.div`
    width: auto;
    flex-wrap: wrap;
    align-items: center;
    gap: 16px;
    @media (max-width: 900px) {
        justify-content: center;
    }
`

const ScaleSelectLabel = styled.span`
    font-size: 16px;
    font-weight: 500;
    color: #021121;
    white-space: nowrap;
`

const ScaleButtonsRow = styled.div`
    width: auto;
    gap: 12px;
    flex-wrap: wrap;
    align-items: center;
`

const ActionButton = styled.button`
    background-color: ${({ $ativo }) => ($ativo ? "#F94860" : "#ffffff")};
    border: 1.5px solid #F94860;
    color: ${({ $ativo }) => ($ativo ? "white" : "#F94860")};
    border-radius: 50px;
    height: 44px;
    padding: 0 20px;
    gap: 8px;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    font-weight: 600;
    white-space: nowrap;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
    transition: background-color .15s ease, color .15s ease, box-shadow .15s ease, transform .15s ease;
    &:hover {
        background-color: ${({ $ativo }) => ($ativo ? "#d8374c" : "#fdeef0")};
        color: ${({ $ativo }) => ($ativo ? "white" : "#F94860")};
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        transform: translateY(-1px);
    }
`

const SearchBar = styled.div`
    flex: 1;
    min-width: 220px;
    max-width: 380px;
    margin-left: auto;
    align-items: center;
    gap: 10px;
    background-color: #F7F7F9;
    border: 1.5px solid #E6E6EA;
    border-radius: 50px;
    padding: 0 16px;
    height: 44px;
    color: #9A9AA5;
    transition: border-color .15s ease, box-shadow .15s ease;
    &:focus-within {
        border-color: #F94860;
        box-shadow: 0 0 0 3px rgba(249, 72, 96, 0.12);
    }
    @media (max-width: 900px) {
        margin-left: 0;
        max-width: 100%;
    }
`

const SearchInput = styled.input`
    flex: 1;
    font-size: 15px;
    font-weight: 400;
    color: #021121;
    &::placeholder {
        color: #9A9AA5;
        font-weight: 400;
    }
`

const ClearSearchButton = styled.button`
    width: 24px;
    height: 24px;
    min-height: 0;
    padding: 0;
    border-radius: 50%;
    background-color: transparent;
    border: none;
    color: #9A9AA5;
    align-items: center;
    justify-content: center;
    box-shadow: none;
    &:hover {
        background-color: #ECECEF;
        color: #F94860;
    }
`

const NoResults = styled.p`
    width: 100%;
    color: #9A9AA5;
    font-size: 16px;
    font-weight: 500;
    padding: 30px 0;
    justify-content: center;
`

const DownloadButton = styled.button`
    width: auto;
    height: 44px;
    border-radius: 50px;
    padding: 0 20px;
    gap: 8px;
    align-items: center;
    justify-content: center;
    background-color: #ED1F4C;
    cursor: pointer;
    color: white;
    border: 1.5px solid #F94860;
    font-size: 15px;
    font-weight: 600;
    white-space: nowrap;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    transition: background-color .15s ease, color .15s ease, box-shadow .15s ease, transform .15s ease;
    &:hover {
        background-color: white;
        color: #F94860;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
        transform: translateY(-1px);
    }
`

const ImageContainer = styled.div`
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-height: 100vh;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 25px 0;
    background-color: #FFFFFF;
`;

const DepartmentContainer = styled.div`
    flex-direction: column;
    width: 85%;
    gap: 14px;
    h2 {
        margin: 0 0 10px 0;
    }
`

const Title = styled.div`
    background-color: #FD413E;
    border: 1px solid #FD413E;
    color: white;
    justify-content: center;
    border-radius: 50px;
    gap: 5px;
    padding: 7px 0;
`

const Week = styled.div`
    align-items: center;
    border-radius: 125px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 2px;
    @media (max-width: 768px) {
        flex-direction: column;
        align-items: stretch;
        border-radius: 16px;
        padding: 0;
        background-color: #FFFFFF;
        overflow: hidden;
    }
`

const WeekHeader = styled(Week)`
    @media (max-width: 768px) {
        display: none;
    }
`

const Day = styled.div`
    padding: 7px 2px;
    color: ${({ $cor }) => $cor};
    width: 15%;
    min-height: 35px;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-weight:500;
    font-size: 16px;
        &:nth-of-type(1) {
            width: 25%;
            padding: 7px;
        }

    @media (max-width: 768px) {
        width: 100%;
        min-height: auto;
        justify-content: flex-start;
        text-align: left;
        font-size: 15px;
        padding: 10px 16px;
        border-bottom: 1px solid #F2F2F4;

        &::before {
            content: attr(data-label) ":";
            font-weight: 600;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: .4px;
            color: #9A9AA5;
            margin-right: 8px;
        }

        &:last-of-type {
            border-bottom: none;
        }

        &:nth-of-type(1) {
            width: 100%;
            padding: 14px 16px 10px;
            font-size: 17px;
            font-weight: 700;
            color: #021121;
            border-bottom: 1px solid #F2F2F4;

            &::before {
                content: none;
            }
        }
    }
`