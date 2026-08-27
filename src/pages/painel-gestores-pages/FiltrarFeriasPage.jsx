import { useCallback, useEffect, useState } from "react";
import styled from 'styled-components';
import apiService from "../../services/apiService";
import { useAuth } from "../../contexts/AuthContext";
import VacationsListGestorComponent from "../../components/gestores/VacationsListGestorComponent";
import HeaderImageComponent from "../../components/basic/HeaderImageComponent";
import FiltrarFerias from '../../assets/painel-gestores/filtrar-ferias.png';
import { FaUser, FaCalendarDays } from "react-icons/fa6";

// Usuários de teste não têm área própria: usam o e-mail de um gestor real como fallback.
const TEST_USERS = ["daniel.garcia@accerte.com.br", "ana.rehder@accerte.com.br"];
const TEST_FALLBACK_EMAIL = "ronildo.gama@accerte.com.br";

function FiltrarFeriasPage(){
    const { user, dados } = useAuth();
    const agenda = dados?.agenda;
    const [activeButton, setActiveButton] = useState(""); //qual filtro vou escolher
    const [selectedEmployee, setSelectedEmployee] = useState(null); //funcionario selecionado
    const [date, setDate] = useState({ start: "", end: "" }); //periodo selecionado
    const [noData, setNoData] = useState(false);
    const [filteredData, setFilteredData] = useState([]); //responsta da req
    const [funcionarios, setFuncionarios] = useState([]);

    const FILTER_TABS = [
        { key: "Funcionário", label: "Funcionário", icon: <FaUser /> },
        { key: "Período", label: "Período", icon: <FaCalendarDays /> },
    ];

    const buildAdminEmailBody = useCallback(() => ({
        adminEmail: TEST_USERS.includes(user?.mail) ? TEST_FALLBACK_EMAIL : user?.mail
    }), [user]);

    useEffect(() => {
            if (!user) return;
            const fetchScale = async () => {
                try {
                    const body = buildAdminEmailBody();
                    const response = await apiService.buscarFuncionarioPorArea(body);
                    setFuncionarios(response.data);
                } catch (error) {
                    console.error("Erro ao buscar informacoes vagas:", error);
                }
            };

            fetchScale();

        }, [user, buildAdminEmailBody]);

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
        if(activeButton === 'Funcionário'){
            try {
                const body = buildAdminEmailBody();
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
            if (!date.start || !date.end) {
                alert("Preencha corretamente as datas");
            }
            if (date.start >= date.end) {
                alert("A data final deve ser posterior à data inicial");
            }
            try {
                const body = buildAdminEmailBody();
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
    };

    const isConfirmDisabled = (activeButton === "Funcionário" && !selectedEmployee)
        || (activeButton === "Período" && (!date.start || !date.end));

    return (
        <PageContainer>
            <HeaderImageComponent pageTitle={"Filtrar"} subtitle={"Férias"} lastPage={"painelgestores"} image={FiltrarFerias} />
            {dados &&
                <Container>
                    <IntroText>Escolha como deseja filtrar e consulte as férias da sua área.</IntroText>

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
                                {funcionarios.length > 0 ? (
                                    <Select onChange={(e) => handleSelect(e.target.value)}>
                                        <option value="">-- Escolha um funcionário --</option>
                                        {funcionarios?.map((item, index) => (
                                            <option key={index} value={item.email}>
                                                {item.nome} {item.sobrenome}
                                            </option>
                                        ))}
                                    </Select>
                                ) : (
                                    <EmptyHint>Nenhum funcionário disponível.</EmptyHint>
                                )}
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

                        {activeButton !== "" &&
                            <ConfirmButton onClick={handleSubmit} disabled={isConfirmDisabled}>
                                Buscar férias
                            </ConfirmButton>
                        }
                    </FilterCard>

                    {filteredData.length > 0 && (
                        <ResultsCard>
                            <VacationsListGestorComponent
                                filteredData={filteredData}
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
`

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
    background: ${({ $active }) => ($active ? "#0057E1" : "#ffffff")};
    color: ${({ $active }) => ($active ? "#ffffff" : "#0057E1")};
    border: 1px solid ${({ $active }) => ($active ? "#0057E1" : "#dfe3e8")};

    svg {
        font-size: 16px;
    }

    &:hover {
        background: ${({ $active }) => ($active ? "#0046ba" : "#eef4ff")};
    }
`

const EmptyHint = styled.p`
    text-align: left;
    color: #888;
    font-size: 14px;
    margin: 0;
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
        border-color: #0057E1;
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
        border-color: #0057E1;
    }
`;

const ConfirmButton = styled.button`
  align-self: flex-end;
  padding: 12px 26px;
  font-size: 15px;
  font-weight: 700;
  background: #0057E1;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: #0046ba;
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
