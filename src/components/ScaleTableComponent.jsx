import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';
import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { toPng } from "html-to-image";
import download from "downloadjs";
import EditScaleComponent from '../components/EditScaleComponent';

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
    // console.log(selectedScale, scale);
    const setores = ["Presidência", "Administrativo", "Arquitetura de Soluções", "Comercial Público", "Comercial Privado", "Financeiro", "Gente e Gestão", "Governança de Dados", "Jurídico", 'Marketing', "Tecnologia da Informação"];

    const cores = { "Home": "blue", "Presencial": "green", "Férias - CLT": "orange", "Recesso - Estágio": "orange", "Feriado": "#f94860", "Pausa - PJ": "orange", "Folga": "purple", "Banco de Horas": "purple", "Plantão": "gray", "Trabalho Remoto": "black", "Trabalho Externo": "black", "Viagem": "#fc7e00","Licença Maternidade": "#f94860", "Licença Paternidade": "#f94860", "Day OFF":"purple", "Outros": "black" };

    useEffect(() => {
        if (!dados) return;
        const fetchScale = async () => {
            try {
                const response = await apiService.getEscala();
                setScale(response.data);
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
    // console.log(scaleToEdit);
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
        if(type !== 'admin'){
            const toEdit =  escalasComDados.find(f => f.Funcionarios.email === user.mail);
            setScaleToEdit(toEdit);
        }
        setSelectedButton(tipo);
    };

    function formatarDataBR(dataIso) {
        const data = new Date(dataIso);
        const [ano, mes, dia] = data.toISOString().slice(0, 10).split("-");
        return `${dia}/${mes}/${ano}`;
    }
    // console.log('to edit', editScale);

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
            {type !== 'admin' && selectedScale.length > 0 && 
                <EditScaleButton ativo={editScale} onClick={()=> setEditScale(!editScale)} >Editar Minha Escala</EditScaleButton>
            }
            {type === 'admin' && editScale && 
                <EditScaleButton ativo={true} onClick={()=> setEditScale(false)} >Fechar Edição </EditScaleButton>
            }
            {editScale &&
                < EditScaleComponent scale={scaleToEdit} opcoes={Object.keys(cores)} setUpdatedScale={setUpdatedScale} setEditScale={setEditScale} editScale={editScale}/>
            }
            {loading && <h2> Carregando escala...</h2>}
            {!editScale && <>
            {dados && scale && 
                <ButtonsContainer>
                    <h3> Selecione uma escala:</h3>
                    <div>
                    <Button onClick={() => handleSelect(scale.atual[0], "atual")} selecionado={selectedButton === "atual" ? 'show' : undefined}>{formatarDataBR(scale.atual[0].inicioSemana)} a {formatarDataBR(scale.atual[0].fimSemana)} </Button>
                    {scale.proxima &&
                        <Button onClick={() => handleSelect(scale.proxima[0], "proximo")} selecionado={selectedButton === "proximo" ? 'show' : undefined}>{formatarDataBR(scale.proxima[0].inicioSemana)} a {formatarDataBR(scale.proxima[0].fimSemana)} </Button>
                    }
                    </div>
                </ButtonsContainer>
            }
            {selectedScale.length > 0 && 
                < DownloadButton onClick={handleDownload}>
                    Baixar Escala <br/> Como Imagem
                </DownloadButton>
            }
            <ImageContainer ref={imageRef}>
                {selectedScale.length > 0 && 
                 <DepartmentContainer>
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
                const scaleBySector = selectedScale.filter(item => item.department.trim() === setor);
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
                                {type === 'admin' && <EditAdminScaleButton onClick={() => {setScaleToEdit(scale); setEditScale(!editScale)}}>Editar</EditAdminScaleButton>}
                            </Week>
                        ))}
                    </DepartmentContainer>
                );
            })}
            </ImageContainer>
            </>}
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

const ButtonsContainer = styled.div`
    justify-content: center;
    margin: 20px 0;
    gap: 15px;
    flex-direction: column;
    align-items: center;
    div {
        gap: 25px;
        align-items: center;
        justify-content: center;
    }
`

const Button = styled.button`
    background-color: ${({ selecionado }) => (selecionado === 'show'  ?  "#F94860 !important" : "white !important")};
    border: 2px solid #ED1F4C;
    color: ${({ selecionado }) => (selecionado === 'show' ? "#fff" : "#ED1F4C")};
    max-height: 40px;
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
}
`

const EditScaleButton = styled.button`
    background-color: ${({ ativo }) => (ativo ?  "#F94860 " :"white")};
    border: 2px solid #F94860;
    color: ${({ ativo }) => (ativo ? "white" : "#F94860 ")};
    top: 20px;
    left: 120px;
    position: absolute;
    z-index: 3;
    border-radius: 50px;
    height: 50px;
    &:hover {
        background-color: ${({ ativo }) => (ativo ?  "white" : "#F94860 ")};
        color: ${({ ativo }) => (ativo ?  "#F94860 " :"white")};
    }
`

const DownloadButton = styled.div`
    width: 150px;
    height: 50px;
    text-align: center;
    border-radius: 50px;
    top: 20px;
    width: 170px;
    right: 120px;
    justify-content: center;
    align-items: center;
    background-color: #ED1F4C;
    position: absolute;
    cursor: pointer;
    color: white;
    border: 2px solid #F94860;
    &:hover {
        background-color: white;
        color: #F94860;
        border: 2px solid #F94860;
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
`