import styled from "styled-components";
import { useEffect, useState } from "react";
import { HiOutlineMail } from "react-icons/hi";
import { HiOutlineMailOpen } from "react-icons/hi";
import { useAuth } from "../../contexts/AuthContext";
import apiService from "../../services/apiService";
import HeaderNewComponent from "../../components/basic/HeaderNewComponent";
import HeaderImageComponent from "../../components/basic/HeaderImageComponent";
import AEMLogo from "../../assets/AEM-logo.png";
import RegulamentoAEM3 from "../../assets/Regulamento AEM 3.pdf";


const AEM3Page = () => {
    {
        const { user } = useAuth();
        const [comunicados, setComunicados] = useState([]);
        const [updated, setUpdated] = useState(false);
        const [open, setOpen] = useState(null);

        useEffect(() => {
            if (!user) return;
            const fetchScale = async () => {
                try {
                    const body = { email: user.mail };
                    const response = await apiService.buscarComunicadosEmail(body);
                    const comunicadosFiltrados = response.data.filter(c => c.tipo === "Accerte em Movimento 3");
                    setComunicados(comunicadosFiltrados);
                    setUpdated(false);
                } catch (error) {
                    console.error("Erro ao buscar a escala:", error);
                }
            };

            fetchScale();

        }, [updated, user]);

        function openCard(id) {
            if (open === id) {
                setOpen(null);
            } else {
                setOpen(id);
            }
        }

        function formatarDataBR(dataIso) {
            const data = new Date(dataIso);
            const [ano, mes, dia] = data.toISOString().slice(0, 10).split("-");
            return `${dia}/${mes}/${ano}`;
        }

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

        return (
            <Container>
                {/* <HeaderNewComponent pageTitle={"Accerte em Movimento 2"} /> */}
                <HeaderImageComponent pageTitle={"3ª"} subtitle={"Edição"} lastPage={"homepage"} image={AEMLogo} />
                <RegulamentoContainer>
                    <a href={"https://accerte.sharepoint.com/sites/AccerteTecnologiadaInformaoLtda/Documentos%20Compartilhados/Forms/AllItems.aspx?id=%2Fsites%2FAccerteTecnologiadaInformaoLtda%2FDocumentos%20Compartilhados%2FExtras%2FCOMUNICADOS%2FRegulamento%20Accerte%20em%20Movimento%2Epdf&parent=%2Fsites%2FAccerteTecnologiadaInformaoLtda%2FDocumentos%20Compartilhados%2FExtras%2FCOMUNICADOS&p=true&ga=1"} target="_blank" rel="noopener noreferrer">📄 Regulamento AEM 3</a>
                </RegulamentoContainer>
                {comunicados.length > 0 && (
                <List>
                    <Info>
                        <p></p>
                        <p>Titulo</p>
                        <p>Data Divulgação</p>
                        <div></div>
                    </Info>
                    {comunicados?.map((c) => (
                            <Card key={c.id} onClick={() => openCard(c.id)}>
                                <Info>
                                    {c.LeituraComunicados[0].confLeitura === true ? <p><HiOutlineMailOpen size={30} /> </p> : <p> <HiOutlineMail size={30} /></p>}
                                    <p>{c.titulo}</p>
                                    <p>{formatarDataBR(c.dataDivulgacao)}</p>
                                    <div>
                                        {open === c.id ? <button>Fechar</button> : <button>Detalhes</button>}
                                        <button onClick={() => leituraComunicado(c.id)} disabled={c.LeituraComunicados[0].confLeitura === true}> Confirmar</button>
                                    </div>

                                </Info>
                                {open === c.id &&
                                    <Details>
                                        {(c?.linkExterno && c?.linkExterno !== '-') ? <a href={c.linkExterno} target="_blank">
                                            <img src={c.imagemUrl} alt={c.titulo} />
                                        </a> : <img src={c.imagemUrl} alt={c.titulo} />
                                        }
                                        {c.legenda?.length > 3 && <p>{c.legenda}</p>}
                                    </Details>
                                }
                            </Card>
                        ))
                    }
                </List>
                )}
                {comunicados.length === 0 && <NenhumComunicadoMsg>Ainda não há comunicados do Accerte Em Movimento 3ª Edição.</NenhumComunicadoMsg>}
            </Container >
        );
    };
}

export default AEM3Page;
  

const Container = styled.div`
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    align-items: center;
    margin-bottom: 30px;
    width: 100%;
`;


const List = styled.div`
    display: flex;
    flex-direction: column;
    gap: 25px;
    margin: 30px auto 0 auto;
    justify-content: center;
    align-items: center;
    width: 70%;
`;

const Card = styled.div`
    flex-direction: column;
    background: white;
    padding: 8px 25px;
    align-items: center;
    justify-content: space-around;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    gap: 10%;
    display: flex;
    width: 100%;
`;



const Info = styled.div`
    margin: 5px 0;
    display: flex;
    color: #555;
    text-align: left;
    font-size: 22px;
    gap: 20px;
    align-items: center;
    justify-content: center;
    height: 30px;
    width: 100%;
    p:nth-of-type(1){
        width: 70px;
    }
    p:nth-of-type(2){
        width: 500px;
    }
    p:nth-of-type(3){
        width: 230px;
    }
    div{
        width: 250px;
        justify-content: space-between;
    }
    button{
        background: linear-gradient(to right,#205fdd, #001143);
        font-size: 17px;
        width: 110px;
        justify-content: center;
        &:disabled {
            background: #555;
            color: white;
            cursor: not-allowed;
        }
    }
`;

const Details = styled.div`
    min-height: 550px;
    align-items: center;
    justify-content: center;
    gap: 30px;
    color: #555;
    p{  
        width: 55%;
        font-size: 18px;
        line-height: 25px;
        text-align: left;
    }
    a, img{
        height: 500px;
    }
`

const RegulamentoContainer = styled.div`
    display: flex;
    justify-content: center;
    margin: 20px 0;
    a {
        padding: 12px 24px;
        background: linear-gradient(to right, #205fdd, #001143);
        color: white;
        text-decoration: none;
        border-radius: 6px;
        font-weight: 600;
        font-size: 16px;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        
        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
    }
`;

const NenhumComunicadoMsg = styled.div`
    text-align: center;
    color: #555;
    font-size: 18px;
    padding: 40px 20px;
    font-weight: 500;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;