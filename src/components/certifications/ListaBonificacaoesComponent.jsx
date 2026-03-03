import styled from 'styled-components';
import { useEffect, useState } from 'react';
import apiServiceCertificacoes from '../../services/apiServiceCertificacoes';
import { useAuth } from '../../contexts/AuthContext';

function ListaBonificacoesComponent() {
    const { user } = useAuth();
    const agora = new Date();
    const [bonificacoes, SetBonificacoes] = useState([]);
    const [niveis, setNiveis] = useState([]);
    const meses = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

    useEffect(() => {
        if (!user) return;
        const fetchData = async () => {
            const body = { email: user.mail };
            try {
                const response = await apiServiceCertificacoes.buscarListaValores(body);
                SetBonificacoes(response.data);
            } catch (error) {
                console.error("Erro ao buscar informacoes de certificações:", error);
            }

            try {
                const response = await apiServiceCertificacoes.buscarNivel(body);
                setNiveis(response.data);
            } catch (error) {
                console.error("Erro ao buscar informacoes de certificações:", error);
            }
        };

        fetchData();

    }, [user]);

    const valoresPorNivel = niveis.reduce((acc, n) => {
        acc[n.nivel] = n.valor;
        return acc;
    }, {});

    const exportToCSV = () => {
        const headers = ['Nome', 'I Total', 'I Mes Anterior', 'II', 'III', 'IV', 'V', 'Total Certificações', 'Valor Final'];
        const rows = bonificacoes.map(b => [
            `${b.nome} ${b.sobrenome}`,
            b.I,
            b.I_mes,
            b.II,
            b.III,
            b.IV,
            b.V,
            b.Total,
            Number((b.I_mes || 0) * (valoresPorNivel["I"] || 0) +
                (b.II || 0) * (valoresPorNivel["II"] || 0) +
                (b.III || 0) * (valoresPorNivel["III"] || 0) +
                (b.IV || 0) * (valoresPorNivel["IV"] || 0) +
                (b.V || 0) * (valoresPorNivel["V"] || 0)).toFixed(2)
        ]);

        let csvContent = headers.join(';') + '\n';
        rows.forEach(row => {
            csvContent += row.join(';') + '\n';
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `bonificacoes_${new Date().toISOString().slice(0, 10)}.csv`);
        link.click();
    };

    const exportToXML = () => {
        let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n<bonificacoes>\n';
        
        bonificacoes.forEach(b => {
            const valorFinal = Number((b.I_mes || 0) * (valoresPorNivel["I"] || 0) +
                (b.II || 0) * (valoresPorNivel["II"] || 0) +
                (b.III || 0) * (valoresPorNivel["III"] || 0) +
                (b.IV || 0) * (valoresPorNivel["IV"] || 0) +
                (b.V || 0) * (valoresPorNivel["V"] || 0)).toFixed(2);

            xmlContent += `  <funcionario>\n`;
            xmlContent += `    <nome>${b.nome} ${b.sobrenome}</nome>\n`;
            xmlContent += `    <i_total>${b.I}</i_total>\n`;
            xmlContent += `    <i_mes_anterior>${b.I_mes}</i_mes_anterior>\n`;
            xmlContent += `    <ii>${b.II}</ii>\n`;
            xmlContent += `    <iii>${b.III}</iii>\n`;
            xmlContent += `    <iv>${b.IV}</iv>\n`;
            xmlContent += `    <v>${b.V}</v>\n`;
            xmlContent += `    <total_certificacoes>${b.Total}</total_certificacoes>\n`;
            xmlContent += `    <valor_final>${valorFinal}</valor_final>\n`;
            xmlContent += `  </funcionario>\n`;
        });

        xmlContent += '</bonificacoes>';

        const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `bonificacoes_${new Date().toISOString().slice(0, 10)}.xml`);
        link.click();
    };

    return (
        <PageContainer>
            <ExportContainer>
                <ExportButton onClick={exportToCSV}>Exportar CSV</ExportButton>
                <ExportButton onClick={exportToXML}>Exportar XML</ExportButton>
            </ExportContainer>
            <EmissorBlock>
                <Titulo>
                    <h3>Nome</h3>
                </Titulo>
                <Certificacoes>
                    <CertificacaoInfo>
                        <div>I Total <br/> (anteriores) </div>
                        <div>I Mês Anterior <br/> ({Number((valoresPorNivel["I"] || 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})</div>
                        <div>II <br/> ({Number((valoresPorNivel["II"] || 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})</div>
                        <div>III <br/> ({Number((valoresPorNivel["III"] || 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})</div>
                        <div>IV <br/> ({Number((valoresPorNivel["IV"] || 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})</div>
                        <div>V <br/> ({Number((valoresPorNivel["V"] || 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})</div>
                        <div>Total <br/> Certificações</div>
                        <div>Valor Final ({meses[agora.getMonth()]}/{agora.getFullYear()})</div>
                    </CertificacaoInfo>
                </Certificacoes>

            </EmissorBlock>

            {bonificacoes.length > 0 && bonificacoes.map((b) => {
                return (
                    <EmissorBlock key={b.funcionarioId}>
                        <Titulo>
                            <h3>{b.nome} {b.sobrenome}</h3>
                        </Titulo>
                        <Certificacoes>
                            <CertificacaoInfo>
                                <div>{b.I}<br/> (já recebidos)</div>
                                <div>{b.I_mes} <br/>({Number((b.I_mes || 0) * (valoresPorNivel["I"] || 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})</div>
                                <div>{b.II} <br/> ({Number((b.II || 0) * (valoresPorNivel["II"] || 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})</div>
                                <div>{b.III} <br/> ({Number((b.III || 0) * (valoresPorNivel["III"] || 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})</div>
                                <div>{b.IV} <br/> ({Number((b.IV || 0) * (valoresPorNivel["IV"] || 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})</div>
                                <div>{b.V} <br/> ({Number((b.V || 0) * (valoresPorNivel["V"] || 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})</div>
                                <div>{b.Total}</div>
                                <div>
                                    {Number((b.I_mes || 0) * (valoresPorNivel["I"] || 0) +
                                        (b.II || 0) * (valoresPorNivel["II"] || 0) +
                                        (b.III || 0) * (valoresPorNivel["III"] || 0) +
                                        (b.IV || 0) * (valoresPorNivel["IV"] || 0) +
                                        (b.V || 0) * (valoresPorNivel["V"] || 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </div>
                            </CertificacaoInfo>
                        </Certificacoes>
                    </EmissorBlock>
                );
            })}
        </PageContainer>
    )   
}
export default ListaBonificacoesComponent;

const PageContainer = styled.div`
    width: 1350px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 15px;
    font-size: 25px;
    margin-bottom: 20px;
    gap: 30px;
    margin: 0 auto;    
    margin-bottom: 30px;
`

const ExportContainer = styled.div`
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-bottom: 20px;
`

const ExportButton = styled.button`
    background-color: #495F96;
    color: white;
    border: none;
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;

    &:hover {
        background-color: #3a4a7a;
    }
`
const EmissorBlock = styled.div`
    border: 2px solid gray;
`
const Titulo = styled.div`
    align-items: center;
    justify-content: center;
    width: 500px;
    background-color: #495f96ff;
    border-right: 0.5px solid gray;
    color: white;
    text-align: left;
    h3{
        font-size: 16px;
        line-height: 22px;
    }
`

const Certificacoes = styled.div`
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const CertificacaoInfo = styled.div`
    border-bottom: 0.5px solid gray;
    justify-content: center;
    font-size: 15px;
    gap: 3px;
    a{
        width: 60px;
        display: flex;
        text-align: center;
    }
    div{
        width: 120px;
        gap:; 2px;
        align-items: center;
        justify-content: center;
        text-align: center;
        // min-height: 28px;
        line-height: 25px;
        // border-left: 1px solid red;
    }
    span{
        background-color: red;
        line-height: 30px;
        font-weight: 500;
        text-align: center;
        justify-content: center;
        margin: 0;
    }
`