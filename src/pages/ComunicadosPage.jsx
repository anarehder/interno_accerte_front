import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import HeaderNewComponent from "../components/basic/HeaderNewComponent";
import { useEffect, useState } from "react";
import apiService from "../services/apiService";
import { HiOutlineMail } from "react-icons/hi";
import { HiOutlineMailOpen } from "react-icons/hi";


const ComunicadosPage = () => {
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
                    setComunicados(response.data);
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
                <HeaderNewComponent pageTitle={"Comunicados"} />
                <List>
                    <Info>
                        <p></p>
                        <p>Titulo</p>
                        <p>Data Divulgação</p>
                        <div></div>
                    </Info>
                    {comunicados.length > 0 &&
                        comunicados?.map((c) => (
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
                                        {c.linkExterno ? <a href={c.linkExterno} target="_blank">
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
            </Container >
        );
    };
}

export default ComunicadosPage;
  

const Container = styled.div`
    flex-direction: column;
    border-radius: 8px;
    align-items: center;
    margin-bottom: 30px;
`;


const List = styled.div`
    display: flex;
    flex-direction: column;
    gap: 25px;
    margin: 30px 0 0 0;
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
`;



const Info = styled.div`
    margin: 5px 0;
    display: flex;
    color: #555;
    text-align: left;
    font-size: 22px;
    gap: 20px;
    align-items: center;
    height: 30px;
    p:nth-of-type(1){
        width: 70px;
    }
    p:nth-of-type(2){
        width: 500px;
    }
    p:nth-of-type(3){
        width: 175px;
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