import { useState } from "react";
import styled from "styled-components";
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
        const dataInicio = new Date(date.start);
        const dataFim = new Date(date.end);

        const [dia, mes, ano] = selected.limite.split('/');
        const limite = new Date(`${ano}-${mes}-${dia}`);
        limite.setDate(limite.getDate() + 1);

        return (
            dataInicio < dataFim &&
            totalDays >= 10 &&
            dataFim <= limite
        );
    };

    const handleConfirm = async () => {

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
                "referenteFim": toEdit.referenteFim
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
                <SelectContainer>
                    <Header>
                        <div>
                            Nome:<br /> {info.nome}
                            <br /><br /><br />
                            E-mail: {info.email}
                            <br /><br /><br />
                            Período Aquisitivo: <br />de {selected?.inicio} até {selected?.fim}
                            <br /><br /><br />
                            Data Limite: {selected?.limite}
                        </div>

                        <Button onClick={() => setEditarFerias([])}> Fechar Edição </Button>
                    </Header>
                    <Form>
                        <Label>Início das Férias:</Label>
                        <Input
                            type="date"
                            value={date.start}
                            onChange={(e) => handleDateChange("start", e.target.value)}
                        />

                        <Label>Fim das Férias:</Label>
                        <Input
                            type="date"
                            value={date.end}
                            onChange={(e) => handleDateChange("end", e.target.value)}
                        />

                        {totalDays > 0 && <TotalDias>Total de dias: {totalDays}</TotalDias>}
                        <Button disabled={!isValid()} onClick={handleConfirm}> Confirmar</Button>
                    </Form>
                </SelectContainer>
            }
            <p>Para PJs e Cooperados atentem-se aos 6 meses após o início do período aquisitivo para iniciar nova pausa.</p>
            <p>Para CLTs e Estagiários atentem-se aos 12 meses após o início do período aquisitivo para iniciar um período de férias.</p>
        </Container>
    );
};

export default EditarFeriasComponent;

const Container = styled.div`
  max-width: 90%;
  margin: auto;
  height: 350px;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  gap: 30px;
  margin-bottom: 50px;
  align-items: center;
  flex-direction: column;
  p{
    font-size:15px;
  }
`;

const Header = styled.h2`
    height: 350px;
    margin-bottom: 20px;
    font-size: 18px;
    color: #333;
    text-align: left;
    width: 55%;
    align-items: space-between;
    div{
        margin: 25px 0;
    }
    button {
        margin-top: 20px;
    }
`;

const SelectContainer = styled.div`
  justify-content: space-between;
  width: 600px;
`

const Form = styled.div`
    flex-direction: column;
    height: 350px;
    width: 40%;
`;

const Label = styled.label`
  font-weight: bold;
  color: #555;
  text-align: left;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  height: 30px;
  font-size: 18px;
`;

const TotalDias = styled.p`
  font-size: 16px;
  font-weight: bold;
  color: #007bff;
  margin: 10px 0;
`;

const Button = styled.button`
  padding: 10px;
  font-size: 16px;
  font-weight: bold;
  background-color: #28a745;
  border: 2px solid #218838;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: #218838;
    border: 2px solid #218838;
  }

  &:disabled {
    background-color: #ccc;
    border: 2px solid #ccc;
    cursor: not-allowed;
  }
`;
