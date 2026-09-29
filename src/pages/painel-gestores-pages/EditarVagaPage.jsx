import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useFuncionarios } from '../../contexts/FuncionariosContext';
import apiService from '../../services/apiService';
import RequisicaoVaga from '../../assets/painel-gestores/requisicao-vaga.png';
import HeaderImageComponent from '../../components/basic/HeaderImageComponent';
import { FaIdBadge, FaBriefcase, FaSackDollar, FaFileSignature, FaArrowsRotate, FaListCheck } from 'react-icons/fa6';

const AREAS_COM_STATUS_COMPLETO = [1, 7, 12];

// campos que a rota POST /vagas/editar/:id aceita (edição parcial)
const CAMPOS_EDITAVEIS = [
    'areaId', 'cargo', 'salario', 'sal_variavel', 'motivo', 'substituidoId',
    'formacaoAcad', 'tipoContratoId', 'jornadaId', 'atividades', 'reqHardSkills',
    'reqSoftSkills', 'informacoes', 'confidencial', 'imediato', 'qtdeDeVagas',
];

const FIELD_INFO = {
    area: {
        title: "Área",
        text: "Área/departamento ao qual a vaga pertence.",
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

// normaliza os campos editáveis vindos da API (0/1 -> boolean, etc.) pra
// comparar de forma confiável depois e pra controlar os inputs do formulário
function normalizarCampos(vaga) {
    return {
        areaId: vaga.areaId,
        cargo: vaga.cargo ?? '',
        salario: vaga.salario ?? '',
        sal_variavel: vaga.sal_variavel === true || vaga.sal_variavel === 1,
        motivo: vaga.motivo ?? '',
        substituidoId: vaga.substituidoId ?? null,
        formacaoAcad: vaga.formacaoAcad ?? '',
        tipoContratoId: vaga.tipoContratoId,
        jornadaId: vaga.jornadaId,
        atividades: vaga.atividades ?? '',
        reqHardSkills: vaga.reqHardSkills ?? '',
        reqSoftSkills: vaga.reqSoftSkills ?? '',
        informacoes: vaga.informacoes ?? '',
        confidencial: vaga.confidencial === true || vaga.confidencial === 1,
        imediato: vaga.imediato === true || vaga.imediato === 1,
        qtdeDeVagas: vaga.qtdeDeVagas,
    };
}

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

function EditarVagaPage() {
    const { user } = useAuth();
    const { dados } = useFuncionarios();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const vagaId = Number(searchParams.get("vagaId"));

    const [carregando, setCarregando] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [formularioInfo, setFormularioInfo] = useState(null);
    const [vagaOriginal, setVagaOriginal] = useState(null);
    const [form, setForm] = useState(null);
    const [substituidoOutro, setSubstituidoOutro] = useState(false);
    const [infoAberto, setInfoAberto] = useState(null);

    const originalRef = useRef(null);

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSelectId = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value === "" ? "" : Number(value),
        }));
    };

    useEffect(() => {
        if (!user) return;
        if (!vagaId) {
            setErrorMessage("Vaga não informada.");
            setCarregando(false);
            return;
        }

        const fetchTudo = async () => {
            try {
                const [infoRes, vagasRes] = await Promise.all([
                    apiService.getVagasInfo(),
                    apiService.getVagas({ adminEmail: user.mail }),
                ]);
                setFormularioInfo(infoRes.data);

                const encontrada = vagasRes.data.find((v) => v.id === vagaId);
                if (!encontrada) {
                    setErrorMessage("Vaga não encontrada ou você não tem acesso a ela.");
                    setCarregando(false);
                    return;
                }

                setVagaOriginal(encontrada);
                const camposIniciais = normalizarCampos(encontrada);
                setForm(camposIniciais);
                setSubstituidoOutro(camposIniciais.motivo === "Substituição" && camposIniciais.substituidoId === null);
                originalRef.current = camposIniciais;
                setCarregando(false);
            } catch (error) {
                console.error("Erro ao buscar vaga para edição:", error);
                setErrorMessage("Erro ao carregar dados da vaga.");
                setCarregando(false);
            }
        };

        fetchTudo();
    }, [user, vagaId]);

    const funcionarioLogado = dados?.funcionarios?.find(
        (f) => f.email?.toLowerCase() === user?.mail?.toLowerCase()
    );
    const isGestorAreaCompleta = dados?.gestores?.some(
        (g) => g.funcionarioId === funcionarioLogado?.id && AREAS_COM_STATUS_COMPLETO.includes(g.areaId)
    ) ?? false;
    const isDonoDaVaga = !!funcionarioLogado?.id && !!vagaOriginal && funcionarioLogado.id === vagaOriginal.solicitanteId;
    const edicaoLiberada = !!vagaOriginal && (vagaOriginal.edicaoLiberada === true || vagaOriginal.edicaoLiberada === 1);
    const podeEditar = !!vagaOriginal && edicaoLiberada && (isDonoDaVaga || isGestorAreaCompleta);

    // gestor de área completa pode mover a vaga pra qualquer área; o dono da
    // vaga (sem ser gestor de área completa) só pode escolher entre as áreas
    // que ele mesmo gerencia, igual ao formulário de criação
    const areaIdsDoUsuario = dados?.gestores
        ?.filter((g) => g.funcionarioId === funcionarioLogado?.id)
        ?.map((g) => g.areaId) ?? [];
    const areasDisponiveis = isGestorAreaCompleta
        ? formularioInfo?.areas ?? []
        : (formularioInfo?.areas ?? []).filter((a) => areaIdsDoUsuario.includes(a.id));

    const buildChangedFields = () => {
        const body = {};
        CAMPOS_EDITAVEIS.forEach((campo) => {
            if (JSON.stringify(form[campo]) !== JSON.stringify(originalRef.current[campo])) {
                body[campo] = form[campo];
            }
        });
        return body;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.areaId) {
            alert("Selecione a área da vaga.");
            return;
        }
        if (!form.cargo.trim()) {
            alert("Informe o título do cargo.");
            return;
        }
        if (!form.qtdeDeVagas || form.qtdeDeVagas < 1) {
            alert("Informe a quantidade de vagas.");
            return;
        }
        if (!form.salario) {
            alert("Informe o salário/remuneração.");
            return;
        }
        if (!form.tipoContratoId) {
            alert("Selecione o tipo de contrato");
            return;
        }
        if (!form.formacaoAcad) {
            alert("Selecione a formação acadêmica exigida.");
            return;
        }
        if (!form.jornadaId) {
            alert("Selecione o tipo de jornada");
            return;
        }
        if (!form.motivo) {
            alert("Selecione o motivo de abertura da vaga.");
            return;
        }
        if (form.motivo === "Substituição" && !substituidoOutro && !form.substituidoId) {
            alert("Selecione o ocupante anterior desta vaga.");
            return;
        }
        if (!form.atividades.trim()) {
            alert("Descreva as responsabilidades e atribuições do cargo.");
            return;
        }
        if (!form.reqHardSkills.trim()) {
            alert("Descreva os pré-requisitos técnicos do cargo.");
            return;
        }
        if (!form.reqSoftSkills.trim()) {
            alert("Descreva os comportamentos e habilidades esperados para o cargo.");
            return;
        }

        const body = buildChangedFields();
        if (Object.keys(body).length === 0) {
            alert("Nenhuma alteração para salvar.");
            return;
        }

        const confirmado = window.confirm("Deseja realmente salvar as alterações desta vaga?");
        if (!confirmado) return;

        try {
            await apiService.editarVaga(vagaOriginal.id, body);
            alert("Vaga atualizada com sucesso!");
            navigate("/listavagas");
        } catch (error) {
            const detalhe = error?.response?.data?.message || error?.response?.data?.name || "";
            alert(`Erro ao editar a vaga. ${detalhe}`);
        }
    };

    return (
        <PageContainer>
            <HeaderImageComponent pageTitle={"Editar"} subtitle={"Vaga"} lastPage={"listavagas"} image={RequisicaoVaga} />
            <IntroText>Altere abaixo as informações da vaga. Só os campos alterados serão enviados.</IntroText>

            {carregando && <StateBox>Carregando dados...</StateBox>}
            {(!carregando && errorMessage) && <StateBox><h1>{errorMessage}</h1></StateBox>}
            {(!carregando && !errorMessage && vagaOriginal && !podeEditar) &&
                <StateBox><h1>Você não tem permissão para editar esta vaga.</h1></StateBox>
            }

            {(!carregando && !errorMessage && form && formularioInfo && podeEditar) &&
                <Formulario onSubmit={handleSubmit}>

                    <SectionCard>
                        <SectionHeader icon={<FaIdBadge />}>Solicitação</SectionHeader>
                        <SectionGrid>
                            <FieldGroup>
                                <FieldLabel infoKey="area" onInfoClick={setInfoAberto}>Área</FieldLabel>
                                <select name="areaId" value={form.areaId} onChange={handleSelectId}>
                                    <option value="">Selecione</option>
                                    {areasDisponiveis.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.area}
                                        </option>
                                    ))}
                                </select>
                            </FieldGroup>
                        </SectionGrid>
                    </SectionCard>

                    <SectionCard>
                        <SectionHeader icon={<FaBriefcase />}>Sobre o cargo</SectionHeader>
                        <SectionGrid>
                            <FieldGroup $full>
                                <FieldLabel required infoKey="cargo" onInfoClick={setInfoAberto}>Título do cargo</FieldLabel>
                                <input type="text" name="cargo" value={form.cargo} onChange={handleChange} maxLength={250} />
                            </FieldGroup>

                            <FieldGroup>
                                <FieldLabel required infoKey="qtdeDeVagas" onInfoClick={setInfoAberto}>Quantidade de vagas</FieldLabel>
                                <input
                                    type="number"
                                    value={form.qtdeDeVagas}
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
                                        checked={form.imediato}
                                        onChange={handleChange}
                                    />
                                    <ToggleTrack />
                                    <ToggleText>{form.imediato ? "Sim" : "Não"}</ToggleText>
                                </ToggleWrapper>
                            </FieldGroup>

                            <FieldGroup>
                                <FieldLabel infoKey="confidencial" onInfoClick={setInfoAberto}>Confidencial</FieldLabel>
                                <ToggleWrapper>
                                    <ToggleInput
                                        type="checkbox"
                                        name="confidencial"
                                        checked={form.confidencial}
                                        onChange={handleChange}
                                    />
                                    <ToggleTrack />
                                    <ToggleText>{form.confidencial ? "Sim" : "Não"}</ToggleText>
                                </ToggleWrapper>
                            </FieldGroup>
                        </SectionGrid>
                    </SectionCard>

                    <SectionCard>
                        <SectionHeader icon={<FaSackDollar />}>Remuneração</SectionHeader>
                        <SectionGrid>
                            <FieldGroup>
                                <FieldLabel required infoKey="salario" onInfoClick={setInfoAberto}>Salário/remuneração</FieldLabel>
                                <input type="number" name="salario" value={form.salario} onChange={handleChange} />
                            </FieldGroup>

                            <FieldGroup>
                                <FieldLabel infoKey="sal_variavel" onInfoClick={setInfoAberto}>Possui remuneração variável?</FieldLabel>
                                <ToggleWrapper>
                                    <ToggleInput
                                        type="checkbox"
                                        name="sal_variavel"
                                        checked={form.sal_variavel}
                                        onChange={handleChange}
                                    />
                                    <ToggleTrack />
                                    <ToggleText>{form.sal_variavel ? "Sim" : "Não"}</ToggleText>
                                </ToggleWrapper>
                            </FieldGroup>
                        </SectionGrid>
                    </SectionCard>

                    <SectionCard>
                        <SectionHeader icon={<FaFileSignature />}>Contratação</SectionHeader>
                        <SectionGrid>
                            <FieldGroup>
                                <FieldLabel required infoKey="tipoContrato" onInfoClick={setInfoAberto}>Regime de contrato</FieldLabel>
                                <select name="tipoContratoId" value={form.tipoContratoId} onChange={handleSelectId}>
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
                                <select name="formacaoAcad" value={form.formacaoAcad} onChange={handleChange}>
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
                                <select name="jornadaId" value={form.jornadaId} onChange={handleSelectId}>
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
                                <select name="motivo" value={form.motivo} onChange={handleChange}>
                                    <option value="">Selecione</option>
                                    <option value="Substituição">Substituição</option>
                                    <option value="Aumento de Quadro">Aumento de Quadro</option>
                                </select>
                            </FieldGroup>

                            {form.motivo === "Substituição" &&
                                <FieldGroup>
                                    <FieldLabel required infoKey="substituido" onInfoClick={setInfoAberto}>Ocupante anterior</FieldLabel>
                                    <select
                                        name="substituidoId"
                                        value={substituidoOutro ? "outro" : (form.substituidoId ?? "")}
                                        onChange={(e) => {
                                            const { value } = e.target;
                                            if (value === "outro") {
                                                setSubstituidoOutro(true);
                                                setForm((prev) => ({ ...prev, substituidoId: null }));
                                            } else {
                                                setSubstituidoOutro(false);
                                                setForm((prev) => ({
                                                    ...prev,
                                                    substituidoId: value === "" ? null : Number(value),
                                                }));
                                            }
                                        }}
                                    >
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
                                <textarea name="atividades" value={form.atividades} onChange={handleChange} maxLength={2000} />
                            </FieldGroup>

                            <FieldGroup $full>
                                <FieldLabel required infoKey="reqHardSkills" onInfoClick={setInfoAberto}>Pré-requisitos técnicos</FieldLabel>
                                <textarea name="reqHardSkills" value={form.reqHardSkills} onChange={handleChange} maxLength={2000} />
                            </FieldGroup>

                            <FieldGroup $full>
                                <FieldLabel required infoKey="reqSoftSkills" onInfoClick={setInfoAberto}>Comportamentos e habilidades</FieldLabel>
                                <textarea name="reqSoftSkills" value={form.reqSoftSkills} onChange={handleChange} maxLength={2000} />
                            </FieldGroup>

                            <FieldGroup $full>
                                <FieldLabel infoKey="informacoes" onInfoClick={setInfoAberto}>Informações relevantes</FieldLabel>
                                <textarea name="informacoes" value={form.informacoes} onChange={handleChange} maxLength={2000} />
                            </FieldGroup>
                        </StackGrid>
                    </SectionCard>

                    <SubmitRow>
                        <CancelButton type="button" onClick={() => navigate("/listavagas")}>Cancelar</CancelButton>
                        <SubmitButton type="submit">Salvar Alterações</SubmitButton>
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
    );
}

export default EditarVagaPage;

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
    gap: 16px;
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

const CancelButton = styled.button`
    padding: 14px 32px;
    font-size: 16px;
    font-weight: 600;
    border: 1px solid #dfe3e8;
    border-radius: 999px;
    background: #fff;
    color: #555;
    transition: background 0.15s ease;

    &:hover {
        background: #f4f6f9;
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
