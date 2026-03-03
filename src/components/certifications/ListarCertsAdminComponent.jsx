import styled from 'styled-components';
import { useEffect, useState } from 'react';
import apiServiceCertificacoes from '../../services/apiServiceCertificacoes';
import { useAuth } from '../../contexts/AuthContext';
import { FaRegTrashAlt } from "react-icons/fa";
import EditarCertificacaoComponent from './EditarCertificacaoComponent';

function ListarCertsAdminComponent() {
    const { user } = useAuth();
    const [niveis, setNiveis] = useState([]);
    const [emissores, setEmissores] = useState([]);
    const [certifications, setCertifications] = useState([]);
    const [updated, setUpdated] = useState(false);
    const [certToEdit, setCertToEdit] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [activeFilter, setActiveFilter] = useState('');
    const [nameFilter, setNameFilter] = useState('');
    
    
    useEffect(() => {
        if (!user) return;
        const fetchData = async () => {
            const body = { email: user.mail };
            setUpdated(false);
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

    }, [user, updated]);

    const handleClickPCA = async (id, status) => {
        const body = { email: user.mail, id: id, campo: "ativaPCA", status: status };
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

    const handleClickBlock = async (id, status) => {
        const body = { email: user.mail, id: id, campo: "bloqueada", status: status };
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
        setCertToEdit(cert);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setCertToEdit(null);
    };

    const handleFilterClick = (filter) => {
        setActiveFilter((prevFilter) => (prevFilter === filter ? '' : filter));
    };

    const matchesFilter = (certification) => {
        if (activeFilter === 'ativas') return certification.ativaPCA === true;
        if (activeFilter === 'inativas') return certification.ativaPCA === false;
        if (activeFilter === 'bloqueadas') return certification.bloqueada === true;
        if (activeFilter === 'liberadas') return certification.bloqueada === false;
        return true;
    };

    const matchesNameFilter = (certification) => {
        const certificationName = certification?.nome?.toLowerCase() || '';
        const searchedName = nameFilter.toLowerCase().trim();
        return certificationName.includes(searchedName);
    };

    const exportToCSV = () => {
        const headers = ['Emissor', 'Nome', 'Nivel', 'Ativa', 'Bloqueada', 'Limite', 'Cert. Validas'];
        const rows = [];

        emissores.forEach(e => {
            const certByEmissor = certifications
                .filter(c => c.emissorId === e.id)
                .filter(matchesFilter)
                .filter(matchesNameFilter);

            certByEmissor.forEach(c => {
                rows.push([
                    e.nome,
                    c.nome,
                    niveis[c.nivelId - 1] ? niveis[c.nivelId - 1]?.nivel : c.nivelId,
                    c.ativaPCA ? 'Ativa' : 'Inativa',
                    c.bloqueada ? 'Bloqueada' : 'Liberada',
                    c.limite,
                    c.FuncionarioCerts.length
                ]);
            });
        });

        let csvContent = headers.join(';') + '\n';
        rows.forEach(row => {
            csvContent += row.join(';') + '\n';
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `certificacoes_${new Date().toISOString().slice(0, 10)}.csv`);
        link.click();
    };

    const exportToXML = () => {
        let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n<certificacoes>\n';

        emissores.forEach(e => {
            const certByEmissor = certifications
                .filter(c => c.emissorId === e.id)
                .filter(matchesFilter)
                .filter(matchesNameFilter);

            if (certByEmissor.length > 0) {
                xmlContent += `  <emissor>\n`;
                xmlContent += `    <nome>${e.nome}</nome>\n`;
                xmlContent += `    <certificacoes>\n`;

                certByEmissor.forEach(c => {
                    xmlContent += `      <certificacao>\n`;
                    xmlContent += `        <nome>${c.nome}</nome>\n`;
                    xmlContent += `        <nivel>${niveis[c.nivelId - 1] ? niveis[c.nivelId - 1]?.nivel : c.nivelId}</nivel>\n`;
                    xmlContent += `        <ativa>${c.ativaPCA ? 'Ativa' : 'Inativa'}</ativa>\n`;
                    xmlContent += `        <bloqueada>${c.bloqueada ? 'Bloqueada' : 'Liberada'}</bloqueada>\n`;
                    xmlContent += `        <limite>${c.limite}</limite>\n`;
                    xmlContent += `        <cert_validas>${c.FuncionarioCerts.length}</cert_validas>\n`;
                    xmlContent += `      </certificacao>\n`;
                });

                xmlContent += `    </certificacoes>\n`;
                xmlContent += `  </emissor>\n`;
            }
        });

        xmlContent += '</certificacoes>';

        const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `certificacoes_${new Date().toISOString().slice(0, 10)}.xml`);
        link.click();
    };

    return (
        <PageContainer>
            {showEditModal && certToEdit ?
                (
                    <EditarCertificacaoComponent
                        certificacao={certToEdit}
                        onClose={handleCloseEditModal}
                        onSuccess={() => {
                            setUpdated(true);
                            handleCloseEditModal();
                        }}
                    />
                )
                :
                <>
                    <ExportContainer>
                        <ExportButton onClick={exportToCSV}>Exportar CSV</ExportButton>
                        <ExportButton onClick={exportToXML}>Exportar XML</ExportButton>
                    </ExportContainer>
                    <FilterContainer>
                        <FilterTitle>Filtros:</FilterTitle>
                        <FilterArea>
                            <FilterButton
                                $active={activeFilter === 'ativas'}
                                onClick={() => handleFilterClick('ativas')}
                            >
                                Ativas
                            </FilterButton>
                            <FilterButton
                                $active={activeFilter === 'inativas'}
                                onClick={() => handleFilterClick('inativas')}
                            >
                                Inativas
                            </FilterButton>
                            <FilterButton
                                $active={activeFilter === 'bloqueadas'}
                                onClick={() => handleFilterClick('bloqueadas')}
                            >
                                Bloqueadas
                            </FilterButton>
                            <FilterButton
                                $active={activeFilter === 'liberadas'}
                                onClick={() => handleFilterClick('liberadas')}
                            >
                                Liberadas
                            </FilterButton>
                            <NameFilterInput
                                type="text"
                                placeholder="Filtrar por nome da certificação"
                                value={nameFilter}
                                onChange={(e) => setNameFilter(e.target.value)}
                            />
                        </FilterArea>
                    </FilterContainer>
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
                                <div>Alteração Status PCA</div>
                                <div>Alterar Bloqueio</div>
                                <div>Editar</div>
                                {/* <div>Excluir</div> */}
                            </CertificacaoInfo>
                        </Certificacoes>

                    </EmissorBlock>
                    {certifications.length > 0 && emissores.map((e) => {
                        const certByEmissor = certifications
                            .filter(c => c.emissorId === e.id)
                            .filter(matchesFilter)
                            .filter(matchesNameFilter)
                            .sort((a, b) => {
                                const aIsInativa = a.ativaPCA === false;
                                const bIsInativa = b.ativaPCA === false;
                                if (aIsInativa === bIsInativa) return 0;
                                return aIsInativa ? 1 : -1;
                            });

                        if (certByEmissor.length === 0) return null;

                        return (
                            <EmissorBlock key={e.nome}>
                                <Titulo>
                                    <h3>{e.nome}</h3>
                                </Titulo>
                                <Certificacoes>
                                    {certByEmissor.map((c) => (
                                        <CertificacaoInfo key={c.id} $bloqueada={c.bloqueada} $ativa={c.ativaPCA}>
                                            <div>{c.nome}</div>
                                            <div>{niveis[c.nivelId - 1] ? niveis[c.nivelId - 1]?.nivel : c.nivelId}</div>
                                            <div>{c.ativaPCA ? "Ativa" : "Inativa"}</div>
                                            <div>{c.bloqueada ? "Bloqueada" : "Liberada"}</div>
                                            <div>{c.limite}</div>
                                            <div>{c.FuncionarioCerts.length}</div>
                                            <div><button onClick={() => handleClickPCA(c.id, !c.ativaPCA)}>{c.ativaPCA ? "Inativar PCA" : "Ativar PCA"}</button></div>
                                            <div><button onClick={() => handleClickBlock(c.id, !c.bloqueada)}>{c.bloqueada ? "Liberar" : "Bloquear"}</button></div>
                                            <div><button onClick={() => handleEdit(c)}>Editar</button></div>
                                            {/* <div><button><FaRegTrashAlt /></button></div> */}
                                        </CertificacaoInfo>
                                    ))}
                                </Certificacoes>
                            </EmissorBlock>
                        );
                    })}
                </>
            }

        </PageContainer>
    )   
}
export default ListarCertsAdminComponent;

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

const FilterContainer = styled.div`
    border: 1px solid #9ca3af;
    border-radius: 10px;
    padding: 12px;
    margin: 0 auto 16px;
    background-color: #f9fafb;
    align-items: center;
`

const FilterTitle = styled.div`
    font-size: 14px;
    font-weight: 700;
    color: #374151;
`

const FilterArea = styled.div`
    display: flex;
    gap: 10px;
    justify-content: center;
`

const FilterButton = styled.button`
    background-color: ${({ $active }) => ($active ? '#495F96' : '#e5e7eb')};
    color: ${({ $active }) => ($active ? 'white' : '#374151')};
    border: 1px solid #9ca3af;
    padding: 10px;
    font-size: 14px;
    border-radius: 8px;
    font-weight: 600;
`

const NameFilterInput = styled.input`
    border: 1px solid #9ca3af;
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 14px;
    min-width: 280px;
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
    gap: 4px;
    line-height: 20px;
    height: auto;
    padding: 7px 0;
    
    &:nth-child(odd) {
        background-color: #ffffff;
    }
    
    &:nth-child(even) {
        background-color: #d1c3c3;;
    }
    
    ${props => props.$bloqueada  && `
        div:nth-child(4) {
            color: #d32f2f;
            font-weight: 500;
        }
    `}
    
    ${props => !props.$bloqueada && props.$bloqueada !== undefined && `
        div:nth-child(4) {
            color: #2e7d32;
            font-weight: 500;
        }
    `}
    ${props => props.$ativa && `
        div:nth-child(3) {
            color: #2e7d32;
            font-weight: 500;
        }
    `}

    ${props => !props.$ativa && props.$ativa !== undefined && `
        div:nth-child(3) {
            color: #d32f2f;
            font-weight: 500;
        }
    `}
    
    div{
        width: 75px;
        align-items: center;
        justify-content: center;
        text-align: center;
        height: 32px;
        // border-left: 1px solid red;
    }
    div:nth-child(1){
        width: 450px;
        justify-content: flex-start;
        text-align: left;
        text-indent: 2px;
    }
    div:nth-child(4){
        width: 90px;
    }
    div:nth-child(7){
        width: 110px;
    }
    div:nth-child(8){
        width: 90px;
    }
    div:nth-child(10){
        width: 50px;
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