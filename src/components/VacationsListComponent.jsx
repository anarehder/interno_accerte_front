import styled from 'styled-components';

function VacationsListComponent({filteredData}) {
    function formatarDataBR(dataIso) {
        const data = new Date(dataIso);
        const [ano, mes, dia] = data.toISOString().slice(0, 10).split("-");
        return `${dia}/${mes}/${ano}`;
    }
    console.log(filteredData);
    return (
        <PageContainer>
            <h2>Férias</h2>
            {filteredData.some(item => item.Ferias && item.Ferias.length > 0) ?
                    <VacationTable>
                        <div>
                            <p><span>Nome</span></p>
                            <p><span>Início</span></p>
                            <p><span>Fim</span></p>
                            <p><span>Total</span></p>
                            <p><span>Referente Início</span></p>
                            <p><span>Referente Fim</span></p>
                        </div>
                        {filteredData?.map((d, i) => (
                            d.Ferias?.map((f, j) => (
                                <div key={j}>
                                    <p>{d.nome} {d.sobrenome}</p>
                                    <p>{formatarDataBR(f.inicio)}</p>
                                    <p>{formatarDataBR(f.fim)}</p>
                                    <p>{f.totalDias}</p>
                                    <p>{formatarDataBR(f.referenteInicio)}</p>
                                    <p>{formatarDataBR(f.referenteFim)}</p>
                                </div>
                            ))
                        ))}
                    </VacationTable>
                : <h3>Sem Ferias nesta busca</h3>}
                <br/>
            <h2>Licenças</h2>
            {filteredData.some(item => item.Licenca && item.Licenca.length > 0) ?
                <VacationTable>
                    <div>
                        <p><span>Início</span></p>
                        <p><span>Fim</span></p>
                        <p><span>Total</span></p>
                    </div>
                    {filteredData?.map((d, i) => (
                            d.Licencas?.map((f, j) => (
                                <div key={j}>
                                    <p>{d.nome} {d.sobrenome}</p>
                                    <p>{f.tipo}</p>
                                    <p>{formatarDataBR(f.inicio)}</p>
                                    <p>{formatarDataBR(f.fim)}</p>
                                    <p>{f.totalDias}</p>
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
    width: 90%;
    flex-direction: column;
    align-items: center;
    gap: 20px; 
    h2{
        color: #ff5843;
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
    }
    p{
        text-align: center;
        width: 20%;
        &:nth-of-type(1) {
            width: 40%
        }
    }
    span{
        font-weight: 700;
    }
`