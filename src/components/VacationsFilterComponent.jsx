import { useState } from "react";
import styled from 'styled-components';
import apiService from "../services/apiService";
import { useAuth } from "../contexts/AuthContext";
import VacationsListComponent from "./VacationsListComponent";

function VacationsFilterComponent(){
    const { dados } = useAuth();
    const agenda = dados?.agenda;
    const [activeButton, setActiveButton] = useState(""); //qual filtro vou escolher
    const [selectedEmployee, setSelectedEmployee] = useState(null); //funcionario selecionado
    const [date, setDate] = useState({ start: "", end: "" }); //periodo selecionado
    const [tipoContrato, setTipoContrato] = useState(null); //tipo de contrato selecionado
    const [noData, setNoData] = useState(false);
    const [filteredData, setFilteredData] = useState([]); //responsta da req

    const tiposContrato = {
        1: "CLT",
        2: "ESTÁGIO",
        3: "PJ",
    };

    const handleSelect = async (email) => {
        const funcionario = agenda.find((f) => f.mail === email);
        if (funcionario) {
            try {
                const response = await apiService.getVacation(funcionario.mail);
                if (response.data.length === 0) {
                    alert("Usuário não cadastrado no sistema de férias e escalas");
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

    };

    const handleSubmit = async () => {
        //2025-07-01 formato do inicio e fim
        if(activeButton === 'Funcionário'){
            console.log("filtro funcionario");
            try {
                const response = await apiService.getVacationByEmail(selectedEmployee.email);
                if (response.statusText === "OK") {
                    setFilteredData(response.data);
                    setNoData(false);
                    if(response.data.length === 0) setNoData(true);
                }
            } catch (error) {
                // console.error("Erro ao enviar requisição:", error);
                alert(`Ocorreu um erro. Tente novamente, ${error.response.data.message}.`);
            }
        }
        if(activeButton === 'Período'){
            console.log("filtro Período");
            if (!date.start || !date.end) {
                alert("Preencha corretamente as datas");
            }
            if (date.start >= date.end) {
                alert("A data final das licença deve ser posterior à data inicial");
            }
            try {
                const response = await apiService.getVacationByPeriod(date.start, date.end);
                if (response.statusText === "OK") {
                    setFilteredData(response.data);
                    setNoData(false);
                    if(response.data.length === 0) setNoData(true);
                }
            } catch (error) {
                // console.error("Erro ao enviar requisição:", error);
                alert(`Ocorreu um erro. Tente novamente, ${error.response.data.message}.`);
            }
        }
        if(activeButton === 'Tipo de Contrato'){
            console.log("filtro Tipo de Contrato");
            try {
                const response = await apiService.getVacationByContract(tipoContrato);
                if (response.statusText === "OK") {
                    setFilteredData(response.data);
                    setNoData(false);
                    if(response.data.length === 0) setNoData(true);
                }
            } catch (error) {
                // console.error("Erro ao enviar requisição:", error);
                alert(`Ocorreu um erro. Tente novamente, ${error.response.data.message}.`);
            }
        }

        
    };

    return (
        <>
            {dados &&
                <Container>
                    <OpContainer>
                            <Button onClick={() => {setActiveButton("Funcionário"); setFilteredData([]);}} active={activeButton === "Funcionário" ? "show" : ""}>Funcionário</Button>
                            <Button onClick={() => {setActiveButton("Período"); setFilteredData([]);}} active={activeButton === "Período" ? "show" : ""}>Período</Button>
                            <Button onClick={() => {setActiveButton("Tipo de Contrato"); setFilteredData([]);}} active={activeButton === "Tipo de Contrato" ? "show" : ""}>Tipo de Contrato</Button>
                    </OpContainer>
                    <OpContainer>
                        {activeButton === "Funcionário" &&
                            <OpContainer>
                                <Select onChange={(e) => handleSelect(e.target.value)}>
                                    <option value="">-- Escolha um funcionário --</option>
                                    {agenda?.map((item, index) => (
                                        <option key={index} value={item.mail}>
                                            {item.name}
                                        </option>
                                    ))}
                                </Select>
                            </OpContainer>
                        }
                        {activeButton === "Período" &&
                            <Form>
                                <OpContainer>
                                    <Label>Início:</Label>
                                    <Input
                                        type="date"
                                        value={date.start}
                                        onChange={(e) => handleDateChange("start", e.target.value)}
                                    />
                                </OpContainer><OpContainer>
                                    <Label>Fim:</Label>
                                    <Input
                                        type="date"
                                        value={date.end}
                                        onChange={(e) => handleDateChange("end", e.target.value)}
                                    />
                                </OpContainer>
                            </Form>
                        }
                        {activeButton === "Tipo de Contrato" &&
                            <OpContainer>
                                <Select
                                    value={tipoContrato}
                                    onChange={(e) => setTipoContrato(e.target.value)}
                                >
                                    <option value="">-- Escolha um tipo de contrato --</option>
                                    {Object.entries(tiposContrato).map(([id, nome]) => (
                                        <option key={id} value={nome}>
                                            {nome}
                                        </option>
                                    ))}
                                </Select>
                            </OpContainer>
                        }
                        {activeButton !== "" &&
                            <ConfirmButton onClick={handleSubmit} disabled={activeButton === "Funcionário" && !selectedEmployee || activeButton === "Período" && (!date.start || !date.end) || activeButton === "Tipo de Contrato" && !tipoContrato}>
                                Confirmar
                            </ConfirmButton>
                        }
                    </OpContainer>
                    {filteredData.length > 0 && <VacationsListComponent filteredData={filteredData} activeButton={activeButton} />}
                    
                    {noData === true && <h2>Sem resultados para a pesquisa </h2>}
                </Container>
            }
        </>
    );
};

export default VacationsFilterComponent;

const Container = styled.div`
    width: 90%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 50px;
    padding: 20px;
    gap: 25px;
    div { 
        select{
          width: 450px;   
        }
    }
`;

const OpContainer = styled.div`
    align-items: center;
    justify-content: space-between;
    max-width: 650px;
    min-height: 60px;
`;


const Select = styled.select`
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;


const Form = styled.div`
  display: flex;
  width: 700px;
  gap: 15px;
  div{
    justify-content: center;
    gap: 8px;
  }
`;

const Label = styled.label`
  font-weight: bold;
  color: #555;
  text-align: right;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;


const Button = styled.button`
    text-align: center;
    width: 200px;
    justify-content: center;
    font-weight: 700;
    background-color: ${({ active }) => (active  === 'show' ? "#ff5843" : "transparent")};
    color: ${({ active }) => (active === 'show' ? "white" : "#ff5843")};
    border: ${({ active }) => (active === 'show' ? "3px solid #ff5843" : "3px solid #ff5843")};
    &:hover {
        background-color: ${({ active }) => (active === 'show' ? "#ff5843" : "white")
    };
`;

const ConfirmButton = styled.button`
  padding: 10px;
  font-size: 16px;
  font-weight: bold;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
  margin-left: 15px;
  &:hover {
    background-color: #218838;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;
