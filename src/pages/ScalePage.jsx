import styled from 'styled-components';
import HeaderGGComponent from '../components/HeaderGGComponent';
import { useAuth } from '../contexts/AuthContext';
import { Link } from "react-router-dom";
import apiService from '../services/apiService';
import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { toPng } from "html-to-image";
import download from "downloadjs";

function ScalePage() {
    const imageRef = useRef(null);
    const { user, dados } = useAuth();
    const [scale, setScale] = useState("");
    const [selectedScale, setSelectedScale] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedButton, setSelectedButton] = useState(null);
    const [loading, setLoading] = useState(true);
    const setores = ["Diretoria", "Administrativo", "Arquitetura de Soluções", "Comercial Público", "Comercial Privado", "Financeiro", "Gente e Gestão", "Governança de Dados", "Jurídico", 'Marketing', "Tecnologia da Informação"];
    const cores = { "Home": "blue", "Presencial": "green", "Férias - CLT": "pink", "Pausa - PJ": "orange", "Folga": "purple", "Banco de Horas": "purple", "Plantao": "gray", "Trabalho Remoto": "black", "Trabalho Externo": "black", "Licença Maternidade": "pink", "Licença Paternidade": "pink", "Licença": "#EC2855" };

    useEffect(() => {
        if (!dados) return;
        const fetchScale = async () => {
            try {
                const response = await apiService.getEscala();
                setScale(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Erro ao buscar a escala:", error);
                setLoading(false);
            }
        };

        fetchScale();
    }, []);
    // console.log(dados?.agenda);
    const handleSelect = (escalas, tipo) => {
        
        const escalasComDados = escalas.Escalas.map(escala => {
            const email = escala.Funcionarios.email;
            const agendaFinder =  dados?.agenda.find(f => f.mail === email);

            return {
                ...escala,
                name: agendaFinder.name || null,
                department: agendaFinder.department || null,
            };
        });
        setSelectedScale(escalasComDados);
        const date = `${formatarDataBR(escalas.inicioSemana)} a ${formatarDataBR(escalas.fimSemana)}`;
        setSelectedDate(date);
        setSelectedButton(tipo);
    };

    function formatarDataBR(dataIso) {
        const data = new Date(dataIso);
        const [ano, mes, dia] = data.toISOString().slice(0, 10).split("-");
        return `${dia}/${mes}/${ano}`;
    }

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
            <HeaderGGComponent pageTitle={"Escala Semanal"} />
            {
                (user?.mail === 'maria.silva@accerte.com.br' || user?.mail === 'ana.rehder@accerte.com.br') && <AdminButton><Link to="/admin">Painel Admin</Link></AdminButton>
            }
            {loading && <h2> Carregando escala...</h2>}
            {dados && scale &&
                <ButtonsContainer>
                    <Button onClick={() => handleSelect(scale.atual[0], "atual")} selecionado={selectedButton === "atual" ? 'show' : undefined}>{formatarDataBR(scale.atual[0].inicioSemana)} a {formatarDataBR(scale.atual[0].fimSemana)} </Button>
                    {scale.proxima &&
                        <button onClick={() => handleSelect(scale.proxima[0], "proximo")} seleciondo={selectedButton === "proximo"}>{formatarDataBR(scale.proxima[0].inicioSemana)} a {formatarDataBR(scale.proxima[0].fimSemana)} </button>
                    }
                </ButtonsContainer>}
            {selectedScale.length > 0 &&
                < DownloadButton onClick={handleDownload}>
                    Baixar Imagem
                </DownloadButton>
            }
            <ImageContainer ref={imageRef}>
                {selectedScale.length > 0 && <DepartmentContainer>
                    <h2>Escala Semanal {selectedDate}</h2>
                    <Week cor={'#F94860'}>
                        <Day>Nome</Day>
                        <Day >Segunda</Day>
                        <Day >Terça</Day>
                        <Day >Quarta</Day>
                        <Day >Quinta</Day>
                        <Day >Sexta</Day>
                    </Week>
                </DepartmentContainer>}
            {selectedScale.length > 0 && setores.map((setor) => {
                const scaleBySector = selectedScale.filter(item => item.department === setor);
                return (
                    <DepartmentContainer key={setor}>
                        <Title>
                            <h3>{setor}</h3>
                        </Title>
                        
                        {scaleBySector.map((scale, index) => (
                            <Week key={index}>
                                <Day>{scale.name}</Day>
                                <Day $cor={cores[scale.segunda]}>{scale.segunda}</Day>
                                <Day $cor={cores[scale.terca]}>{scale.terca}</Day>
                                <Day $cor={cores[scale.quarta]}>{scale.quarta}</Day>
                                <Day $cor={cores[scale.quinta]}>{scale.quinta}</Day>
                                <Day $cor={cores[scale.sexta]}>{scale.sexta}</Day>
                            </Week>
                        ))}
                    </DepartmentContainer>
                );
            })}
            </ImageContainer>
        </PageContainer>
    )
}

export default ScalePage;

const PageContainer = styled.div`
    width: 100%;
    height: 100%;
    min-height: 100vh;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin-bottom: 35px;
    position: relative;
`

const AdminButton = styled.button`
    top: 2%;
    right: 2%;
    position: absolute;
    font-size: 16px;
    justify-content: center;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: #ED1F4C;
    color: white;
    &:hover {
        background-color: #ED1F4C;
    }
`;

const ButtonsContainer = styled.div`
    justify-content: center;
    margin: 20px 0;
    gap: 25px;
`

const Button = styled.button`
    background-color: ${({ selecionado }) => (selecionado === 'show'  ?  "#F94860 !important" : "white !important")};
    border: 2px solid #F94860;
    color: ${({ selecionado }) => (selecionado === 'show' ? "#fff": "#F94860")};
`

const DownloadButton = styled.div`
    width: 150px;
    padding: 5px;
    border-radius: 50px;
    top: 280px;
    right: 120px;
    justify-content: center;
    background-color: #ED1F4C;
    position: absolute;
    cursor: pointer;
    color: white;
    &:hover {
        background-color: #ED1F4C;
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
    background-color: #F0F5F9;
`;

const DepartmentContainer = styled.div`
    flex-direction: column;
    width: 80%;
    h2{
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
`

const Day = styled.div`
    padding: 5px 0;
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
        }
`