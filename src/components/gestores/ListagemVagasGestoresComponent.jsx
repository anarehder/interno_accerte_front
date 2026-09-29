import { useState } from 'react';
import styled from 'styled-components';
import { jsPDF } from 'jspdf';
import { useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6';
import { FaIdBadge, FaBriefcase, FaFileSignature, FaListCheck, FaTrash, FaFilePdf, FaLock, FaLockOpen, FaPen } from 'react-icons/fa6';
import { useAuth } from '../../contexts/AuthContext';
import { useFuncionarios } from '../../contexts/FuncionariosContext';
import apiService from '../../services/apiService';

const AREAS_COM_STATUS_COMPLETO = [1, 7, 12];

const STATUS_COLORS = {
    'Cancelada': { text: '#dc2626', bg: '#fee2e2' },
    'Solicitado': { text: '#2563eb', bg: '#eff6ff' },
    'Stand By': { text: '#3b82f6', bg: '#eff6ff' },
    'Divulgação': { text: '#0284c7', bg: '#f0f9ff' },
    'Triagem curricular': { text: '#0ea5e9', bg: '#f0f9ff' },
    'Validação curricular': { text: '#0891b2', bg: '#ecfeff' },
    'Seleção em agendamento': { text: '#06b6d4', bg: '#ecfeff' },
    'Entrevista com o Gestor': { text: '#0d9488', bg: '#f0fdfa' },
    'Entrega Documentos Admissão': { text: '#14b8a6', bg: '#f0fdfa' },
    'Testes e referências': { text: '#059669', bg: '#ecfdf5' },
    'Validação do perfil': { text: '#10b981', bg: '#ecfdf5' },
    'Concluída': { text: '#15803d', bg: '#dcfce7' },
};
const DEFAULT_STATUS_COLOR = { text: '#6b7280', bg: '#f3f4f6' };

const getStatusColor = (status) => STATUS_COLORS[status] || DEFAULT_STATUS_COLOR;

function ListagemVagasGestoresComponent({vaga, setUpdated, getProgressPercent, hideSalary}) {
    const {user} = useAuth();
    const {dados} = useFuncionarios();
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(false);
    const [novoStatus, setNovoStatus] = useState(vaga.status);
    console.log(vaga);
    const progress = getProgressPercent(vaga.status);
    const statusColor = getStatusColor(vaga.status);
    const edicaoLiberada = vaga.edicaoLiberada === true || vaga.edicaoLiberada === 1;

    const funcionarioLogado = dados?.funcionarios?.find(
        (f) => f.email?.toLowerCase() === user?.mail?.toLowerCase()
    );
    const isGestorAreaCompleta = dados?.gestores?.some(
        (g) => g.funcionarioId === funcionarioLogado?.id && AREAS_COM_STATUS_COMPLETO.includes(g.areaId)
    ) ?? false;
    const isDonoDaVaga = !!funcionarioLogado?.id && funcionarioLogado.id === vaga.solicitanteId;
    const podeEditarVaga = edicaoLiberada && (isDonoDaVaga || isGestorAreaCompleta);
    // console.log(progress);
    const handleStatusChange = (novoStatus) => {
        setNovoStatus(novoStatus);
    };
    console.log(vaga);
    const handleSubmit= async ()=>{
        const body = {
            "email": user.mail,
            "id": vaga.id,
            "status": novoStatus
        }
        const confirmado = window.confirm(`Deseja realmente alterar o status da vaga para ${novoStatus}?`);

        if (confirmado) {
            try {
                await apiService.editarVagaStatus(body);
                setUpdated(true);
                setExpanded(false);
                alert("Status alterado")
            } catch (error) {
                console.error("Erro ao editar status", error.data);
            }
        } else {
            // console.log('Ação cancelada.');
        }
    };

    const handleToggleEdicaoLiberada = async () => {
        const novoValor = !edicaoLiberada;
        const confirmado = window.confirm(
            novoValor
                ? `Deseja realmente liberar a edição da vaga "${vaga.cargo}" para o solicitante?`
                : `Deseja realmente bloquear a edição da vaga "${vaga.cargo}" para o solicitante?`
        );

        if (confirmado) {
            try {
                await apiService.liberarEdicaoVaga(vaga.id, novoValor);
                setUpdated(true);
                alert(novoValor ? "Edição liberada" : "Edição bloqueada");
            } catch (error) {
                console.error("Erro ao alterar liberação de edição", error.data);
            }
        }
    };

    const handleDelete = async () => {
        const body = {
            "email": user.mail,
            "id": vaga.id
        }
        const confirmado = window.confirm(`Deseja realmente excluir a vaga "${vaga.cargo}"? Essa ação não pode ser desfeita.`);

        if (confirmado) {
            try {
                await apiService.deleteVagas(body);
                setUpdated(true);
                setExpanded(false);
                alert("Vaga excluída")
            } catch (error) {
                console.error("Erro ao excluir vaga", error.data);
            }
        } else {
            // console.log('Ação cancelada.');
        }
    };

    const handleExportPDF = () => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const marginX = 15;
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const maxWidth = pageWidth - marginX * 2;
        const salarioFormatado = hideSalary
            ? '*****'
            : Number(vaga.salario).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        let y = 40;

        const checkPageBreak = (needed) => {
            if (y + needed > pageHeight - 15) {
                pdf.addPage();
                y = 20;
            }
        };

        const addSectionTitle = (text) => {
            checkPageBreak(12);
            pdf.setFillColor('#205fdd');
            pdf.rect(marginX, y - 3.2, 3, 3, 'F');
            pdf.setFontSize(12);
            pdf.setFont(undefined, 'bold');
            pdf.setTextColor('#205fdd');
            pdf.text(text.toUpperCase(), marginX + 6, y);
            y += 3;
            pdf.setDrawColor('#e5e7eb');
            pdf.setLineWidth(0.2);
            pdf.line(marginX, y, pageWidth - marginX, y);
            pdf.setTextColor('#000000');
            y += 6;
        };

        const addField = (label, value) => {
            const text = (value === null || value === undefined || value === '') ? '-' : String(value);
            const labelText = `${label}: `;
            pdf.setFontSize(10);
            pdf.setFont(undefined, 'bold');
            const labelWidth = pdf.getTextWidth(labelText);
            pdf.setFont(undefined, 'normal');
            const lines = pdf.splitTextToSize(text, maxWidth - labelWidth);
            checkPageBreak(lines.length * 5 + 3);
            pdf.setTextColor('#999999');
            pdf.setFont(undefined, 'bold');
            pdf.text(labelText, marginX, y);
            pdf.setTextColor('#333333');
            pdf.setFont(undefined, 'normal');
            pdf.text(lines, marginX + labelWidth, y);
            y += lines.length * 5 + 3;
        };

        // Remove marcadores de lista já existentes no texto (•, -, *, ● etc.) para não
        // duplicar com o bullet desenhado pelo PDF
        const stripBullet = (linha) => linha.replace(/^[\s]*[•▪●◦‣∙·\-\*]+\s*/, '').trim();

        const addMultilineField = (label, value) => {
            checkPageBreak(8);
            pdf.setFontSize(10);
            pdf.setFont(undefined, 'bold');
            pdf.setTextColor('#999999');
            pdf.text(label.toUpperCase(), marginX, y);
            pdf.setTextColor('#333333');
            y += 5;
            pdf.setFont(undefined, 'normal');
            const linhas = (value || '')
                .split('\n')
                .map(stripBullet)
                .filter((linha) => linha !== '');
            if (linhas.length === 0) {
                checkPageBreak(5);
                pdf.text('-', marginX, y);
                y += 5;
            } else {
                linhas.forEach((linha) => {
                    const wrapped = pdf.splitTextToSize(linha, maxWidth - 5);
                    checkPageBreak(wrapped.length * 5);
                    pdf.setFillColor('#205fdd');
                    pdf.circle(marginX + 1, y - 1.2, 0.7, 'F');
                    pdf.text(wrapped, marginX + 4, y);
                    y += wrapped.length * 5;
                });
            }
            y += 3;
        };

        // Header
        pdf.setFillColor('#001143');
        pdf.rect(0, 0, pageWidth, 32, 'F');
        pdf.setFontSize(18);
        pdf.setFont(undefined, 'bold');
        pdf.setTextColor('#ffffff');
        const cargoText = vaga.cargo || 'Vaga';
        pdf.text(cargoText, marginX, 18);
        const cargoWidth = pdf.getTextWidth(cargoText);

        // Badge de status, ao lado do nome da vaga
        pdf.setFontSize(10);
        pdf.setFont(undefined, 'bold');
        const statusWidth = pdf.getTextWidth(vaga.status) + 8;
        const statusX = marginX + cargoWidth + 6;
        pdf.setFillColor(statusColor.bg);
        pdf.roundedRect(statusX, 12.8, statusWidth, 7, 3.5, 3.5, 'F');
        pdf.setTextColor(statusColor.text);
        pdf.text(vaga.status, statusX + 4, 17.6);
        pdf.setTextColor('#000000');

        if (vaga.confidencial === 1) {
            pdf.setFontSize(9);
            const tagText = 'CONFIDENCIAL';
            const tagWidth = pdf.getTextWidth(tagText) + 6;
            pdf.setFillColor('#f59e0b');
            pdf.roundedRect(pageWidth - marginX - tagWidth, 10, tagWidth, 7, 2, 2, 'F');
            pdf.setTextColor('#78350f');
            pdf.text(tagText, pageWidth - marginX - tagWidth + 3, 14.8);
        }

        pdf.setFontSize(9);
        pdf.setFont(undefined, 'normal');
        pdf.setTextColor('#c7d2fe');
        pdf.text(
            `Criada em ${new Date(vaga.createdAt).toLocaleDateString()}  •  Atualizada em ${new Date(vaga.updatedAt).toLocaleDateString()}`,
            marginX, 26
        );

        addSectionTitle('Informações gerais');
        addField('Solicitante', vaga.Solicitante);
        addField('Tipo', vaga.tipo);
        addField('Contrato', vaga.contrato);
        addField('Salário', salarioFormatado);
        y += 3;

        addSectionTitle('Vaga');
        addField('Área', vaga.area);
        addField('Motivo', vaga.motivo);
        addField('Substituído', vaga.Substituido ? vaga.Substituido : '-');
        addField('Última Atualização', new Date(vaga.updatedAt).toLocaleDateString());
        y += 3;

        addSectionTitle('Detalhes da contratação');
        addField('Formação Acadêmica', vaga.formacaoAcad);
        addField('Salário Variável', vaga.sal_variavel === 1 ? 'Sim' : 'Não');
        addField('Início Imediato', vaga.imediato === 1 ? 'Sim' : 'Não');
        addField('Quantidade de Vagas', vaga.qtdeDeVagas);
        y += 3;

        addSectionTitle('Descrição da vaga');
        addMultilineField('Hard Skills', vaga.reqHardSkills);
        addMultilineField('Soft Skills', vaga.reqSoftSkills);
        addMultilineField('Atividades', vaga.atividades);
        addMultilineField('Informações adicionais', vaga.informacoes);

        pdf.save(`Vaga-${vaga.cargo || vaga.id}.pdf`);
    };
    // console.log(vaga);
    return (
        <Card>
            <NameRow>
                <CargoTitle>
                    {vaga.cargo}
                    {vaga.confidencial === 1 && <ConfidencialTag>Confidencial</ConfidencialTag>}
                </CargoTitle>
                <EdicaoLiberadaTag
                    $liberada={edicaoLiberada}
                    title={edicaoLiberada ? "O solicitante pode editar os dados desta vaga" : "O solicitante não pode editar os dados desta vaga"}
                >
                    {edicaoLiberada ? "Edição liberada" : "Edição bloqueada"}
                </EdicaoLiberadaTag>
            </NameRow>
            <HeaderRow>
                <HeaderMain>
                    <SubTitle>
                        Criada em {new Date(vaga.createdAt).toLocaleDateString()} por {vaga.Solicitante}
                        {' • '}Última atualização em {new Date(vaga.updatedAt).toLocaleDateString()}
                    </SubTitle>
                </HeaderMain>
                <HeaderMeta>
                    <StatusBadge $bg={statusColor.bg} $color={statusColor.text}>{vaga.status}</StatusBadge>
                    <ProgressTrack>
                        <ProgressFill $status={vaga.status} $percent={progress} />
                    </ProgressTrack>
                    <ToggleButton onClick={handleExportPDF} aria-label="Exportar vaga em PDF" title="Exportar PDF">
                        <FaFilePdf />
                    </ToggleButton>
                    <ToggleButton onClick={() => setExpanded(!expanded)} aria-label={expanded ? "Recolher detalhes" : "Expandir detalhes"}>
                        {expanded ? <FaChevronUp /> : <FaChevronDown />}
                    </ToggleButton>
                </HeaderMeta>
            </HeaderRow>
            {expanded && (
                <Details>
                    <Section>
                        <SectionTitle><FaIdBadge /> Informações gerais</SectionTitle>
                        <DetailGrid>
                            <DetailCard>
                                <Label>Solicitante</Label>
                                <Value>{vaga.Solicitante}</Value>
                            </DetailCard>
                            <DetailCard>
                                <Label>Tipo</Label>
                                <Value>{vaga.tipo}</Value>
                            </DetailCard>
                            <DetailCard>
                                <Label>Contrato</Label>
                                <Value>{vaga.contrato}</Value>
                            </DetailCard>
                            <DetailCard>
                                <Label>Salário</Label>
                                <Value>{hideSalary ? "*****" : Number(vaga.salario).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Value>
                            </DetailCard>
                        </DetailGrid>
                    </Section>

                    <Section>
                        <SectionTitle><FaBriefcase /> Vaga</SectionTitle>
                        <DetailGrid>
                            <DetailCard>
                                <Label>Área</Label>
                                <Value>{vaga.area}</Value>
                            </DetailCard>
                            <DetailCard>
                                <Label>Motivo</Label>
                                <Value>{vaga.motivo}</Value>
                            </DetailCard>
                            <DetailCard>
                                <Label>Substituído</Label>
                                <Value>{vaga.Substituido ? vaga.Substituido : "-"}</Value>
                            </DetailCard>
                            <DetailCard>
                                <Label>Última Atualização</Label>
                                <Value>{new Date(vaga.updatedAt).toLocaleDateString()}</Value>
                            </DetailCard>
                        </DetailGrid>
                    </Section>

                    <Section>
                        <SectionTitle><FaFileSignature /> Detalhes da contratação</SectionTitle>
                        <DetailGrid>
                            <DetailCard>
                                <Label>Formação Acadêmica</Label>
                                <Value>{vaga.formacaoAcad}</Value>
                            </DetailCard>
                            <DetailCard>
                                <Label>Salário Variável</Label>
                                <Value>{vaga.sal_variavel === 1 ? "Sim" : "Não"}</Value>
                            </DetailCard>
                            <DetailCard>
                                <Label>Início Imediato</Label>
                                <Value>{vaga.imediato === 1 ? "Sim" : "Não"}</Value>
                            </DetailCard>
                            <DetailCard>
                                <Label>Quantidade de Vagas</Label>
                                <Value>{vaga.qtdeDeVagas}</Value>
                            </DetailCard>
                        </DetailGrid>
                    </Section>

                    <Section>
                        <SectionTitle><FaListCheck /> Descrição da vaga</SectionTitle>
                        <StackGrid>
                            <DetailCard>
                                <Label>Hard Skills</Label>
                                <Value>
                                    {vaga.reqHardSkills.split('\n').map((linha, index) => (
                                        <p key={index}>{linha}</p>
                                    ))}
                                </Value>
                            </DetailCard>
                            <DetailCard>
                                <Label>Soft Skills</Label>
                                <Value>
                                    {vaga.reqSoftSkills.split('\n').map((linha, index) => (
                                        <p key={index}>{linha}</p>
                                    ))}
                                </Value>
                            </DetailCard>
                            <DetailCard>
                                <Label>Atividades</Label>
                                <Value>
                                    {vaga.atividades.split('\n').map((linha, index) => (
                                        <p key={index}>{linha}</p>
                                    ))}
                                </Value>
                            </DetailCard>
                            <DetailCard>
                                <Label>Informações adicionais</Label>
                                <Value>
                                    {vaga.informacoes.trim()
                                        ? vaga.informacoes.split('\n').map((linha, index) => (
                                            <p key={index}>{linha}</p>
                                        ))
                                        : <p>-</p>
                                    }
                                </Value>
                            </DetailCard>
                        </StackGrid>
                    </Section>

                    <EditRow>
                        <EditLabel>Alterar status</EditLabel>
                        <EditControls>
                            <select value={novoStatus} onChange={(e) => handleStatusChange(e.target.value)}>
                                <option value="">{novoStatus}</option>
                                {isGestorAreaCompleta ? (
                                    <>
                                        <option value="Stand By">Stand By</option>
                                        <option value="Divulgação">Divulgação</option>
                                        <option value="Triagem curricular">Triagem curricular</option>
                                        <option value="Validação curricular">Validação curricular</option>
                                        <option value="Seleção em agendamento">Seleção em agendamento</option>
                                        <option value="Entrevista com o Gestor">Entrevista com o Gestor</option>
                                        <option value="Entrega Documentos Admissão">Entrega Documentos Admissão</option>
                                        <option value="Testes e referências">Testes e referências</option>
                                        <option value="Validação do perfil">Validação do perfil</option>
                                        <option value="Concluída">Concluída</option>
                                        <option value="Cancelada">Cancelada</option>
                                    </>
                                ) : (
                                    <option value="Cancelada">Cancelada</option>
                                )}
                            </select>
                            <SubmitButton onClick={handleSubmit}>Alterar Status</SubmitButton>
                            {podeEditarVaga && (
                                <EditarVagaButton onClick={() => navigate(`/editarvaga?vagaId=${vaga.id}`)}>
                                    <FaPen /> Editar Vaga
                                </EditarVagaButton>
                            )}
                            {isGestorAreaCompleta && (
                                <>
                                    <EdicaoLiberadaButton onClick={handleToggleEdicaoLiberada}>
                                        {edicaoLiberada ? <FaLock /> : <FaLockOpen />}
                                        {edicaoLiberada ? "Bloquear Edição" : "Liberar Edição"}
                                    </EdicaoLiberadaButton>
                                    <DeleteButton onClick={handleDelete}>
                                        <FaTrash /> Excluir Vaga
                                    </DeleteButton>
                                </>
                            )}
                        </EditControls>
                    </EditRow>
                </Details>
            )}
        </Card>
    );
};

export default ListagemVagasGestoresComponent;

const Card = styled.div`
    width: 100%;
    box-sizing: border-box;
    flex-direction: column;
    background-color: #fff;
    border: 1px solid #eceff2;
    border-radius: 16px;
    padding: 20px 24px;
    box-shadow: 0 2px 10px rgba(20, 30, 60, 0.05);
    color: #555;
`;

const NameRow = styled.div`
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    margin-bottom: 4px;
`;

const EdicaoLiberadaTag = styled.div`
    font-size: 12px;
    font-weight: 600;
    width: 150px;
    justify-content: center;
    padding: 6px 12px;
    border-radius: 999px;
    white-space: nowrap;
    flex-shrink: 0;
    color: ${({ $liberada }) => ($liberada ? '#15803d' : '#dc2626')};
    background-color: ${({ $liberada }) => ($liberada ? '#dcfce7' : '#fee2e2')};
`;

const HeaderRow = styled.div`
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
`;

const HeaderMain = styled.div`
    flex-direction: column;
    gap: 4px;
    min-width: 200px;
`;

const CargoTitle = styled.div`
    font-size: 19px;
    font-weight: 700;
    align-items: center;
    gap: 10px;
    color: #222;
    text-align: left;
`;

const ConfidencialTag = styled.span`
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    color: #b45309;
    background-color: #fef3c7;
    padding: 3px 10px;
    border-radius: 999px;
`;

const SubTitle = styled.div`
    margin-top: 5px;
    font-size: 13px;
    color: #888;
`;

const HeaderMeta = styled.div`
    align-items: center;
    gap: 16px;
`;

const StatusBadge = styled.div`
    font-size: 13px;
    font-weight: 600;
    padding: 7px 14px;
    border-radius: 999px;
    white-space: nowrap;
    background-color: ${({ $bg }) => $bg};
    color: ${({ $color }) => $color};
`;

const ProgressTrack = styled.div`
    width: 220px;
    background-color: #eef0f3;
    border-radius: 999px;
    height: 16px;
`;

const ProgressFill = styled.div`
  border-radius: 999px;
  height: 100%;
  background: ${({ $status }) => {
    if ($status === 'Cancelada') return '#dc2626';
    if ($status === 'Concluída') return '#16a34a';
    return 'linear-gradient(to right, #2563eb, #16a34a)';
  }};
  width: ${({ $percent }) => $percent}%;
  transition: width 0.3s ease;
`;

const ToggleButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-sizing: border-box;
    background: #f4f6f9;
    width: 34px;
    height: 34px;
    aspect-ratio: 1 / 1;
    padding: 0;
    border: none;
    border-radius: 999px;
    color: #555;
    font-size: 14px;

    &:hover {
        background: #e8ebf0;
    }
`;

const Details = styled.div`
    width: 100%;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #f0f2f5;
    flex-direction: column;
    gap: 20px;
`;

const Section = styled.div`
    flex-direction: column;
`

const SectionTitle = styled.div`
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    color: #205fdd;
    margin-bottom: 12px;

    svg {
        font-size: 14px;
        cursor: default;
    }
`

const DetailGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 16px 24px;
`

const StackGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px 24px;

    @media (max-width: 640px) {
        grid-template-columns: 1fr;
    }
`

const DetailCard = styled.div`
    flex-direction: column;
    gap: 4px;
`

const Label = styled.div`
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.2px;
    color: #999;
`;

const Value = styled.div`
    font-size: 14px;
    color: #333;
    flex-direction: column;
    text-align: left;
    line-height: 20px;
    p {
        text-align: left;
        font-size: 14px;
        &:not(:first-child) {
            margin-top: 6px;
        }
    }
`;

const EditRow = styled.div`
    flex-direction: column;
    gap: 10px;
    padding-top: 8px;
    border-top: 1px solid #f0f2f5;
`;

const EditLabel = styled.div`
    font-size: 13px;
    font-weight: 700;
    color: #333;
`;

const EditControls = styled.div`
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;

    select {
        height: 42px;
        min-width: 260px;
        padding: 0 14px;
        font-size: 14px;
        color: #333;
        background-color: #fafbfc;
        border: 1px solid #dfe3e8;
        border-radius: 10px;
        cursor: pointer;

        &:focus {
            outline: none;
            border-color: #205fdd;
            box-shadow: 0 0 0 3px rgba(32, 95, 221, 0.12);
        }
    }
`;

const SubmitButton = styled.button`
    padding: 10px 24px;
    font-size: 14px;
    font-weight: 600;
    border: none;
    border-radius: 999px;
    background: linear-gradient(to right, #205fdd, #001143);
    color: #fff;
    box-shadow: 0 4px 12px rgba(32, 95, 221, 0.25);
    transition: transform 0.15s ease, box-shadow 0.15s ease;

    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 16px rgba(32, 95, 221, 0.32);
        background: linear-gradient(to right, #205fdd, #001143);
    }
`;

const EditarVagaButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 24px;
    font-size: 14px;
    font-weight: 600;
    border: 1px solid #0d9488;
    border-radius: 999px;
    background: #fff;
    color: #0d9488;
    transition: background 0.15s ease, color 0.15s ease;

    &:hover {
        background: #0d9488;
        color: #fff;
    }
`;

const EdicaoLiberadaButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 24px;
    font-size: 14px;
    font-weight: 600;
    border: 1px solid #205fdd;
    border-radius: 999px;
    background: #fff;
    color: #205fdd;
    transition: background 0.15s ease, color 0.15s ease;

    &:hover {
        background: #205fdd;
        color: #fff;
    }
`;

const DeleteButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 24px;
    font-size: 14px;
    font-weight: 600;
    border: 1px solid #dc2626;
    border-radius: 999px;
    background: #fff;
    color: #dc2626;
    transition: background 0.15s ease, color 0.15s ease;

    &:hover {
        background: #dc2626;
        color: #fff;
    }
`;
