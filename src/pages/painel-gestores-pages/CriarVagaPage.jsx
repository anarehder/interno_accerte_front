import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/apiService';
import RequisicaoVaga from '../../assets/painel-gestores/requisicao-vaga.png';
import HeaderImageComponent from '../../components/basic/HeaderImageComponent';
import { FaIdBadge, FaBriefcase, FaSackDollar, FaFileSignature, FaArrowsRotate, FaListCheck } from 'react-icons/fa6';

const FIELD_INFO = {
    solicitante: {
        title: "Solicitante da vaga",
        text: "Pessoa responsável pela solicitação desta vaga. Preenchido automaticamente com base no seu cadastro.",
    },
    area: {
        title: "Área",
        text: "Área/departamento ao qual a vaga pertence. Se você é gestor de mais de uma área, selecione a área correspondente a esta vaga.",
    },
    cargo: {
        title: "Título do cargo",
        text: "Nome do cargo/posição que será divulgado na vaga (ex: Analista de Marketing Pleno).",
    },
    confidencial: {
        title: "Confidencial",
        text: "Marque esta opção se a vaga não deve ser divulgada publicamente (ex: substituição sigilosa ou cargo estratégico).",
    },
    qtdeDeVagas: {
        title: "Quantidade de vagas",
        text: "Número de posições a serem preenchidas para este mesmo cargo/requisição.",
    },
    imediato: {
        title: "Início imediato",
        text: "Indica se a contratação precisa começar assim que possível ou se há flexibilidade de prazo.",
    },
    salario: {
        title: "Salário/remuneração",
        text: "Valor do salário-base oferecido para a posição.",
    },
    sal_variavel: {
        title: "Remuneração variável",
        text: "Indica se, além do salário fixo, há comissão, bônus ou outro tipo de remuneração variável associada ao cargo.",
    },
    tipoContrato: {
        title: "Regime de contrato",
        text: "Tipo de vínculo empregatício da vaga (ex: CLT, PJ, temporário).",
    },
    formacaoAcad: {
        title: "Formação acadêmica",
        text: "Nível mínimo de escolaridade exigido para ocupar o cargo.",
    },
    jornada: {
        title: "Jornada de trabalho",
        text: "Carga horária/regime de trabalho da vaga (ex: presencial, híbrido, remoto, horário).",
    },
    motivo: {
        title: "Motivo de abertura da vaga",
        text: "Motivo pelo qual a vaga está sendo aberta: substituição de alguém que saiu ou aumento do quadro de funcionários.",
    },
    substituido: {
        title: "Ocupante anterior",
        text: "Nome do funcionário que ocupava esta posição anteriormente. Só se aplica quando o motivo da vaga for substituição. Se a pessoa já foi desligada e não aparece na lista, selecione a opção \"Não detalhado ou já desligado\".",
    },
    atividades: {
        title: "Responsabilidades e atribuições",
        text: "Principais tarefas e responsabilidades que a pessoa contratada irá exercer no dia a dia.",
    },
    reqHardSkills: {
        title: "Pré-requisitos técnicos",
        text: "Conhecimentos técnicos, ferramentas, certificações ou experiências obrigatórias para o cargo (hard skills).",
    },
    reqSoftSkills: {
        title: "Comportamentos e habilidades",
        text: "Comportamentos, competências e habilidades interpessoais desejados para o cargo (soft skills).",
    },
    informacoes: {
        title: "Informações relevantes",
        text: "Espaço livre para qualquer outra informação importante sobre a vaga que não se encaixe nos campos anteriores. Campo opcional.",
    },
};

function FieldLabel({ children, required, infoKey, onInfoClick }) {
    return (
        <LabelRow>
            <label>
                {children} {required && <RequiredMark>*obrigatório</RequiredMark>}
            </label>
            <InfoIcon onClick={() => onInfoClick(infoKey)}>i</InfoIcon>
        </LabelRow>
    );
}

function SectionHeader({ icon, children }) {
    return (
        <SectionHeaderRow>
            {icon}
            <h3>{children}</h3>
        </SectionHeaderRow>
    );
}

function CriarVagaPage() {
    const { user } = useAuth();
    const [allowed, setAllowed] = useState(false);
    const [formularioInfo, setFormularioInfo] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [funcionarioSolicitante, setFuncionarioSolicitante] = useState(0);
    const [areaIdDoSolicitante, setAreaIdDoSolicitante] = useState([]);
    const [infoAberto, setInfoAberto] = useState(null);

    const reqDefault = {
    solicitanteId: 0,
    areaId: 0,
    cargo: '',
    salario: '',
    sal_variavel: false,
    motivo: '',
    substituidoId: null,
    substituidoOutro: false,
    formacaoAcad: '',
    tipoContratoId: 0,
    jornadaId: 0,
    atividades: '',
    reqHardSkills: '',
    reqSoftSkills: '',
    informacoes: '',
    status: 'Solicitado', // ou algum valor default
    confidencial: false,
    imediato: false,
    qtdeDeVagas: 1
    };

    const [newReq, setNewReq] = useState(reqDefault);

    const handleChange = (e) => {
    const { name, type, value, checked } = e.target;

        setNewReq((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSelectId = (e) => {
        const { name, value } = e.target;
        setNewReq((prev) => ({
            ...prev,
            [name]: Number(value)
        }));
    };

    useEffect(() => {
        if (!user) return;

        const fetchScale = async () => {
            try {
                const response = await apiService.getVagasInfo();
                setFormularioInfo(response.data);
                const func = response.data.funcionarios.find((func) => func.email.toLowerCase() === user.mail.toLowerCase());
                if (!func){
                    setCarregando(false);
                    return;
                }
                const area = response.data.gestores.filter(
                    (gestor) => gestor.funcionarioId === func.id
                );
                setAllowed(true);
                setFuncionarioSolicitante(func);
                setAreaIdDoSolicitante(area);
                setNewReq((prev) => ({
                    ...prev,
                    solicitanteId: func.id
                }));
                area.length === 1 &&
                setNewReq((prev) => ({
                    ...prev,
                    areaId: area[0].areaId
                }));
                setCarregando(false);
            } catch (error) {
                console.error("Erro ao buscar informacoes vagas:", error);
                setCarregando(false);
            }
        };

        fetchScale();

    }, [user]);
    // console.log(newReq);
    const handleSubmit = async (e) => {
        e.preventDefault(); // para não recarregar a página

        try {
            if (!newReq.areaId) {
                alert("Selecione a área da vaga.");
                return;
            }
            if (!newReq.cargo.trim()) {
                alert("Informe o título do cargo.");
                return;
            }
            if (!newReq.qtdeDeVagas || newReq.qtdeDeVagas < 1) {
                alert("Informe a quantidade de vagas.");
                return;
            }
            if (!newReq.salario) {
                alert("Informe o salário/remuneração.");
                return;
            }
            if (newReq.tipoContratoId === 0) {
                alert("Selecione o tipo de contrato");
                return
            }
            if (!newReq.formacaoAcad) {
                alert("Selecione a formação acadêmica exigida.");
                return;
            }
            if (newReq.jornadaId === 0) {
                alert("Selecione o tipo de jornada");
                return
            }
            if (!newReq.motivo) {
                alert("Selecione o motivo de abertura da vaga.");
                return;
            }
            if (newReq.motivo === "Substituição" && !newReq.substituidoOutro && !newReq.substituidoId) {
                alert("Selecione o ocupante anterior desta vaga.");
                return;
            }
            if (!newReq.atividades.trim()) {
                alert("Descreva as responsabilidades e atribuições do cargo.");
                return;
            }
            if (!newReq.reqHardSkills.trim()) {
                alert("Descreva os pré-requisitos técnicos do cargo.");
                return;
            }
            if (!newReq.reqSoftSkills.trim()) {
                alert("Descreva os comportamentos e habilidades esperados para o cargo.");
                return;
            }
            const vaga = {
                ...newReq,
                confidencial: Boolean(newReq.confidencial),
                sal_variavel: Boolean(newReq.sal_variavel),
                imediato: Boolean(newReq.imediato),
            };
            delete vaga.substituidoOutro; // campo só de controle da UI, backend não aceita

            const body = {
                adminEmail: user.mail,
                vaga
            }
            console.log(body);

            await apiService.createVagas(body);
            alert('Vaga criada com sucesso!');
            // setNewReq(reqDefault);
            window.location.reload();
        } catch (error) {
            // console.error('Erro ao criar vaga:', error);
            alert(`Possível erro ao criar vaga no servidor. Verifique se a vaga está na sua lista de vagas antes de tentar novamente. Detalhe: ${error.response.data.details.length > 0 && error.response.data.details[0]}, ${error.response.data.name}`);
        }
    };

    return (
        <PageContainer>
            <HeaderImageComponent pageTitle={"Requisição"} subtitle={"de Vaga"} lastPage={"painelgestores"} image={RequisicaoVaga} />
            <IntroText>Preencha as informações abaixo para solicitar a abertura de uma nova vaga.</IntroText>

            {carregando && <StateBox>Carregando dados...</StateBox>}
            {(!carregando && !allowed) && <StateBox><h1>Área destinada aos gestores</h1></StateBox>}

            {(!carregando && allowed) &&
            // && funcionarioSolicitante !== 0
                <Formulario onSubmit={handleSubmit}>

                    <SectionCard>
                        <SectionHeader icon={<FaIdBadge />}>Solicitação</SectionHeader>
                        <SectionGrid>
                            <FieldGroup>
                                <FieldLabel infoKey="solicitante" onInfoClick={setInfoAberto}>Solicitante da vaga</FieldLabel>
                                <input
                                    type="text"
                                    value={`${funcionarioSolicitante?.nome} ${funcionarioSolicitante?.sobrenome}`}
                                    disabled
                                />
                            </FieldGroup>

                            <FieldGroup>
                                <FieldLabel infoKey="area" onInfoClick={setInfoAberto}>Área</FieldLabel>
                                {
                                    areaIdDoSolicitante.length > 1 &&
                                    <select name="areaId" onChange={handleSelectId}>
                                        <option value="">Selecione</option>
                                        {areaIdDoSolicitante.map((item) => (
                                            <option key={item.areaId} value={item.areaId}>
                                                {formularioInfo? formularioInfo?.areas.find((area) => area.id === item.areaId)?.area : "Carregando..."}
                                            </option>
                                        ))}
                                    </select>
                                }
                                {
                                    areaIdDoSolicitante.length === 1 &&
                                    <input
                                        type="text"
                                        value={formularioInfo ? formularioInfo?.areas.find((area) => area.id === areaIdDoSolicitante[0]?.areaId)?.area : "Carregando..."}
                                        disabled
                                    />
                                }
                            </FieldGroup>
                        </SectionGrid>
                    </SectionCard>

                    <SectionCard>
                        <SectionHeader icon={<FaBriefcase />}>Sobre o cargo</SectionHeader>
                        <SectionGrid>
                            <FieldGroup $full>
                                <FieldLabel required infoKey="cargo" onInfoClick={setInfoAberto}>Título do cargo</FieldLabel>
                                <input type="text" name="cargo" onChange={handleChange} maxLength={250}/>
                            </FieldGroup>

                            <FieldGroup>
                                <FieldLabel required infoKey="qtdeDeVagas" onInfoClick={setInfoAberto}>Quantidade de vagas</FieldLabel>
                                <input
                                    type="number"
                                    value={newReq.qtdeDeVagas}
                                    min={1}
                                    name="qtdeDeVagas" onChange={handleSelectId}
                                />
                            </FieldGroup>

                            <FieldGroup>
                                <FieldLabel infoKey="imediato" onInfoClick={setInfoAberto}>Início imediato?</FieldLabel>
                                <ToggleWrapper>
                                    <ToggleInput
                                        type="checkbox"
                                        name="imediato"
                                        checked={newReq.imediato}
                                        onChange={handleChange}
                                    />
                                    <ToggleTrack />
                                    <ToggleText>{newReq.imediato ? "Sim" : "Não"}</ToggleText>
                                </ToggleWrapper>
                            </FieldGroup>

                            <FieldGroup>
                                <FieldLabel infoKey="confidencial" onInfoClick={setInfoAberto}>Confidencial</FieldLabel>
                                <ToggleWrapper>
                                    <ToggleInput
                                        type="checkbox"
                                        name="confidencial"
                                        checked={newReq.confidencial}
                                        onChange={handleChange}
                                    />
                                    <ToggleTrack />
                                    <ToggleText>{newReq.confidencial ? "Sim" : "Não"}</ToggleText>
                                </ToggleWrapper>
                            </FieldGroup>
                        </SectionGrid>
                    </SectionCard>

                    <SectionCard>
                        <SectionHeader icon={<FaSackDollar />}>Remuneração</SectionHeader>
                        <SectionGrid>
                            <FieldGroup>
                                <FieldLabel required infoKey="salario" onInfoClick={setInfoAberto}>Salário/remuneração</FieldLabel>
                                <input type="number" name="salario" onChange={handleChange} />
                            </FieldGroup>

                            <FieldGroup>
                                <FieldLabel infoKey="sal_variavel" onInfoClick={setInfoAberto}>Possui remuneração variável?</FieldLabel>
                                <ToggleWrapper>
                                    <ToggleInput
                                        type="checkbox"
                                        name="sal_variavel"
                                        checked={newReq.sal_variavel}
                                        onChange={handleChange}
                                    />
                                    <ToggleTrack />
                                    <ToggleText>{newReq.sal_variavel ? "Sim" : "Não"}</ToggleText>
                                </ToggleWrapper>
                            </FieldGroup>
                        </SectionGrid>
                    </SectionCard>

                    <SectionCard>
                        <SectionHeader icon={<FaFileSignature />}>Contratação</SectionHeader>
                        <SectionGrid>
                            <FieldGroup>
                                <FieldLabel required infoKey="tipoContrato" onInfoClick={setInfoAberto}>Regime de contrato</FieldLabel>
                                <select name="tipoContratoId" onChange={handleSelectId}>
                                    <option value="">Selecione</option>
                                    {formularioInfo.contratos.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.tipo}
                                        </option>
                                    ))}
                                </select>
                            </FieldGroup>

                            <FieldGroup>
                                <FieldLabel required infoKey="formacaoAcad" onInfoClick={setInfoAberto}>Formação acadêmica</FieldLabel>
                                <select name="formacaoAcad" onChange={handleChange}>
                                    <option value="">Selecione</option>
                                    <option value="Ensino Médio Completo (2º grau)">Ensino Médio Completo (2º grau)</option>
                                    <option value="Superior Incompleto">Superior Incompleto</option>
                                    <option value="Superior Completo">Superior Completo</option>
                                    <option value="Pós-graduação Incompleta">Pós-graduação Incompleta</option>
                                    <option value="Pós-graduação Completa">Pós-graduação Completa</option>
                                </select>
                            </FieldGroup>

                            <FieldGroup>
                                <FieldLabel required infoKey="jornada" onInfoClick={setInfoAberto}>Jornada de trabalho</FieldLabel>
                                <select name="jornadaId" onChange={handleSelectId}>
                                    <option value="">Selecione</option>
                                    {formularioInfo.jornadas.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.tipo}
                                        </option>
                                    ))}
                                </select>
                            </FieldGroup>
                        </SectionGrid>
                    </SectionCard>

                    <SectionCard>
                        <SectionHeader icon={<FaArrowsRotate />}>Motivo da vaga</SectionHeader>
                        <SectionGrid>
                            <FieldGroup>
                                <FieldLabel required infoKey="motivo" onInfoClick={setInfoAberto}>Motivo de abertura</FieldLabel>
                                <select name="motivo" onChange={handleChange}>
                                    <option value="">Selecione</option>
                                    <option value="Substituição">Substituição</option>
                                    <option value="Aumento de Quadro">Aumento de Quadro</option>
                                </select>
                            </FieldGroup>

                            {newReq.motivo === "Substituição" &&
                                <FieldGroup>
                                    <FieldLabel required infoKey="substituido" onInfoClick={setInfoAberto}>Ocupante anterior</FieldLabel>
                                    <select name="substituidoId" onChange={(e) => {
                                        const { value } = e.target;
                                        if (value === "outro") {
                                            setNewReq((prev) => ({ ...prev, substituidoId: null, substituidoOutro: true }));
                                        } else {
                                            setNewReq((prev) => ({
                                                ...prev,
                                                substituidoId: value === "" ? null : Number(value),
                                                substituidoOutro: false
                                            }));
                                        }
                                    }}>
                                        <option value="">Selecione</option>
                                        <option value="outro">Não detalhado ou já desligado</option>
                                        {formularioInfo.funcionarios.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.nome} {item.sobrenome}
                                            </option>
                                        ))}
                                    </select>
                                </FieldGroup>
                            }
                        </SectionGrid>
                    </SectionCard>

                    <SectionCard>
                        <SectionHeader icon={<FaListCheck />}>Descrição da vaga</SectionHeader>
                        <StackGrid>
                            <FieldGroup $full>
                                <FieldLabel required infoKey="atividades" onInfoClick={setInfoAberto}>Responsabilidades e atribuições</FieldLabel>
                                <textarea name="atividades" onChange={handleChange} maxLength={2000}/>
                            </FieldGroup>

                            <FieldGroup $full>
                                <FieldLabel required infoKey="reqHardSkills" onInfoClick={setInfoAberto}>Pré-requisitos técnicos</FieldLabel>
                                <textarea name="reqHardSkills" onChange={handleChange} maxLength={2000} />
                            </FieldGroup>

                            <FieldGroup $full>
                                <FieldLabel required infoKey="reqSoftSkills" onInfoClick={setInfoAberto}>Comportamentos e habilidades</FieldLabel>
                                <textarea name="reqSoftSkills" onChange={handleChange} maxLength={2000}/>
                            </FieldGroup>

                            <FieldGroup $full>
                                <FieldLabel infoKey="informacoes" onInfoClick={setInfoAberto}>Informações relevantes</FieldLabel>
                                <textarea name="informacoes" onChange={handleChange} maxLength={990}/>
                            </FieldGroup>
                        </StackGrid>
                    </SectionCard>

                    <SubmitRow>
                        <SubmitButton type="submit">Enviar Solicitação</SubmitButton>
                    </SubmitRow>
                </Formulario>

            }

            {infoAberto && (
                <ModalOverlay onClick={() => setInfoAberto(null)}>
                    <ModalBox onClick={(e) => e.stopPropagation()}>
                        <ModalHeader>
                            <h3>{FIELD_INFO[infoAberto].title}</h3>
                            <CloseButton onClick={() => setInfoAberto(null)}>×</CloseButton>
                        </ModalHeader>
                        <p>{FIELD_INFO[infoAberto].text}</p>
                    </ModalBox>
                </ModalOverlay>
            )}

        </PageContainer>
    )
}

export default CriarVagaPage;

const PageContainer = styled.div`
    width: 100%;
    min-height: 100%;
    flex-direction: column;
    align-items: center;
    position: absolute;
    gap: 20px;
    color:rgb(75, 74, 75);
`

const IntroText = styled.p`
    width: 85%;
    max-width: 700px;
    text-align: center;
    color: #777;
    font-size: 15px;
    margin-top: -10px;
`

const StateBox = styled.div`
    width: 85%;
    justify-content: center;
    align-items: center;
    padding: 60px 0;
    color: #777;
`

const Formulario = styled.form`
    width: 85%;
    max-width: 900px;
    flex-direction: column;
    gap: 20px;
    padding-bottom: 40px;

    label {
        font-weight: 600;
        font-size: 13px;
        letter-spacing: 0.2px;
    }
    input, select, textarea {
        padding: 12px 14px;
        font-size: 15px;
        border: 1px solid #dfe3e8;
        border-radius: 10px;
        background-color: #fafbfc;
        color: #333;
        transition: border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;

        &:focus {
            outline: none;
            border-color: #205fdd;
            background-color: #fff;
            box-shadow: 0 0 0 3px rgba(32, 95, 221, 0.12);
        }
        &:disabled {
            background-color: #f0f2f5;
            color: #888;
        }
    }
    select {
        cursor: pointer;
    }
    textarea {
        resize: vertical;
        min-height: 90px;
        line-height: 1.4;
    }
`

const SectionCard = styled.div`
    flex-direction: column;
    background-color: #fff;
    border: 1px solid #eceff2;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 2px 10px rgba(20, 30, 60, 0.05);
`

const SectionHeaderRow = styled.div`
    align-items: center;
    gap: 10px;
    margin-bottom: 18px;
    padding-bottom: 14px;
    border-bottom: 1px solid #f0f2f5;
    color: #205fdd;

    svg {
        font-size: 18px;
        flex-shrink: 0;
        cursor: default;
    }
    h3 {
        text-align: left;
        color: #222;
        font-size: 17px;
        font-weight: 600;
        margin: 0;
    }
`

const SectionGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px 24px;
`

const StackGrid = styled.div`
    flex-direction: column;
    gap: 20px;
`

const FieldGroup = styled.div`
    flex-direction: column;
    gap: 8px;
    ${(props) => props.$full && `grid-column: 1 / -1;`}
`

const SubmitRow = styled.div`
    justify-content: center;
`

const SubmitButton = styled.button`
    padding: 14px 40px;
    font-size: 16px;
    font-weight: 600;
    border: none;
    border-radius: 999px;
    background: linear-gradient(to right, #205fdd, #001143);
    color: #fff;
    box-shadow: 0 6px 16px rgba(32, 95, 221, 0.25);
    transition: transform 0.15s ease, box-shadow 0.15s ease;

    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 8px 20px rgba(32, 95, 221, 0.32);
        background: linear-gradient(to right, #205fdd, #001143);
    }
`

const LabelRow = styled.div`
    width: auto;
    align-items: center;
`;

const RequiredMark = styled.span`
    color: #ED1F4C;
    font-size: 12px;
    font-weight: bold;
`;

const InfoIcon = styled.span`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    margin-left: 6px;
    border-radius: 50%;
    border: 1px solid #aaa;
    background-color: transparent;
    color: #aaa;
    font-size: 10px;
    font-weight: normal;
    font-style: italic;
    cursor: pointer;
    flex-shrink: 0;
    opacity: 0.8;
    transition: all 0.15s ease;

    &:hover {
        opacity: 1;
        border-color: #555;
        color: #555;
    }
`;

const ToggleWrapper = styled.label`
    position: relative;
    display: flex;
    width: fit-content;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    height: 40px;
`;

const ToggleTrack = styled.span`
    position: relative;
    display: inline-flex;
    width: 42px;
    height: 24px;
    border-radius: 999px;
    background-color: #d7dbe0;
    transition: background-color 0.2s ease;
    flex-shrink: 0;

    &::after {
        content: "";
        position: absolute;
        top: 2px;
        left: 2px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: #fff;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        transition: transform 0.2s ease;
    }
`;

const ToggleInput = styled.input`
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + ${ToggleTrack} {
        background-color: #205fdd;
    }
    &:checked + ${ToggleTrack}::after {
        transform: translateX(18px);
    }
`;

const ToggleText = styled.span`
    font-size: 14px;
    color: #555;
`;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const ModalBox = styled.div`
    flex-direction: column;
    background-color: #fff;
    border-radius: 8px;
    padding: 20px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

    p {
        color: #555;
        font-size: 15px;
        line-height: 1.4;
        text-align: left;
    }
`;

const ModalHeader = styled.div`
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    h3 {
        color: #333;
        margin: 0;
    }
`;

const CloseButton = styled.button`
    border: none;
    background: transparent;
    font-size: 22px;
    line-height: 1;
    cursor: pointer;
    color: #555;

    &:hover {
        color: #ED1F4C;
    }
`;
