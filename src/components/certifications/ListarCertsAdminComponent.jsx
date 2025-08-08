import styled from 'styled-components';
import { useEffect, useState } from 'react';
import apiServiceCertificacoes from '../../services/apiServiceCertificacoes';
import { useAuth } from '../../contexts/AuthContext';


function ListarCertsAdminComponent() {
    const { user } = useAuth();
    const [niveis, setNiveis] = useState([]);
    const [emissores, setEmissores] = useState([]);
    const [certifications, setCertifications] = useState([]);
    
    useEffect(() => {
        if (!user) return;
        const fetchData = async () => {
            const body = { email: user.mail };
            try {
                const response2 = await apiServiceCertificacoes.buscarNivel(body);
                setNiveis(response2.data);
            } catch (error) {
                console.error("Erro ao buscar informacoes de niveis:", error);
            }
            try {
                const response = await apiServiceCertificacoes.buscarEmissor(body);
                setEmissores(response.data);
            } catch (error) {
                console.error("Erro ao buscar informacoes de emissores:", error);
            }
            try {
                const response = await apiServiceCertificacoes.buscarCertificacao(body);
                setCertifications(response.data);
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
                        <div>Nivel</div>
                        <div>Ativa</div>
                        <div>Bloqueada</div>
                        <div>Limite</div>
                        <div>Cert. Válidas</div>
                    </CertificacaoInfo>
                </Certificacoes>

            </EmissorBlock>
            {certifications.length > 0 && emissores.map((e) => {
                const certByEmissor = certifications.filter(c => c.emissorId === e.id);
                return (
                    <EmissorBlock key={e.nome}>
                        <Titulo>
                            <h3>{e.nome}</h3>
                        </Titulo>
                        <Certificacoes>
                            {certByEmissor.map((c) => (
                                <CertificacaoInfo key={c.id}>
                                    <div>{c.nome}</div>
                                    <div>{niveis[c.nivelId-1] ? niveis[c.nivelId-1]?.nivel : c.nivelId}</div>
                                    <div>{c.ativaPCA ? "Ativa" : "Inativa"}</div>
                                    <div>{c.bloqueada ? "Bloqueada" : "Liberada"}</div>
                                    <div>{c.limite}</div>
                                    <div>{c.FuncionarioCerts.length}</div>
                                </CertificacaoInfo>
                            ))}
                        </Certificacoes>

                    </EmissorBlock>
                );
            })}
        </PageContainer>
    )   
}
export default ListarCertsAdminComponent;

const PageContainer = styled.div`
    width: 1150px;
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
    width: 150px;
    background-color: #495f96ff;
    border-right: 0.5px solid gray;
    color: white;
    h3{
        font-size: 16px;
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
    gap: 2px;
    div{
        width: 75px;
        align-items: center;
        justify-content: center;
        text-align: center;
        height: 28px;
        // border-left: 1px solid red;
    }
    div:nth-child(1){
        width: 600px;
        justify-content: flex-start;
        text-indent: 15px;
    }
    div:nth-child(4){
        width: 90px;
    }
`