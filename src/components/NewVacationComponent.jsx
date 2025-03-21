import { useState } from "react";
import styled from "styled-components";


function NewVacationComponent({ name, periodoAquisitivo}) {
    const [date, setDate] = useState({ start: "", end: "" });
    const [totalDays, setTotalDays] = useState(0);
    console.log(periodoAquisitivo);
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
    const handleConfirm = () => {
        const [day, month, year] = periodoAquisitivo.limite.split("/").map(Number);
        const dateLimit = new Date(year, month - 1, day);
        if (date.start >= date.end) {
            alert("A data final das férias deve ser posterior à data inicial");
        }
        else if (totalDays < 10) {
            alert("O período aquisitivo deve ser de no mínimo 10 dias");
        } 
        else if (new Date(date.end) > dateLimit) {
            alert("O período selecionado excede a data limite do período aquisitivo");
        }else {
            alert(
                `Funcionário: ${name}\n` +
                `Período Aquisitivo: de ${periodoAquisitivo.inicio} até ${periodoAquisitivo.fim} \n` +
                `Início das Férias: ${date.start}\n` +
                `Fim das Férias: ${date.end}\n` +
                `Total de Dias: ${totalDays}`
            );
        }
    };

    return (
        <Container>
            <Header>Nome: {name} 
            <br /><br /><br />
            Período Aquisitivo: de {periodoAquisitivo.inicio} até {periodoAquisitivo.fim}
            <br /><br /><br />
            Data Limite: {periodoAquisitivo.limite}
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

                <Button onClick={handleConfirm} disabled={totalDays === 0}>
                    Confirmar
                </Button>
            </Form>
        </Container>
    );
};

export default NewVacationComponent;

const Container = styled.div`
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
  text-align: center;
  gap: 50px;
  margin-bottom: 20px;
`;

const Header = styled.h2`
  margin-bottom: 20px;
  font-size: 18px;
  color: #333;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: bold;
  color: #555;
  text-align: left;
`;

const Input = styled.input`
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
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
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: #218838;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;
