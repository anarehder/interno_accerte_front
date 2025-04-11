import { useState } from "react";
import styled from 'styled-components';
import apiService from "../services/apiService";
import { useAuth } from "../contexts/AuthContext";

function NewLicenseComponent(){
    const { user, dados } = useAuth();
    const agenda = dados?.agenda;
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [tipoSelecionado, setTiporSelecionado] = useState(null);
    const [date, setDate] = useState({ start: "", end: "" });
    const [totalDays, setTotalDays] = useState(0);
    const tiposLicenca = ["Licença Maternidade", "Licença Paternidade", "Atestado"];

    const handleSelect = async (email) => {
        const funcionario = agenda.find((f) => f.mail === email);
        if (funcionario) {
            try {
                const response = await apiService.getVacation(funcionario.mail);
                if (response.data.length === 0) {
                    alert("Usuário não cadastrado no sistema de férias e escalas");
                    setVacationInfo(null);
                    setSelectedEmployee(null);
                } else {
                    setSelectedEmployee(response.data[0]);
                }
            } catch (error) {
                // console.log(error.message);
                alert(`Ocorreu um erro. Tente novamente, ${error.response.data.message}.`);
            }
        }
    };

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

    const formatDate = (dateStr) => {
      if (!dateStr) return null;
      return new Date(dateStr).toISOString();
    };

    const handleSubmit = async () => {
        if (date.start >= date.end) {
            alert("A data final das licença deve ser posterior à data inicial");
        }

        const body = {
            "adminEmail": user.mail,
            "email": selectedEmployee.email,
            "funcionarioId": selectedEmployee.id,
            "inicio": `${date.start}T00:00:00Z`,
            "fim": `${date.end}T00:00:00Z`,
            "totalDias": totalDays,
            "tipo": tipoSelecionado
        }

        if (
            !body.adminEmail ||
            !body.email ||
            !body.inicio ||
            !body.fim ||
            !body.totalDias ||
            !body.tipo
        ) {
            alert("Todos os campos devem estar preenchidos.");
            return;
        }

        const confirmed = window.confirm(
            `Solicitante: ${user.mail}}\n` +
            `Funcionário: ${selectedEmployee.nome} ${selectedEmployee.sobrenome}\n` +
            `Início da Licença: ${date.start}\n` +
            `Fim da Licença: ${date.end}\n` +
            `Total de Dias: ${totalDays}\n` +
            `tipo: ${tipoSelecionado}`
        );
        if (!confirmed) {
            // Se clicou em "Cancelar", sai da função aqui
            return;
        }
        try {
            const response = await apiService.createLicense(body);
            if (response.statusText === "OK") {
                alert("Período de Licença Inserido com Sucesso!");
            }
        } catch (error) {
            // console.error("Erro ao enviar requisição:", error);
            alert(`Ocorreu um erro. Tente novamente, ${error.response.data.message}.`);
        }
    };

    return (
        <>
            {dados &&
                <Container>
                    <Select onChange={(e) => handleSelect(e.target.value)}>
                        <option value="">-- Escolha um funcionário --</option>
                        {agenda?.map((item, index) => (
                            <option key={index} value={item.mail}>
                                {item.name}
                            </option>
                        ))}
                    </Select>
                    
                    {selectedEmployee && (
                        <>
                            <div>
                                <Label>Tipo de Licença</Label>
                                <Select
                                    onChange={(e) => setTiporSelecionado(e.target.value)}
                                >
                                    <option value="">Selecione...</option>
                                    {tiposLicenca.map((t, index) => (
                                        <option key={index} value={t}>
                                            {t}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                            <Form>
                                <div>
                                    <div>
                                        <Label>Início da Licença:</Label>
                                        <Input
                                            type="date"
                                            value={date.start}
                                            onChange={(e) => handleDateChange("start", e.target.value)}
                                        />
                                    </div><div>
                                        <Label>Fim da Licença:</Label>
                                        <Input
                                            type="date"
                                            value={date.end}
                                            onChange={(e) => handleDateChange("end", e.target.value)}
                                        />
                                    </div>
                                </div>
                                {totalDays > 0 && <TotalDias>Total de dias: {totalDays}</TotalDias>}
                                <Button onClick={handleSubmit} disabled={totalDays === 0}>
                                    Confirmar
                                </Button>
                            </Form>
                        </>
                    )}
                </Container>
            }
        </>
    );
};

export default NewLicenseComponent;

const Container = styled.div`
    width: 60%;
    flex-direction: column;
    align-items: center;
    margin-bottom: 50px;
    padding: 20px;
    gap: 25px;
    div { 
        justify-content: center;
        align-items: center;
        gap: 20px;
        select{
          width: 450px;
        }
    }
`

const Select = styled.select`
  width: 550px;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;


const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  div{
    align-items: center;
    gap: 20px;
    div{
        width: 300px;
    }
  }
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
