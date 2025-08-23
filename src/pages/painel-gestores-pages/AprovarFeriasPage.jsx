// SugestoesComponent.jsx
import { useEffect, useState } from 'react';
import styled from "styled-components";
import AprovarFerias from '../../assets/painel-gestores/aprovar-ferias.png';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/apiService';
import { FaCheck } from "react-icons/fa";
import { MdBlock } from "react-icons/md";
import HeaderImageComponent from '../../components/basic/HeaderImageComponent';

function AprovarFeriasPage() {
    //buscar a lista dos items que o tipo nao aprovou, se for Rh ou Gestor
    const type = "Gestor";
    const { user } = useAuth();
    const [ferias, setFerias] = useState([]);
    const [updated, setUpdated] = useState(false);
    const [carregando, setCarregando] = useState(true);
    useEffect(() => {
        if (!user) return;
        const fetchScale = async () => {
            try {
                const body = { adminEmail: 'klebio.oliveira@accerte.com.br' };
                const response = await apiService.buscarFeriasGestor(body);
                setFerias(response.data);
                setCarregando(false);
                setUpdated(false);
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
        <PageContainer>
            <HeaderImageComponent pageTitle={"Aprovar"} subtitle={"Férias"} lastPage={"painelgestores"} image={AprovarFerias} />
            <Container>
                <h2>Aprovação de Férias</h2>
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
        </PageContainer>
    );
};

export default AprovarFeriasPage;

const PageContainer = styled.div`
    width: 100%;
    min-height: 100%;
    flex-direction: column;
    align-items: center;
    position: absolute;
    gap: 20px;
    color:rgb(75, 74, 75);
`

const Container = styled.div`
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    gap: 10px;
    color: #555;
    border: none;
    h2 {
        margin: 20px 0;
    }
}
`

const VacationTable = styled.div` 
    width: 92%; 
    margin-top: 20px;
    margin-bottom: 30px;
    flex-direction: column;
    justify-content: space-between;
    gap: 10px;
    color: #0057E1;
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