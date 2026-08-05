import styled from 'styled-components';
import { RiDeleteBin6Line } from "react-icons/ri";
import apiService from '../../services/apiService';
import { useAuth } from '../../contexts/AuthContext';

function VacationsListComponent({filteredData, activeButton, handleSubmit, showDelete = true}) {
    const { user } = useAuth();
    function formatarDataBR(dataIso) {
        const data = new Date(dataIso);
        const [ano, mes, dia] = data.toISOString().slice(0, 10).split("-");
        return `${dia}/${mes}/${ano}`;
    }

    function getStatusLicenca(fim) {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const dataFim = new Date(fim);
        dataFim.setHours(0, 0, 0, 0);
        return dataFim < hoje ? "Finalizado" : "Em Andamento";
    }

    async function handleDelete (id) {
        try {
            const body = {adminEmail: user.mail, id: id};
            const response = await apiService.deleteVacation(body);
            if(response.status === 200 ) {
                handleSubmit();
            }
        } catch (error) {
            console.error(error.response.data);
        }
    }

    return (
        <PageContainer>
            {activeButton === "Funcionário" &&<h2>Admissão: {formatarDataBR(filteredData[0].admissao) } • Tipo Contrato: {filteredData[0].Contratos.tipo} • Dias Ferias: {filteredData[0].Contratos.diasFerias}</h2> }
            <h2>Férias</h2>
            {filteredData.some(item => item.Ferias && item.Ferias.length > 0) ?
                    <VacationTable>
                        <div>
                            <p><span>Nome</span></p>
                            <p><span>Admissão</span></p>
                            <p><span>Início</span></p>
                            <p><span>Fim</span></p>
                            <p><span>Dias</span></p>
                            <p><span>Referente Início</span></p>
                            <p><span>Referente Fim</span></p>
                            <p><span>Status</span></p>
                            {showDelete && <p><span>Deletar</span></p>}
                        </div>
                        {filteredData?.map((d, i) => (
                            d.Ferias?.map((f, j) => (
                                <div key={j}>
                                    <p>{d.nome} {d.sobrenome}</p>
                                    <p>{d.admissao ? formatarDataBR(d.admissao) : "-"}</p>
                                    <p>{formatarDataBR(f.inicio)}</p>
                                    <p>{formatarDataBR(f.fim)}</p>
                                    <p>{f.totalDias}</p>
                                    <p>{formatarDataBR(f.referenteInicio)}</p>
                                    <p>{formatarDataBR(f.referenteFim)}</p>
                                    <p>{f.status}</p>
                                    {showDelete && <p onClick={() => handleDelete(f.id)}><RiDeleteBin6Line /></p>}
                                </div>
                            ))
                        ))}
                    </VacationTable>
                : <h3>Sem Ferias nesta busca</h3>}
            <br/>
            <h2>Licenças</h2>
            {filteredData.some(item => item.Licencas && item.Licencas.length > 0) ?
                <VacationTable>
                    <div>
                        <p><span>Nome</span></p>
                        <p><span>Tipo</span></p>
                        <p><span>Início</span></p>
                        <p><span>Fim</span></p>
                        <p><span>Total Dias</span></p>
                        <p><span>Status</span></p>
                    </div>
                    {filteredData?.map((d, i) => (
                            d.Licencas?.map((f, j) => (
                                <div key={j}>
                                    <p>{d.nome} {d.sobrenome}</p>
                                    <p>{f.tipo}</p>
                                    <p>{formatarDataBR(f.inicio)}</p>
                                    <p>{formatarDataBR(f.fim)}</p>
                                    <p>{f.totalDias}</p>
                                    <p>{getStatusLicenca(f.fim)}</p>
                                </div>
                            ))
                    ))}
                </VacationTable>
                : <h3>Sem licenças nesta busca</h3>}
        </PageContainer>
    )
}

export default VacationsListComponent;

const PageContainer = styled.div`
    width: 100%;
    flex-direction: column;
    align-items: center;
    gap: 20px; 
    margin-bottom: 50px;
    h2{
        color: #ff5843;
        margin: 10px 0;
    }
    h3{
        color: gray;
    }
    
`

const VacationTable = styled.div` 
    flex-direction: column;
    justify-content: space-between;
    gap: 10px;
    color: #ff5843;
    div {
        margin-bottom: 0 !important;
        align-items: center;
        min-height: 40px;
        border-bottom: 1px solid #80808F;
        padding-bottom: 7px;
    }
    p{
        text-align: center;
        width: 20%;
        &:nth-of-type(1) {
            width: 40%
        }
        &:nth-of-type(5) {
            width: 8%
        }
    }
    span{
        font-weight: 700;
    }
`