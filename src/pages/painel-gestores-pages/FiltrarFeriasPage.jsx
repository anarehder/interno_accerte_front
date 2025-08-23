import { useEffect, useState } from "react";
import styled from 'styled-components';
import apiService from "../../services/apiService";
import { useAuth } from "../../contexts/AuthContext";
import VacationsListGestorComponent from "../../components/gestores/VacationsListGestorComponent";
import HeaderImageComponent from "../../components/basic/HeaderImageComponent";
import FiltrarFerias from '../../assets/painel-gestores/filtrar-ferias.png';

function FiltrarFeriasPage(){
    const { user, dados } = useAuth();
    const agenda = dados?.agenda;
    const [activeButton, setActiveButton] = useState(""); //qual filtro vou escolher
    const [selectedEmployee, setSelectedEmployee] = useState(null); //funcionario selecionado
    const [date, setDate] = useState({ start: "", end: "" }); //periodo selecionado
    const [tipoContrato, setTipoContrato] = useState(null); //tipo de contrato selecionado
    const [noData, setNoData] = useState(false);
    const [filteredData, setFilteredData] = useState([]); //responsta da req
    const [funcionarios, setFuncionarios] = useState([]);

    const tiposContrato = {
        1: "CLT",
        2: "ESTÁGIO",
        3: "PJ",
        4: "COOPERADO"
    };

    useEffect(() => {
            if (!user) return;
            const fetchScale = async () => {
                try {
                    if(user.mail === "daniel.garcia@accerte.com.br" || user.mail === ("ana.rehder@accerte.com.br")){
                        const body = {"adminEmail": "rodrigo.mouzinho@accerte.com.br"};
                        const response = await apiService.buscarFuncionarioPorArea(body);
                        setFuncionarios(response.data);
                    }
                    else{
                        const body = {"adminEmail": user.mail};
                        const response = await apiService.buscarFuncionarioPorArea(body);
                        setFuncionarios(response.data);
                    }
                } catch (error) {
                    console.error("Erro ao buscar informacoes vagas:", error);
                }
            };
    
            fetchScale();
    
        }, [user]);
    //buscar gestores e filtrar por gestor
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
            // console.log("filtro funcionario");
            try {
                let body = { "adminEmail": "" }
                if (user.mail === "daniel.garcia@accerte.com.br" || user.mail === ("ana.rehder@accerte.com.br")) {
                    body = { "adminEmail": "rodrigo.mouzinho@accerte.com.br" };
                }
                else {
                    body = { "adminEmail": user.mail };
                }
                const response = await apiService.getVacationAreaByEmail(selectedEmployee.email, body);
                if (response.statusText === "OK") {
                    setFilteredData(response.data);
                    setNoData(false);
                    if (response.data.length === 0) setNoData(true);
                }
            } catch (error) {
                // console.error("Erro ao enviar requisição:", error);
                alert(`Ocorreu um erro. Tente novamente, ${error.response.data.message}.`);
            }
        }
        if(activeButton === 'Período'){
            // console.log("filtro Período");
            if (!date.start || !date.end) {
                alert("Preencha corretamente as datas");
            }
            if (date.start >= date.end) {
                alert("A data final deve ser posterior à data inicial");
            }
            try {
                let body = { "adminEmail": "" }
                if (user.mail === "daniel.garcia@accerte.com.br" || user.mail === ("ana.rehder@accerte.com.br")) {
                    body = { "adminEmail": "rodrigo.mouzinho@accerte.com.br" };
                }
                else {
                    body = { "adminEmail": user.mail };
                }
                // console.log(body);
                const response = await apiService.getVacationAreaByPeriod(date.start, date.end, body);
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
            // console.log("filtro Tipo de Contrato");
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
        <PageContainer>
            <HeaderImageComponent pageTitle={"Filtrar"} subtitle={"Férias"} lastPage={"painelgestores"} image={FiltrarFerias} />
            {dados &&
                <Container>
                    <OpContainer>
                            <Button onClick={() => {setActiveButton("Funcionário"); setFilteredData([]);}} active={activeButton === "Funcionário" ? "show" : ""}>Funcionário</Button>
                            <Button onClick={() => {setActiveButton("Período"); setFilteredData([]);}} active={activeButton === "Período" ? "show" : ""}>Período</Button>
                    </OpContainer>
                    <OpContainer>
                        {activeButton === "Funcionário" && funcionarios.length>0 &&
                            <OpContainer>
                                <Select onChange={(e) => handleSelect(e.target.value)}>
                                    <option value="">-- Escolha um funcionário --</option>
                                    {funcionarios?.map((item, index) => (
                                        <option key={index} value={item.email}>
                                            {item.nome} {item.sobrenome}
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
                    {filteredData.length > 0 && (
                        <VacationsListGestorComponent
                            filteredData={filteredData}
                            activeButton={activeButton} handleSubmit={handleSubmit}
                        />
                    )}

                    {noData === true && <h2>Sem resultados para a pesquisa </h2>}
                </Container>
            }
        </PageContainer>
    );
};

export default FiltrarFeriasPage;

const PageContainer = styled.div`
    width: 100%;
    min-height: 100%;
    flex-direction: column;
    align-items: center;
    position: absolute;
    gap: 20px;
    color:rgb(75, 74, 75);
`

const Container = styled.div`
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    gap: 10px;
    color: #555;
    border: none;
    h2 {
        margin: 10px 0;
    }
    select{
        width: 450px;
    }
}
`
const OpContainer = styled.div`
    align-items: center;
    justify-content: space-between;
    max-width: 600px;
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
    background-color: ${({ active }) => (active  === 'show' ? "#0057E1" : "transparent")};
    color: ${({ active }) => (active === 'show' ? "white" : "#0057E1")};
    border: ${({ active }) => (active === 'show' ? "3px solid #0057E1" : "3px solid #0057E1")};
    &:hover {
        background-color: ${({ active }) => (active === 'show' ? "#0057E1" : "white")
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
