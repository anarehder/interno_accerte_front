// SugestoesComponent.jsx
import { useEffect, useState } from 'react';
import styled from "styled-components";
import { FaArrowRightLong } from "react-icons/fa6";
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/apiService';
import { FaCheck } from "react-icons/fa";
import { MdBlock } from "react-icons/md";

function AprovarFeriasComponent({type}) {
    //buscar a lista dos items que o tipo nao aprovou, se for Rh ou Gestor
    const { user } = useAuth();
    const [ferias, setFerias] = useState([]);
    const [updated, setUpdated] = useState(false);
    const [carregando, setCarregando] = useState(true);
    useEffect(() => {
        if (!user) return;
        const fetchScale = async () => {
            try {
                const body = {adminEmail: user.mail};
                if(type === "RH"){
                    const response = await apiService.buscarFeriasRH(body);
                    setFerias(response.data);
                    setCarregando(false);
                    setUpdated(false);
                } else {
                    const response = await apiService.buscarFeriasGestor(body);
                    setFerias(response.data);
                    setCarregando(false);
                    setUpdated(false);
                }
            } catch (error) {
                // setErrorMessage(error.response.data.message);
                console.error(error);
                setCarregando(false);
            }
        };
        fetchScale();

    }, [user, updated]);

    function formatarDataBR(dataIso) {
        const data = new Date(dataIso);
        const [ano, mes, dia] = data.toISOString().slice(0, 10).split("-");
        return `${dia}/${mes}/${ano}`;
    }

    async function handleApprove(id, status){
        const body = {email: user.mail, id: id, status: status, tipo: type};
        try {
            
            const response = await apiService.approveVacation(body);
            if(response.status === 200 ) {
                setUpdated(true);
            } else {
                setUpdated(false);
            }
        } catch (error) {
            setErrorMessage(error.response.data.message);
            setCarregando(false);
        }
    };



    return (
        <Container>
            <h2>Aprovação de Férias - {type}</h2>
            {ferias.length !== 0 &&
                < VacationTable >
                    <div>
                        <p><span>Nome</span></p>
                        <p><span>Início</span></p>
                        <p><span>Fim</span></p>
                        <p><span>Dias</span></p>
                        <p><span>Referente Início</span></p>
                        <p><span>Referente Fim</span></p>
                        <p><span>Status</span></p>
                        <p><span>Aprovar</span></p>
                        <p><span>Reprovar</span></p>
                    </div>
                    {ferias
                    ?.filter((d) => !d.status.includes("Reprovado"))
                    .map((d, i) => (
                        <div key={i}>
                            <p>{d.Funcionarios.nome} {d.Funcionarios.sobrenome}</p>
                            <p>{formatarDataBR(d.inicio)}</p>
                            <p>{formatarDataBR(d.fim)}</p>
                            <p>{d.totalDias}</p>
                            <p>{formatarDataBR(d.referenteInicio)}</p>
                            <p>{formatarDataBR(d.referenteFim)}</p>
                            <p>{d.status}</p>
                            <p onClick={() => handleApprove(d.id, true)}><FaCheck /></p>
                            {
                                !d.status.includes("Reprovado") ? <p onClick={() => handleApprove(d.id, false)}><MdBlock /></p> : <p style={{ cursor: 'default', color: "#555" }}><MdBlock style={{ cursor: 'default' }} /></p>
                            }

                        </div>
                    ))}
                </VacationTable>
            }
            {ferias.length === 0 && !carregando && <h2>Sem férias pra aprovar.</h2>}
        </Container >
    );
};

export default AprovarFeriasComponent;

const Container = styled.div`
    margin: 0 10px 0 350px;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    gap: 10px;
    height: 60vh;
    color: #555;
    border: none;
    position: relative;
    overflow-y: scroll;
    h2 {
        margin: 10px 0;
    }
}
`
const VacationTable = styled.div` 
    width: 95%; 
    margin-top: 20px;
    margin-bottom: 30px;
    flex-direction: column;
    justify-content: space-between;
    gap: 10px;
    color: #ff5843;
    margin-bottom: 50px;
    div {
        align-items: center;
        justify-content: center;
        gap: 10px;
        height: 45px;
        padding-bottom: 7px;
        border-bottom: 1px solid #80808F;
        p{
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 2px 0;
            width: 15%;
            line-height: 22px;
            
        }
        p:nth-child(1)){
            width: 25%;
        }
        p:nth-child(4){
            width: 8%;
        }
        p:nth-child(7){
            width: 12%;
        }
        p:nth-child(8){
            width: 8%;
        }
        p:nth-child(9){
            width: 8%;
        }
    }
    span{
        font-weight: 600;
    }
`