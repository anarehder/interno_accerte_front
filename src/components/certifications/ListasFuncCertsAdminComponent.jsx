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
    const [statusFilter, setStatusFilter] = useState('');
    const [levelFilter, setLevelFilter] = useState('');
    const [nameFilter, setNameFilter] = useState('');
    const [ativaPCAFilter, setAtivaPCAFilter] = useState('');

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

    const handleStatusFilterClick = (filter) => {
        setStatusFilter((prevFilter) => (prevFilter === filter ? '' : filter));
    };

    const handleLevelFilterClick = (filter) => {
        setLevelFilter((prevFilter) => (prevFilter === filter ? '' : filter));
    };

    const handleAtivaPCAFilterClick = (filter) => {
        setAtivaPCAFilter((prevFilter) => (prevFilter === filter ? '' : filter));
    };

    const normalizeLevel = (level) => {
        if (level === null || level === undefined) return '';
        const levelText = String(level).trim().toUpperCase();
        const map = { '1': 'I', '2': 'II', '3': 'III', '4': 'IV', '5': 'V' };

        if (map[levelText]) return map[levelText];
        if (['I', 'II', 'III', 'IV', 'V'].includes(levelText)) return levelText;

        const onlyNumber = Number(levelText.replace(/\D/g, ''));
        if (map[String(onlyNumber)]) return map[String(onlyNumber)];

        return levelText;
    };

    const matchesStatusFilter = (certification) => {
        if (statusFilter === 'valida') return certification.validaPCA === true;
        if (statusFilter === 'invalida') return certification.validaPCA === false;
        return true;
    };

    const matchesLevelFilter = (certification) => {
        if (!levelFilter) return true;
        const certLevel = normalizeLevel(certification?.Certificacoes?.NiveisBonificacao?.nivel);
        return certLevel === levelFilter;
    };

    const matchesNameFilter = (certification) => {
        const certName = certification?.Certificacoes?.nome?.toLowerCase() || '';
        const searchedName = nameFilter.toLowerCase().trim();
        return certName.includes(searchedName);
    };

    const matchesAtivaPCAFilter = (certification) => {
        if (ativaPCAFilter === 'ativa') return certification.Certificacoes?.ativaPCA === true;
        if (ativaPCAFilter === 'inativa') return certification.Certificacoes?.ativaPCA === false;
        return true;
    };

    const exportToCSV = () => {
        const headers = ['Funcionario', 'Nome Certificacaoo', 'Ativa PCA', 'Emissao', 'Validade', 'Valida PCA', 'Emissor', 'Nivel', 'Valor'];
        const rows = [];

        funcionarios.forEach(f => {
            const certByFunc = funcCerts
                .filter(c => c.funcionarioId === f.id)
                .filter(matchesStatusFilter)
                .filter(matchesLevelFilter)
                .filter(matchesNameFilter)
                .filter(matchesAtivaPCAFilter);

            certByFunc.forEach(c => {
                rows.push([
                    `${f.nome} ${f.sobrenome}`,
                    c.Certificacoes?.nome || '',
                    c.Certificacoes?.ativaPCA ? 'Ativa' : 'Inativa',
                    formatarDataBR(c.emissao),
                    c.validade ? formatarDataBR(c.validade) : 'Nao expira',
                    c.validaPCA ? 'Valida' : 'Invalida',
                    c.Certificacoes?.Emissor?.nome || '',
                    c.Certificacoes?.NiveisBonificacao?.nivel || '',
                    Number(c.Certificacoes?.NiveisBonificacao?.valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
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
        link.setAttribute('download', `certificacoes_func_${new Date().toISOString().slice(0, 10)}.csv`);
        link.click();
    };

    const exportToXML = () => {
        let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n<certificacoes>\n';

        funcionarios.forEach(f => {
            const certByFunc = funcCerts
                .filter(c => c.funcionarioId === f.id)
                .filter(matchesStatusFilter)
                .filter(matchesLevelFilter)
                .filter(matchesNameFilter)
                .filter(matchesAtivaPCAFilter);

            if (certByFunc.length > 0) {
                xmlContent += `  <funcionario>\n`;
                xmlContent += `    <nome>${f.nome} ${f.sobrenome}</nome>\n`;
                xmlContent += `    <certificacoes>\n`;

                certByFunc.forEach(c => {
                    xmlContent += `      <certificacao>\n`;
                    xmlContent += `        <nome>${c.Certificacoes?.nome || ''}</nome>\n`;
                    xmlContent += `        <ativa_pca>${c.Certificacoes?.ativaPCA ? 'Ativa' : 'Inativa'}</ativa_pca>\n`;
                    xmlContent += `        <emissao>${formatarDataBR(c.emissao)}</emissao>\n`;
                    xmlContent += `        <validade>${c.validade ? formatarDataBR(c.validade) : 'Não expira'}</validade>\n`;
                    xmlContent += `        <valida_pca>${c.validaPCA ? 'Válida' : 'Inválida'}</valida_pca>\n`;
                    xmlContent += `        <url>${c.url || ''}</url>\n`;
                    xmlContent += `        <emissor>${c.Certificacoes?.Emissor?.nome || ''}</emissor>\n`;
                    xmlContent += `        <nivel>${c.Certificacoes?.NiveisBonificacao?.nivel || ''}</nivel>\n`;
                    xmlContent += `        <valor>${Number(c.Certificacoes?.NiveisBonificacao?.valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</valor>\n`;
                    xmlContent += `      </certificacao>\n`;
                });

                xmlContent += `    </certificacoes>\n`;
                xmlContent += `  </funcionario>\n`;
            }
        });

        xmlContent += '</certificacoes>';

        const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `certificacoes_func_${new Date().toISOString().slice(0, 10)}.xml`);
        link.click();
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
                    <ExportContainer>
                        <ExportButton onClick={exportToCSV}>Exportar CSV</ExportButton>
                        <ExportButton onClick={exportToXML}>Exportar XML</ExportButton>
                    </ExportContainer>
                    <FilterContainer>
                        <FilterTitle>Filtros:</FilterTitle>
                        <FilterArea>
                            <FilterButton
                                $wide
                                $active={ativaPCAFilter === 'ativa'}
                                onClick={() => handleAtivaPCAFilterClick('ativa')}
                            >
                                Ativa PCA
                            </FilterButton>
                            <FilterButton
                                $wide
                                $active={ativaPCAFilter === 'inativa'}
                                onClick={() => handleAtivaPCAFilterClick('inativa')}
                            >
                                Inativa PCA
                            </FilterButton>
                            <FilterButton
                                $wide
                                $active={statusFilter === 'valida'}
                                onClick={() => handleStatusFilterClick('valida')}
                            >
                                Válida PCA
                            </FilterButton>
                            <FilterButton
                                $wide
                                $active={statusFilter === 'invalida'}
                                onClick={() => handleStatusFilterClick('invalida')}
                            >
                                Inválida PCA
                            </FilterButton>
                            <FilterButton $active={levelFilter === 'I'} onClick={() => handleLevelFilterClick('I')}>I</FilterButton>
                            <FilterButton $active={levelFilter === 'II'} onClick={() => handleLevelFilterClick('II')}>II</FilterButton>
                            <FilterButton $active={levelFilter === 'III'} onClick={() => handleLevelFilterClick('III')}>III</FilterButton>
                            <FilterButton $active={levelFilter === 'IV'} onClick={() => handleLevelFilterClick('IV')}>IV</FilterButton>
                            <FilterButton $active={levelFilter === 'V'} onClick={() => handleLevelFilterClick('V')}>V</FilterButton>
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
                            <h3>Funcionário</h3>
                        </Titulo>
                        <Certificacoes>
                            <CertificacaoInfo>
                                <div>Nome Certificação</div>
                                <div>Ativa PCA</div>
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
                        const certByFunc = funcCerts
                            .filter(c => c.funcionarioId === f.id)
                            .filter(matchesStatusFilter)
                            .filter(matchesLevelFilter)
                            .filter(matchesNameFilter)
                            .filter(matchesAtivaPCAFilter);

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
                                        <CertificacaoInfo key={c.id} $invalida={!c.validaPCA} $ativaCert={c.Certificacoes?.ativaPCA}>
                                            <div>{c.Certificacoes?.nome}</div>
                                            <div>{c.Certificacoes?.ativaPCA ? "Ativa" : "Inativa"}</div>
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

const FilterContainer = styled.div`
    border: 1px solid #9ca3af;
    border-radius: 10px;
    padding: 12px;
    margin: 0 auto 16px;
    background-color: #f9fafb;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
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
    width: ${({ $wide }) => ($wide ? '110px' : '50px')};
    justify-content: center;
`

const NameFilterInput = styled.input`
    border: 1px solid #9ca3af;
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 14px;
    width: 280px;
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
        div:nth-child(5) {
            color: #d32f2f;
            font-weight: 500;
        }
    `}
    
    ${props => !props.$invalida && props.$invalida !== undefined && `
        div:nth-child(5) {
            color: #2e7d32;
            font-weight: 500;
        }
    `}

    ${props => props.$ativaCert && `
        div:nth-child(2) {
            color: #2e7d32;
            font-weight: 500;
        }
    `}

    ${props => !props.$ativaCert && props.$ativaCert !== undefined && `
        div:nth-child(2) {
            color: #d32f2f;
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
        width: 95px;
        align-items: center;
        justify-content: center;
        text-align: center;
        height: 32px;
        // border-right: 0.5px solid red;
    }
    div:nth-child(1){
        width: 350px;
        justify-content: flex-start;
        text-align: left;
        padding-right: 5px;
    }
    div:nth-child(2){
        width: 70px;
    }
    div:nth-child(5){
        width: 75px;
    }
    div:nth-child(6){
        width: 60px;
        text-align: center;
    }
    div:nth-child(8){
        width: 50px;
    }
    div:nth-child(10){
        width: 70px;
    }
    div:nth-child(11){
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