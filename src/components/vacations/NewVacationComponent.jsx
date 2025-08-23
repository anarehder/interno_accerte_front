import { useState } from "react";
import styled from "styled-components";
import { useAuth } from "../../contexts/AuthContext";
import apiService from "../../services/apiService";
import gerarFerias from "../../services/vacationGenerate";

function NewVacationComponent() {
  const { user, dados } = useAuth();
  const [date, setDate] = useState({ start: "", end: "" });
  const agenda = dados?.agenda;
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [admissao, setAdmissao] = useState("");
  const [vacationInfo, setVacationInfo] = useState(null);
  const [feriasDisponiveis, setFeriasDisponiveis] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(-1);
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

  const handleSelect = async (email) => {
    setSelectedPeriod(-1)
    const funcionario = agenda.find((f) => f.mail === email);
    if (funcionario) {
      setSelectedEmployee(funcionario);
      try {
        const response = await apiService.getVacation(funcionario.mail);
        if (response.data.length === 0) {
          alert("Usuário não cadastrado no sistema de férias e escalas");
          setVacationInfo(null);
          setFeriasDisponiveis(null);
          setSelectedEmployee(null);
          setSelectedPeriod(-1);
          setAdmissao("");
        } else {
          setVacationInfo(response.data[0]);
          const dataOriginal = new Date(response.data[0].admissao);
          dataOriginal.setDate(dataOriginal.getDate() + 1); // adiciona 1 dia
          const admissao = dataOriginal.toLocaleDateString("pt-BR");
          setAdmissao(admissao);
          const feriasDatas = gerarFerias(admissao);
          setFeriasDisponiveis(feriasDatas);
        }
      } catch (error) {
        // console.log(error.message);
        alert(`Ocorreu um erro. Tente novamente, ${error.response.data.message}.`);
      }
    }
  };

  const handleConfirm = async () => {
    const [day, month, year] = feriasDisponiveis[selectedPeriod].limite.split("/").map(Number);
    const dateLimit = new Date(year, month - 1, day);
    if (date.start >= date.end) {
      alert("A data final das férias deve ser posterior à data inicial");
    }
    else if (totalDays < 10) {
      alert("O período aquisitivo deve ser de no mínimo 10 dias");
    }
    else if (new Date(date.end) > dateLimit) {
      alert("O período selecionado excede a data limite do período aquisitivo");
    } else {
      const confirmed = window.confirm(
        `Funcionário: ${vacationInfo.nome} ${vacationInfo.sobrenome}\n` +
        `Período Aquisitivo: de ${feriasDisponiveis[selectedPeriod].inicio} até ${feriasDisponiveis[selectedPeriod].fim} \n` +
        `Início das Férias: ${date.start}\n` +
        `Fim das Férias: ${date.end}\n` +
        `Total de Dias: ${totalDays}`
      );
      if (!confirmed) {
        // Se clicou em "Cancelar", sai da função aqui
        return;
      }
    }
    const [dayS, monthS, yearS] = feriasDisponiveis[selectedPeriod].inicio.split("/").map(Number);
    const [dayE, monthE, yearE] = feriasDisponiveis[selectedPeriod].fim.split("/").map(Number);
    const body = {
      "adminEmail": user.mail,
      "ferias": {
        "funcionarioId": vacationInfo.id,
        "inicio":  `${date.start}T00:00:00Z`,
        "fim": `${date.end}T00:00:00Z`,
        "totalDias": totalDays,
        "referenteInicio": `${yearS}-${monthS.toString().padStart(2, '0')}-${dayS.toString().padStart(2, '0')}T00:00:00Z`,
        "referenteFim": `${yearE}-${monthE.toString().padStart(2, '0')}-${dayE.toString().padStart(2, '0')}T00:00:00Z`
      }
    }

    try {
      const response = await apiService.createVacation(body);
      if (response.statusText === "OK") {
        alert("Período de Férias Inserido com Sucesso!");
        selectedPeriod(-1);
        setDate({ start: "", end: "" });
      }
    } catch (error) {
      // console.error("Erro ao enviar requisição:", error);
      alert(`Ocorreu um erro. Tente novamente, ${error.response.data.message}.`);
    }
  };

  return (
    <Container>
      {dados &&
        <Select onChange={(e) => handleSelect(e.target.value)}>
          <option value="">-- Escolha um funcionário --</option>
          {agenda?.map((item, index) => (
            <option key={index} value={item.mail}>
              {item.name}
            </option>
          ))}
        </Select>
      }
      {feriasDisponiveis &&
        <ButtonsContainer>
          {feriasDisponiveis.map((periodo, index) => (
            <PeriodButton key={index} onClick={() => setSelectedPeriod(index)} active={feriasDisponiveis[selectedPeriod]?.inicio === periodo.inicio ? "show" : ""}>
              {`${periodo.inicio} - ${periodo.fim}`}
            </PeriodButton>
          ))}
        </ButtonsContainer>
      }
      {feriasDisponiveis && selectedPeriod >= 0 && selectedEmployee &&
        <SelectContainer>
          <Header>Nome:<br /> {selectedEmployee.name}
            <br /><br /><br />
            E-mail: {selectedEmployee.mail}
            <br /><br /><br />
            Período Aquisitivo: <br />de {feriasDisponiveis[selectedPeriod].inicio } até {feriasDisponiveis[selectedPeriod].fim }
            <br /><br /><br />
            Data Limite: {feriasDisponiveis[selectedPeriod].limite}
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
        </SelectContainer>
      }
    </Container>
  );
};

export default NewVacationComponent;

const Container = styled.div`
  max-width: 90%;
  margin: auto;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  gap: 30px;
  margin-bottom: 50px;
  align-items: center;
  flex-direction: column;
`;

const Header = styled.h2`
  margin-bottom: 20px;
  font-size: 18px;
  color: #333;
  text-align: left;
  width: 55%;
`;


const Select = styled.select`
  width: 550px;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const SelectContainer = styled.div`
  justify-content: space-between;
  width: 600px;
`

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 40%;
  justify-content: center;
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
`;

const TotalDias = styled.p`
  font-size: 16px;
  font-weight: bold;
  color: #007bff;
  margin: 10px 0;
`;

const ButtonsContainer = styled.div`
  width: 95%;
  justify-content: center;
  gap: 25px;
  flex-wrap: wrap;
`
  
const PeriodButton = styled.button`
    text-align: center;
    width: 220px;
    justify-content: center;
    font-weight: 700;
    font-size: 15px;
    background-color: ${({ active }) => (active  === 'show' ? "#ff5843" : "transparent")};
    color: ${({ active }) => (active === 'show' ? "white" : "#ff5843")};
    border: 3px solid #ff5843;
    &:hover {
        background-color: ${({ active }) => (active === 'show' ? "#ff5843" : "white")
    };
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
