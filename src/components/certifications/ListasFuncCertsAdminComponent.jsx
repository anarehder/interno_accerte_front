import styled from 'styled-components';
import { useEffect, useState } from 'react';
import apiServiceCertificacoes from '../../services/apiServiceCertificacoes';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/apiService';
import { GrValidate } from "react-icons/gr";
import { ImBlocked } from "react-icons/im";
import EditarFuncCertComponent from './EditarFuncCertComponent';


function ListarFuncCertsAdminComponent() {
    const { user } = useAuth();
    const [funcCerts, setFuncCerts] = useState([]);
    const [funcionarios, setFuncionarios] = useState([]);
    const [updated, setUpdated] = useState(false);
    const [funcCertToEdit, setFuncCertToEdit] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

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
                setUpdated(false);
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

    }, [user, updated]);

    const handleClick = async (id, status) => {
        const body = { email: user.mail, id: id, campo: "validaPCA", status: status };
        try {
            const response = await apiServiceCertificacoes.editarStatus(body);
            if (response.status === 200) {
                alert(`Certificação alterada com sucesso!`);
                setUpdated(true);
            }
        } catch (error) {
            console.error("Erro ao enviar requisição:", error);
            // alert(`Ocorreu um erro. Tente novamente, ${error.response.data.message}.`);
        }
    };

    const handleEdit = (cert) => {
        setFuncCertToEdit(cert);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setFuncCertToEdit(null);
    };

    return (
        <PageContainer>
            {showEditModal && funcCertToEdit ? (
                <EditarFuncCertComponent 
                    funcCert={funcCertToEdit}
                    onClose={handleCloseEditModal}
                    onSuccess={() => {
                        setUpdated(true);
                        handleCloseEditModal();
                    }}
                />
            ) : (
                <>
                    <EmissorBlock>
                        <Titulo>
                            <h3>Funcionário</h3>
                        </Titulo>
                        <Certificacoes>
                            <CertificacaoInfo>
                                <div>Nome Certificação</div>
                                <div>Emissão</div>
                                <div>Validade</div>
                                <div>Válida PCA</div>
                                <div>Url</div>
                                <div>Emissor</div>
                                <div>Nivel</div>
                                <div>Valor</div>
                                <div>Editar</div>
                                <div>Ação</div>
                            </CertificacaoInfo>
                        </Certificacoes>

                    </EmissorBlock>
                    {funcCerts.length > 0 && funcionarios.map((f) => {
                        const certByFunc = funcCerts.filter(c => c.funcionarioId === f.id);
                        if (certByFunc.length === 0) return null;
                        // Ordena: válidas primeiro, inválidas no final
                        const certOrdenadas = certByFunc.sort((a, b) => {
                            if (a.validaPCA === b.validaPCA) return 0;
                            return a.validaPCA ? -1 : 1;
                        });
                        // console.log(f);
                        return (
                            <EmissorBlock key={f.id}>
                                <Titulo>
                                    <h3>{f.nome} {f.sobrenome}</h3>
                                </Titulo>
                                <Certificacoes>
                                    {certOrdenadas.map((c) => (
                                        <CertificacaoInfo key={c.id} $invalida={!c.validaPCA}>
                                            <div>{c.Certificacoes?.nome}</div>
                                            <div>{formatarDataBR(c.emissao)}</div>
                                            <div>{c.validade? formatarDataBR(c.validade) : "Não expira"}</div>
                                            <div>{c.validaPCA ? "Válida" : "Inválida"}</div>
                                            <div><a href={c.url} target='_blank'>{c.url ? "Link" : "-"}</a></div>
                                            <div>{c.Certificacoes?.Emissor?.nome}</div>
                                            <div>{c.Certificacoes?.NiveisBonificacao?.nivel}</div>
                                            <div>{Number(c.Certificacoes?.NiveisBonificacao?.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                                            <div><button onClick={() => handleEdit(c)}>Editar</button></div>
                                            <div> <button onClick={() => handleClick(c.id, !c.validaPCA)} style={{ cursor: "pointer" }}>{c.validaPCA ? "Invalidar": "Validar"}</button></div>
                                        </CertificacaoInfo>
                                    ))}
                                </Certificacoes>

                            </EmissorBlock>
                        );
                    })}
                </>
            )}
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
    width: 150px;
    background-color: #495f96ff;
    border-right: 0.5px solid gray;
    color: white;
    h3{
        font-size: 16px;
        line-height: 22px;
        padding: 5px 0;
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
    gap: 4px;
    line-height: 20px;
    height: auto;
    padding: 12px 0;
    
    &:nth-child(odd) {
        background-color: #ffffff;
    }
    
    &:nth-child(even) {
        background-color: #d1c3c3;
    }
    
    ${props => props.$invalida && `
        div:nth-child(4) {
            color: #d32f2f;
            font-weight: 500;
        }
    `}
    
    ${props => !props.$invalida && props.$invalida !== undefined && `
        div:nth-child(4) {
            color: #2e7d32;
            font-weight: 500;
        }
    `}
    
    a{
        width: 60px;
        display: flex;
        text-align: center;
        justify-content: center;
    }
    div{
        width: 100px;
        align-items: center;
        justify-content: center;
        text-align: center;
        height: 32px;
        // border-left: 1px solid red;
    }
    div:nth-child(1){
        width: 410px;
        justify-content: flex-start;
        text-align: left;
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
    div:nth-child(9){
        width: 70px;
    }
    div:nth-child(10){
        width: 75px;
    }
    button{
        width: 95%;
        display: flex;
        justify-content: center;
        font-size: 14px;
        background-color: #495F96;
        padding: 6px;
    }
`