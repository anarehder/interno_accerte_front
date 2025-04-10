import { useState } from "react";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import apiService from "../services/apiService";

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

  const gerarFerias = (admissao) => {
    // Transformar a data de admissão em um objeto Date
    const [dia, mes, ano] = admissao.split('/');
    const dataAdmissao = new Date(mes + '/' + dia + '/' + ano);

    // Obter a data atual
    const dataAtual = new Date();

    // Calcular o próximo ano (ano seguinte)
    const ferias = [];

    // Gerar período de férias até o ano atual
    while (dataAdmissao <= dataAtual) {
      let fimFerias = new Date(dataAdmissao);
      fimFerias.setFullYear(fimFerias.getFullYear() + 1);
      fimFerias.setDate(fimFerias.getDate() - 1);
      let limiteFerias = new Date(dataAdmissao);
      limiteFerias.setFullYear(fimFerias.getFullYear() + 2);
      limiteFerias.setDate(fimFerias.getDate() - 45);

      ferias.push({
        inicio: dataAdmissao.toLocaleDateString(),
        fim: fimFerias.toLocaleDateString(),
        limite: limiteFerias.toLocaleDateString(),
      });

      // Incrementar a data de admissão para o próximo período
      dataAdmissao.setFullYear(dataAdmissao.getFullYear() + 1);
    }

    return ferias;
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
        `Funcionário: ${vacationInfo.name} ${vacationInfo.sobrenome}\n` +
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
  max-width: 600px;
  margin: auto;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
  text-align: center;
  gap: 30px;
  margin-bottom: 20px;
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
`

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 40%;
  justify-content: center;
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

const ButtonsContainer = styled.div`
    justify-content: center;
    gap: 50px;
`
  
const PeriodButton = styled.button`
    text-align: center;
    width: 250px;
    justify-content: center;
    font-weight: 700;
    font-size: 15px;
    background-color: ${({ active }) => (active  === 'show' ? "#ff5843" : "transparent")};
    color: ${({ active }) => (active === 'show' ? "white" : "#ff5843")};
    border: ${({ active }) => (active === 'show' ? "3px solid #ff5843" : "3px solid #ff5843")};
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
