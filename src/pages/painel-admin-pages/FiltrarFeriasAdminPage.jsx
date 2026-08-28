import { useMemo, useState } from "react";
import styled from 'styled-components';
import apiService from "../../services/apiService";
import { useAuth } from "../../contexts/AuthContext";
import { useFuncionarios } from "../../contexts/FuncionariosContext";
import VacationsListComponent from "../../components/vacations/VacationsListComponent";
import HeaderGGNewComponent from "../../components/gentegestao/HeaderGGNewComponent";
import { FaUser, FaCalendarDays, FaFileContract } from "react-icons/fa6";

function FiltrarFeriasAdminPage(){
    const { dados } = useAuth();
    const { dados: dadosFuncionarios } = useFuncionarios();
    const funcionarios = useMemo(() => {
        return [...(dadosFuncionarios?.funcionarios ?? [])].sort((a, b) =>
            `${a.nome} ${a.sobrenome}`.localeCompare(`${b.nome} ${b.sobrenome}`, 'pt-BR', { sensitivity: 'base' })
        );
    }, [dadosFuncionarios]);
    const [activeButton, setActiveButton] = useState(""); //qual filtro vou escolher
    const [selectedEmployee, setSelectedEmployee] = useState(null); //funcionario selecionado
    const [date, setDate] = useState({ start: "", end: "" }); //periodo selecionado
    const [tipoContrato, setTipoContrato] = useState(null); //tipo de contrato selecionado
    const [noData, setNoData] = useState(false);
    const [filteredData, setFilteredData] = useState([]); //responsta da req
    const [showConcluidas, setShowConcluidas] = useState(false); //exibir ou não férias já concluídas

    const tiposContrato = {
        1: "CLT",
        2: "ESTÁGIO",
        3: "PJ",
        4: "COOPERADO"
    };

    const FILTER_TABS = [
        { key: "Funcionário", label: "Funcionário", icon: <FaUser /> },
        { key: "Período", label: "Período", icon: <FaCalendarDays /> },
        { key: "Tipo de Contrato", label: "Tipo de Contrato", icon: <FaFileContract /> },
    ];

    const handleSelect = async (email) => {
        const funcionario = funcionarios.find((f) => f.email === email);
        if (funcionario) {
            try {
                const response = await apiService.getVacation(funcionario.email);
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
            // console.log("filtro Período");
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

    const isConfirmDisabled = (activeButton === "Funcionário" && !selectedEmployee)
        || (activeButton === "Período" && (!date.start || !date.end))
        || (activeButton === "Tipo de Contrato" && !tipoContrato);

    // Sem o toggle ligado, escondemos as férias já concluídas do resultado.
    const displayData = useMemo(() => {
        if (showConcluidas) return filteredData;
        return filteredData.map(item => ({
            ...item,
            Ferias: item.Ferias?.filter(f => f.status !== "Concluído") ?? []
        }));
    }, [filteredData, showConcluidas]);

    return (
        <PageContainer>
                 <HeaderGGNewComponent pageTitle={"Filtrar Férias e Licenças | Admin"} lastPage={"admin"} />
            {dados &&
                <Container>
                    <IntroText>Escolha como deseja filtrar e consulte as férias e licenças dos funcionários.</IntroText>

                    <FilterCard>
                        <TabsRow>
                            {FILTER_TABS.map(({ key, label, icon }) => (
                                <TabButton
                                    key={key}
                                    type="button"
                                    $active={activeButton === key}
                                    onClick={() => { setActiveButton(key); setFilteredData([]); setNoData(false); }}
                                >
                                    {icon}
                                    {label}
                                </TabButton>
                            ))}
                        </TabsRow>

                        {activeButton === "Funcionário" &&
                            <FieldGroup>
                                <FieldLabel>Funcionário</FieldLabel>
                                <Select onChange={(e) => handleSelect(e.target.value)}>
                                    <option value="">-- Escolha um funcionário --</option>
                                    {funcionarios.map((item, index) => (
                                        <option key={index} value={item.email}>
                                            {item.nome} {item.sobrenome}
                                        </option>
                                    ))}
                                </Select>
                            </FieldGroup>
                        }

                        {activeButton === "Período" &&
                            <Form>
                                <FieldGroup>
                                    <FieldLabel>Início</FieldLabel>
                                    <Input
                                        type="date"
                                        value={date.start}
                                        onChange={(e) => handleDateChange("start", e.target.value)}
                                    />
                                </FieldGroup>
                                <FieldGroup>
                                    <FieldLabel>Fim</FieldLabel>
                                    <Input
                                        type="date"
                                        value={date.end}
                                        onChange={(e) => handleDateChange("end", e.target.value)}
                                    />
                                </FieldGroup>
                            </Form>
                        }

                        {activeButton === "Tipo de Contrato" &&
                            <FieldGroup>
                                <FieldLabel>Tipo de Contrato</FieldLabel>
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
                            </FieldGroup>
                        }

                        {activeButton !== "" &&
                            <ToggleRow>
                                <input
                                    id="showConcluidas"
                                    type="checkbox"
                                    checked={showConcluidas}
                                    onChange={(e) => setShowConcluidas(e.target.checked)}
                                />
                                <label htmlFor="showConcluidas">Mostrar férias concluídas</label>
                            </ToggleRow>
                        }

                        {activeButton !== "" &&
                            <ConfirmButton onClick={handleSubmit} disabled={isConfirmDisabled}>
                                Confirmar
                            </ConfirmButton>
                        }
                    </FilterCard>

                    {displayData.length > 0 && (
                        <ResultsCard>
                            <VacationsListComponent
                                filteredData={displayData}
                                activeButton={activeButton} handleSubmit={handleSubmit}
                            />
                        </ResultsCard>
                    )}

                    {noData === true && <StateBox><h3>Sem resultados para a pesquisa.</h3></StateBox>}
                </Container>
            }
        </PageContainer>
    );
};

export default FiltrarFeriasAdminPage;

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
    max-width: 900px;
    text-align: center;
    color: #777;
    font-size: 15px;
`

const Container = styled.div`
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    width: 90%;
    gap: 20px;
    color: #555;
    border: none;
    padding-bottom: 40px;
`;

const FilterCard = styled.div`
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    max-width: 700px;
    gap: 18px;
    padding: 28px 30px;
    border-radius: 20px;
    border: 1px solid #acaaaaff;
    box-shadow: 0px 4px 4px 4px #00000010;
    background: linear-gradient(94.61deg, #FFFFFF 3.73%, #E1E1E1 133.27%);
`

const TabsRow = styled.div`
    flex-wrap: wrap;
    gap: 10px;
`

const TabButton = styled.button`
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex: 1;
    min-width: 150px;
    padding: 12px 18px;
    font-size: 15px;
    font-weight: 600;
    border-radius: 12px;
    background: ${({ $active }) => ($active ? "#E7185A" : "#ffffff")};
    color: ${({ $active }) => ($active ? "#ffffff" : "#E7185A")};
    border: 1px solid ${({ $active }) => ($active ? "#E7185A" : "#dfe3e8")};

    svg {
        font-size: 16px;
    }

    &:hover {
        background: ${({ $active }) => ($active ? "#c5124c" : "#fdecf1")};
    }
`

const FieldGroup = styled.div`
    flex-direction: column;
    align-items: stretch;
    gap: 6px;
    flex: 1;
`;

const FieldLabel = styled.label`
    font-weight: 600;
    font-size: 13px;
    color: #555;
`;

const Select = styled.select`
    box-sizing: border-box;
    width: 100%;
    padding: 12px 14px;
    border-radius: 10px;
    border: 1px solid #dfe3e8;
    background: #fafbfc;
    font-size: 14px;

    &:focus {
        outline: none;
        border-color: #E7185A;
    }
`;

const Form = styled.div`
    gap: 15px;
    width: 100%;

    @media (max-width: 600px) {
        flex-direction: column;
    }
`;

const Input = styled.input`
    box-sizing: border-box;
    width: 100%;
    padding: 12px 14px;
    border: 1px solid #dfe3e8;
    border-radius: 10px;
    background: #fafbfc;
    font-size: 14px;

    &:focus {
        outline: none;
        border-color: #E7185A;
    }
`;

const ToggleRow = styled.div`
    align-items: center;
    gap: 8px;

    input {
        width: 16px;
        height: 16px;
        accent-color: #E7185A;
        cursor: pointer;
    }

    label {
        font-size: 14px;
        color: #555;
        cursor: pointer;
    }
`;

const ConfirmButton = styled.button`
  align-self: flex-end;
  padding: 12px 26px;
  font-size: 15px;
  font-weight: 700;
  background: #E7185A;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: #c5124c;
  }

  &:disabled {
    background: #ccc;
    color: #888;
    cursor: not-allowed;
  }
`;

const ResultsCard = styled.div`
    flex-direction: column;
    width: 100%;
    border-radius: 20px;
    overflow: hidden;
`;

const StateBox = styled.div`
    width: 100%;
    justify-content: center;
    align-items: center;
    padding: 30px 0;
    color: #777;
`
