import styled from 'styled-components';
import { useEffect, useState } from 'react';
import apiServiceCertificacoes from '../../services/apiServiceCertificacoes';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/apiService';


function ListarFuncCertsAdminComponent() {
    const { user } = useAuth();
    const [funcCerts, setFuncCerts] = useState([]);
    const [funcionarios, setFuncionarios] = useState([]);

    function formatarDataBR(dataIso) {
        const data = new Date(dataIso);
        const [ano, mes, dia] = data.toISOString().slice(0, 10).split("-");
        return `${dia}/${mes}/${ano}`;
    }

    useEffect(() => {
        if (!user) return;
        const fetchData = async () => {
            const body = { email: user.mail };           
            try {
                const response = await apiServiceCertificacoes.buscarListaFuncCerts(body);
                setFuncCerts(response.data);
            } catch (error) {
                console.error("Erro ao buscar informacoes de certificações:", error);
            }   

            try {
                const response = await apiService.buscarFuncionarioAtivo();
                setFuncionarios(response.data);
            } catch (error) {
                console.error("Erro ao buscar informacoes de certificações:", error);
            }   
        };

        fetchData();

    }, [user]);
    return (
        <PageContainer>
            <EmissorBlock>
                <Titulo>
                    <h3>Emissor/Área</h3>
                </Titulo>
                <Certificacoes>
                    <CertificacaoInfo>
                        <div>Nome</div>
                        <div>Emissão</div>
                        <div>Validade</div>
                        <div>Válida PCA</div>
                        <div>Url</div>
                        <div>Emissor</div>
                        <div>Nivel</div>
                        <div>Valor</div>
                    </CertificacaoInfo>
                </Certificacoes>

            </EmissorBlock>
            {funcCerts.length > 0 && funcionarios.map((f) => {
                const certByFunc = funcCerts.filter(c => c.funcionarioId === f.id);
                if (certByFunc.length === 0) return null;
                // console.log(f);
                return (
                    <EmissorBlock key={f.id}>
                        <Titulo>
                            <h3>{f.nome} {f.sobrenome}</h3>
                        </Titulo>
                        <Certificacoes>
                            {certByFunc.map((c) => (
                                <CertificacaoInfo key={c.id}>
                                    <div>{c.Certificacoes?.nome}</div>
                                    <div>{formatarDataBR(c.emissao)}</div>
                                    <div>{c.validade? formatarDataBR(c.validade) : "Não expira"}</div>
                                    <div>{c.validaPCA ? "Válida" : "Inválida"}</div>
                                    <a href={c.url} target='_blank'><div>{c.url ? "Link" : "-"}</div></a>
                                    <div>{c.Certificacoes?.Emissor?.nome}</div>
                                    <div>{c.Certificacoes?.NiveisBonificacao?.nivel}</div>
                                    <div>{Number(c.Certificacoes?.NiveisBonificacao?.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                                </CertificacaoInfo>
                            ))}
                        </Certificacoes>

                    </EmissorBlock>
                );
            })}
        </PageContainer>
    )   
}
export default ListarFuncCertsAdminComponent;

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
const EmissorBlock = styled.div`
    border: 2px solid gray;
`
const Titulo = styled.div`
    align-items: center;
    justify-content: center;
    width: 250px;
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
        width: 100px;
        align-items: center;
        justify-content: center;
        text-align: center;
        min-height: 28px;
        line-height: 30px;
        // border-left: 1px solid red;
    }
    div:nth-child(1){
        width: 500px;
        justify-content: flex-start;
        text-indent: 15px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    div:nth-child(4){
        width: 90px;
    }
    div:nth-child(5){
        width: 60px;
        text-align: center;
    }
    div:nth-child(7){
        width: 50px;
    }
`