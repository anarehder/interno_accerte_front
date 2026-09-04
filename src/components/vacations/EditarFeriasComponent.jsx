import { useState } from "react";
import styled from "styled-components";
import { HiOutlineX } from "react-icons/hi";
import { useAuth } from "../../contexts/AuthContext";
import apiService from "../../services/apiService";

function EditarFeriasComponent({ selected, info, toEdit, setUpdated, setEditarFerias }) {
    const { user } = useAuth();
    const [date, setDate] = useState({ start: "", end: "" });
    const [totalDays, setTotalDays] = useState(0);

    const handleDateChange = (field, value) => {
        const newDate = { ...date, [field]: value };
        setDate(newDate);

        if (newDate.start && newDate.end) {
            const start = new Date(newDate.start);
            const end = new Date(newDate.end);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            setTotalDays(diffDays);
        } else {
            setTotalDays(0);
        }
    };
    const isValid = () => {
        if (!selected?.limite) return false;

        const dataInicio = new Date(date.start);
        const dataFim = new Date(date.end);
        const hoje = new Date();

        const [dia, mes, ano] = selected.limite.split('/');
        const limite = new Date(`${ano}-${mes}-${dia}`);
        limite.setDate(limite.getDate() + 1);

        if (info.Contratos.tipo === "PJ" || info.Contratos.tipo === "COOPERADO") {
            return (
                dataInicio < dataFim &&
                dataFim <= limite &&
                dataInicio > hoje.setDate(hoje.getDate() + 10)
            );
        } else {
            return (
                dataInicio < dataFim &&
                dataFim <= limite &&
                dataInicio > hoje.setDate(hoje.getDate() + 45)
            );
        }

    };

    function weekDay() {
        const startDate = new Date(date.start);
        startDate.setHours(startDate.getHours() + 6);

        const weekDay = startDate.getDay();
        const mondayOrTuesday = weekDay === 1 || weekDay === 2;

        if (mondayOrTuesday) {
            return true;
        }
        return alert("A data de início das férias deve ser sempre na segunda-feira ou terça-feira.");
    }

    function validateVacationLength() {
        if (info.Contratos.tipo === "CLT" || info.Contratos.tipo === "ESTÁGIO") {
            if (totalDays <= 5) {
                alert("Para CLT e Estagiários, o período de férias deve ser maior que 5 dias.");
                return false;
            }
        } else if (info.Contratos.tipo === "PJ" || info.Contratos.tipo === "COOPERADO") {
            if (totalDays !== 10) {
                alert("Para PJ e Cooperados, o período de férias deve ser exatamente 10 dias.");
                return false;
            }
        }
        return true;
    }

    const handleConfirm = async () => {
        if (!weekDay()) {
            return;
        }

        if (!validateVacationLength()) {
            return;
        }

        const confirmed = window.confirm(
            `Funcionário: ${info.nome} ${info.sobrenome}\n` +
            `Período Aquisitivo: de ${selected.inicio} até ${selected.fim} \n` +
            `Início das Férias: ${date.start}\n` +
            `Fim das Férias: ${date.end}\n` +
            `Total de Dias: ${totalDays}`
        );
        if (!confirmed) {
            return;
        }

        const body = {
            "adminEmail": user.mail,
            "ferias": {
                "id": toEdit.id,
                "funcionarioId": toEdit.funcionarioId,
                "inicio": `${date.start}T00:00:00Z`,
                "fim": `${date.end}T00:00:00Z`,
                "totalDias": totalDays,
                "referenteInicio": toEdit.referenteInicio,
                "referenteFim": toEdit.referenteFim,
                "status": "Solicitado"
            }
        }
        try {
            const response = await apiService.editarVacation(body);
            if (response.status === 200) {
                alert("Período de Férias Alterado com Sucesso!");
                setDate({ start: "", end: "" });
                setUpdated(true);
                setEditarFerias([]);
            }
        } catch (error) {
            // console.error("Erro ao enviar requisição:", error);
            alert(`Ocorreu um erro. Tente novamente, ${error.response.data.message}.`);
        }
    };

    return (
        <Container>
            {info &&
                <>
                    <FormHeader>
                        <Title>Editar Período de Férias</Title>
                        <CloseButton onClick={() => setEditarFerias([])} title="Fechar">
                            <HiOutlineX size={18} />
                        </CloseButton>
                    </FormHeader>

                    <InfoGrid>
                        <InfoItem><span>Funcionário</span><strong>{info.nome} {info.sobrenome}</strong></InfoItem>
                        <InfoItem><span>E-mail</span><strong>{info.email}</strong></InfoItem>
                        <InfoItem><span>Período Aquisitivo</span><strong>{selected?.inicio} até {selected?.fim}</strong></InfoItem>
                        <InfoItem><span>Data Limite</span><strong>{selected?.limite}</strong></InfoItem>
                    </InfoGrid>

                    <Form>
                        <FieldGroup>
                            <FieldLabel>Início das Férias</FieldLabel>
                            <Input
                                type="date"
                                value={date.start}
                                onChange={(e) => handleDateChange("start", e.target.value)}
                            />
                        </FieldGroup>
                        <FieldGroup>
                            <FieldLabel>Fim das Férias</FieldLabel>
                            <Input
                                type="date"
                                value={date.end}
                                onChange={(e) => handleDateChange("end", e.target.value)}
                            />
                        </FieldGroup>
                        <TotalTag>{totalDays > 0 ? `${totalDays} dias` : "0 dias"}</TotalTag>
                    </Form>

                    <ActionsRow>
                        <SecondaryButton onClick={() => setEditarFerias([])}>Cancelar</SecondaryButton>
                        <ConfirmButton disabled={!isValid()} onClick={handleConfirm}>Confirmar</ConfirmButton>
                    </ActionsRow>
                </>
            }
            <Hint>Para PJs e Cooperados atentem-se aos 6 meses após o início do período aquisitivo para iniciar nova pausa. A solicitação só pode ser realizada com mais de 10 dias de antecedência.</Hint>
            <Hint>Para CLTs e Estagiários atentem-se aos 12 meses após o início do período aquisitivo para iniciar um período de férias. A solicitação só pode ser realizada com mais de 45 dias de antecedência.</Hint>
        </Container>
    );
};

export default EditarFeriasComponent;

const Container = styled.div`
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    overflow-x: hidden;
    flex-direction: column;
    gap: 22px;
`;

const FormHeader = styled.div`
    width: 100%;
    justify-content: space-between;
    align-items: center;
`;

const Title = styled.h2`
    color: #ED1F4C;
    text-align: left;
    margin: 0;
`;

const CloseButton = styled.button`
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    padding: 0;
    justify-content: center;
    align-items: center;
    border: none;
    border-radius: 50%;
    background: #f1f1f1;
    color: #888;

    &:hover {
        background: #ED1F4C;
        color: white;
    }
`;

const InfoGrid = styled.div`
    width: 100%;
    flex-wrap: wrap;
    gap: 16px;
    padding: 16px 18px;
    border-radius: 14px;
    background: #fdecef;
`;

const InfoItem = styled.div`
    flex-direction: column;
    gap: 4px;
    min-width: 180px;
    flex: 1;
    align-items: flex-start;
    text-align: left;
    span {
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.4px;
        color: #b25166;
    }
    strong {
        font-size: 15px;
        color: #333;
        font-weight: 600;
    }
`;

const Form = styled.div`
    flex-wrap: wrap;
    align-items: center;
    gap: 18px;
`;

const FieldGroup = styled.div`
    flex-direction: column;
    align-items: stretch;
    gap: 6px;
    flex: 0 1 170px;
    min-width: 150px;
`;

const FieldLabel = styled.label`
    font-weight: 600;
    font-size: 13px;
    color: #555;
    text-align: left;
`;

const Input = styled.input`
    box-sizing: border-box;
    width: 100%;
    padding: 12px 14px;
    border-radius: 10px;
    border: 1px solid #dfe3e8;
    background: #fafbfc;
    font-size: 14px;

    &:focus {
        outline: none;
        border-color: #ED1F4C;
    }
`;

const TotalTag = styled.span`
    display: inline-flex;
    justify-content: center;
    align-self: flex-end;
    min-width: 76px;
    padding: 8px 18px;
    font-size: 14px;
    font-weight: 700;
    border-radius: 999px;
    border: 1px solid #ED1F4C;
    color: #ED1F4C;
    background: #fdecef;
    white-space: nowrap;
`;

const ActionsRow = styled.div`
    justify-content: flex-end;
    gap: 10px;
`;

const SecondaryButton = styled.button`
    padding: 12px 22px;
    font-size: 14px;
    font-weight: 700;
    border-radius: 999px;
    background: white;
    color: #555;
    border: 1px solid #ccc;

    &:hover {
        background: #f1f1f1;
    }
`;

const ConfirmButton = styled.button`
    padding: 12px 26px;
    font-size: 14px;
    font-weight: 700;
    border-radius: 999px;
    border: none;
    color: white;
    background: linear-gradient(135deg, #ff5843, #ED1F4C);
    box-shadow: 0 6px 16px rgba(237, 31, 76, 0.3);
    transition: transform 0.15s ease, box-shadow 0.15s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(237, 31, 76, 0.4);
    }

    &:disabled {
        background: #ccc;
        color: #888;
        box-shadow: none;
        transform: none;
        cursor: not-allowed;
    }
`;

const Hint = styled.p`
    font-size: 13px;
    color: #888;
    text-align: left;
    margin: 0;
    margin-bottom: 10px;
`;
