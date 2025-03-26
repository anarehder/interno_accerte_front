import styled from 'styled-components';
import TitleComponent from '../components/TitleComponent';
import { useState } from 'react';
import IntranetHeaderComponent from '../components/IntranetHeaderComponent';
import NewVacationComponent from '../components/NewVacationComponent';

function VacationsAdminPage() {
    const info = { "admissao": "15/01/2023", "tipo": "CLT", "annualVacation": "30 dias" };
    const types = ["CLT", "PJ", "ESTAGIÁRIOS"];
    const vacations = {
        "1": [
            {
                "inicio": "07/05/2023",
                "fim": "16/05/2023",
                "totalDias": 10,
                "status": "concluído"
            },
            {
                "inicio": "20/11/2023",
                "fim": "29/11/2023",
                "totalDias": 10,
                "status": "concluído"
            },
            {
                "inicio": "10/01/2024",
                "fim": "19/01/2024",
                "totalDias": 10,
                "status": "concluído"
            }
        ],
        "2": [
            {
                "inicio": "01/07/2024",
                "fim": "10/07/2024",
                "totalDias": 10,
                "status": "concluído"
            },
            {
                "inicio": "05/09/2024",
                "fim": "14/09/2024",
                "totalDias": 10,
                "status": "concluído"
            }
        ],
        "3": [
            {
                "inicio": "05/07/2025",
                "fim": "14/07/2025",
                "totalDias": 10,
                "status": "agendado"
            },
            {
                "inicio": "01/09/2025",
                "fim": "10/09/2025",
                "totalDias": 10,
                "status": "solicitado"
            }
        ]
    };
    const ferias = [
        {
          QDT: 1,
          NOME: "ANA KAROLINA PEREIRA E SILVA",
          DATA_ADMISSAO: "09/12/2024",
          INICIO_PERIODO_AQUISITIVO: "09/12/2024",
          FIM_PERIODO_AQUISITIVO: "05/12/2025",
          LIMITE_PARA_GOZO: "06/11/2026",
          DIAS: 30,
          FERIAS_DATA_INICIO: "02/03/2026",
          FERIAS_DATA_TERMINO: "16/03/2026",
          DIAS_FERIAS: 14
        },
        {
          QDT: 2,
          NOME: "CARLENE CRISTINA DE PAULA QUEIROZ",
          DATA_ADMISSAO: "25/11/2024",
          INICIO_PERIODO_AQUISITIVO: "25/11/2024",
          FIM_PERIODO_AQUISITIVO: "19/11/2025",
          LIMITE_PARA_GOZO: "21/10/2026",
          DIAS: 30,
          FERIAS_DATA_INICIO: "05/01/2026",
          FERIAS_DATA_TERMINO: "19/01/2026",
          DIAS_FERIAS: 14
        },
        {
          QDT: 4,
          NOME: "DEBORA CAMILA DA SILVA GUIMARAES",
          DATA_ADMISSAO: "03/01/2022",
          INICIO_PERIODO_AQUISITIVO: "29/12/2023",
          FIM_PERIODO_AQUISITIVO: "22/12/2024",
          LIMITE_PARA_GOZO: "23/11/2025",
          DIAS: 30,
          FERIAS_DATA_INICIO: "02/06/2025",
          FERIAS_DATA_TERMINO: "21/06/2025",
          DIAS_FERIAS: 19
        },
        {
          QDT: 11,
          NOME: "PEDRO HENRIQUE DAVID SILVA",
          DATA_ADMISSAO: "08/04/2024",
          INICIO_PERIODO_AQUISITIVO: "08/04/2024",
          FIM_PERIODO_AQUISITIVO: "02/04/2025",
          LIMITE_PARA_GOZO: "04/03/2026",
          DIAS: 30,
          FERIAS_DATA_INICIO: "22/04/2025",
          FERIAS_DATA_TERMINO: "07/05/2025",
          DIAS_FERIAS: 15
        },
        {
          QDT: 12,
          NOME: "RAFAEL AUGUSTO SILVA CARDOSO",
          DATA_ADMISSAO: "19/08/2024",
          INICIO_PERIODO_AQUISITIVO: "19/08/2024",
          FIM_PERIODO_AQUISITIVO: "13/08/2025",
          LIMITE_PARA_GOZO: "15/07/2026",
          DIAS: 30,
          FERIAS_DATA_INICIO: "30/08/2025",
          FERIAS_DATA_TERMINO: "12/09/2025",
          DIAS_FERIAS: 13
        },
        {
          QDT: 14,
          NOME: "THIAGO MARTINS AZEVEDO",
          DATA_ADMISSAO: "09/09/2024",
          INICIO_PERIODO_AQUISITIVO: "09/09/2024",
          FIM_PERIODO_AQUISITIVO: "03/09/2025",
          LIMITE_PARA_GOZO: "05/08/2026",
          DIAS: 30,
          FERIAS_DATA_INICIO: "20/10/2025",
          FERIAS_DATA_TERMINO: "03/11/2025",
          DIAS_FERIAS: 14
        },
        {
          QDT: 15,
          NOME: "VINICIUS FELIPE DE SOUZA SOARES",
          DATA_ADMISSAO: "19/08/2024",
          INICIO_PERIODO_AQUISITIVO: "19/08/2024",
          FIM_PERIODO_AQUISITIVO: "13/08/2025",
          LIMITE_PARA_GOZO: "15/07/2026",
          DIAS: 30,
          FERIAS_DATA_INICIO: "23/12/2025",
          FERIAS_DATA_TERMINO: "06/01/2026",
          DIAS_FERIAS: 14
        },
        {
            QDT: 3,
            NOME: "DANIEL GUEDES FUKUYOSHI GARCIA",
            DATA_ADMISSAO: "16/08/2023",
            INICIO_PERIODO_AQUISITIVO: "10/08/2024",
            FIM_PERIODO_AQUISITIVO: "04/08/2025",
            LIMITE_PARA_GOZO: "06/07/2026",
            DIAS: 30,
            FERIAS_DATA_INICIO: "16/03/2026",
            FERIAS_DATA_TERMINO: "22/03/2026",
            DIAS_FERIAS: 6
        },
        {
            QDT: 3,
            NOME: "DANIEL GUEDES FUKUYOSHI GARCIA",
            DATA_ADMISSAO: "16/08/2023",
            INICIO_PERIODO_AQUISITIVO: "10/08/2024",
            FIM_PERIODO_AQUISITIVO: "04/08/2025",
            LIMITE_PARA_GOZO: "06/07/2026",
            DIAS: 30,
            FERIAS_DATA_INICIO: "13/10/2025",
            FERIAS_DATA_TERMINO: "21/10/2025",
            DIAS_FERIAS: 8
        }
    ];
    const [employee, setEmployee] = useState({name: ""});
    const [selectedEmployee, setSelectecEmployee] = useState({name: "", vacations:[]});
    const [interval, setInterval] = useState({start:"", end:""});
    const [contractType, setContractType] = useState({contract:""});
    const [type, setType] = useState(null);
    const [index, setIndex] = useState(null);
    const handleFormName = (e) => {
        e.preventDefault();
        setEmployee((prevForm) => ({ ...prevForm, [e.target.id]: e.target.value }));
    };
    const handleFormInterval = (e) => {
        e.preventDefault();
        setInterval((prevForm) => ({ ...prevForm, [e.target.id]: e.target.value }));
    };
    const handleFormContract = (e) => {
        e.preventDefault();
        setContractType((prevForm) => ({ ...prevForm, [e.target.id]: e.target.value }));
    };

    const handleSubmitEmployee = async (e) => {
        e.preventDefault();
        if (employee.name === "") {
            alert ("Selecione um funcionário.");
            return;
        } else {
            const filteredVacations = ferias.filter(f => f.NOME === employee.name);
            setSelectecEmployee({name: employee.name, vacations: filteredVacations });
            // try {
            //     const body = {hostid: form.hostid};
            //     const response = await apiService.getObjectIds(body);
            //     if (response.status === 200) {
            //         setProblemType(response.data);
            //     }
            // } catch (error) {
            //     alert("Ocorreu um erro, tente novamente");
            // }
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
            limiteFerias.setDate(fimFerias.getDate() - 31);

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

    const feriasDisponiveis = gerarFerias(info.admissao);
    // console.log(feriasDisponiveis);
    // console.log(index);
    // console.log(feriasDisponiveis[index-1]?.inicio);
    return (
        <PageContainer>
            <IntranetHeaderComponent pageTitle={"FÉRIAS / ADMIN"} />
            <ButtonContainer>
                <button onClick={() => setType("employee")}>Por Funcionário</button>
                <button onClick={() => setType("period")}>Por Período</button>
                <button onClick={() => setType("contract")}>Por Contrato</button>
                <button onClick={() => setType("newVacation")}>Agendar Férias</button>
            </ButtonContainer>
            {type === "employee" ?
                <FormContainer onSubmit={handleSubmitEmployee}>
                    <InputArea>
                        <h1>Selecione o nome do funcionário:</h1>
                        <select onChange={handleFormName} id="name" value={employee.name}>
                            <option value="">Nome do Funcionário</option>
                            {ferias.map((f, index) => (
                                <option key={index} value={f.NOME}>
                                    {f.NOME}
                                </option>
                            ))}
                        </select>
                        <button type="submit"> Filtrar </button>
                    </InputArea>
                </FormContainer>
                : type === "period" ?
                    <FormContainer>
                        <h1>Selecione o período</h1>
                        <InputArea>
                            <h1>Início:</h1>
                            <input
                                type="date"
                                id="start"
                                value={interval.start}
                                onChange={handleFormInterval}
                            />
                            <h1>Fim:</h1>
                            <input
                                type="date"
                                id="end"
                                value={interval.end}
                                onChange={handleFormInterval}
                            />
                            <button> Filtrar </button>
                        </InputArea>
                    </FormContainer>
                    : type === "contract" ?
                        <FormContainer>
                            <InputArea>
                                <h1>Selecione o nome do funcionário:</h1>
                                <select onChange={handleFormContract} id="contract" value={contractType.contract}>
                                    <option value="">Tipo de Contrato</option>
                                    {types.map(t => (
                                        <option key={t} value={t}>
                                            {t}
                                        </option>
                                    ))}
                                </select>
                                <button> Filtrar </button>
                            </InputArea>
                        </FormContainer>
                        : type === "newVacation" &&
                        <>
                            <FormContainer onSubmit={handleSubmitEmployee}>
                                <InputArea>
                                    <h1>Selecione o nome do funcionário:</h1>
                                    <select onChange={handleFormName} id="name" value={employee.name}>
                                        <option value="">Nome do Funcionário</option>
                                        {ferias.map((f, index) => (
                                            <option key={index} value={f.NOME}>
                                                {f.NOME}
                                            </option>
                                        ))}
                                    </select>
                                    <button type="submit"> Filtrar </button>
                                </InputArea>
                            </FormContainer>
                        </>
            }
            {(type === "employee" && selectedEmployee.name !== "") &&
                <>
                    <EmployeeInfo>
                        <h2>
                            Admissão: {info.admissao}
                        </h2>
                        <h2>
                            Tipo Contrato: {info.tipo}
                        </h2>
                        <h2>
                            Total Anual: {info.annualVacation}
                        </h2>
                    </EmployeeInfo>
                    <VacationPeriod>
                        <VacationTable>
                            <div>
                                {/* INICIO_PERIODO_AQUISITIVO: "09/12/2024",
          FIM_PERIODO_AQUISITIVO: "05/12/2025",
          LIMITE_PARA_GOZO: "06/11/2026", */}
                                <h2>Nome</h2>
                                <h2>Admissão</h2>
                                <h2>Início</h2>
                                <h2>Término</h2>
                                <h2>Dias Totais</h2>
                                <h2>Status</h2>
                                <h2>Ação</h2>
                            </div>
                            {selectedEmployee.vacations.map((v, i) => (
                                <div key={i}>
                                    <h2>{v.NOME}</h2>
                                    <h2>{v.DATA_ADMISSAO}</h2>
                                    <h2>{v.FERIAS_DATA_INICIO}</h2>
                                    <h2>{v.FERIAS_DATA_TERMINO}</h2>
                                    <h2>{v.DIAS_FERIAS}</h2>
                                    <h2>solicitado</h2>
                                    <h2><button>aprovar</button></h2>
                                </div>
                            ))}
                        </VacationTable>
                    </VacationPeriod>
                </>
            }
            {(type === "period" || type === "contract") &&
                <VacationPeriod>
                    <VacationTable>
                        <div>
                            {/* INICIO_PERIODO_AQUISITIVO: "09/12/2024",
          FIM_PERIODO_AQUISITIVO: "05/12/2025",
          LIMITE_PARA_GOZO: "06/11/2026", */}
                            <h2>Nome</h2>
                            <h2>Admissão</h2>
                            <h2>Início</h2>
                            <h2>Término</h2>
                            <h2>Dias Totais</h2>
                            <h2>Status</h2>
                            <h2>Ação</h2>
                        </div>
                        {ferias.map((v, i) => (
                            <div key={i}>
                                <h2>{v.NOME}</h2>
                                <h2>{v.DATA_ADMISSAO}</h2>
                                <h2>{v.FERIAS_DATA_INICIO}</h2>
                                <h2>{v.FERIAS_DATA_TERMINO}</h2>
                                <h2>{v.DIAS_FERIAS}</h2>
                                <h2>solicitado</h2>
                                <h2><button>aprovar</button></h2>
                            </div>
                        ))}
                    </VacationTable>
                </VacationPeriod>
            }
            {(type === "newVacation" && selectedEmployee.name !== "") &&
                <VacationContainer>
                    <div>
                        <h2>Selecione um Período Aquisitivo de Férias:</h2>
                        {feriasDisponiveis.map((periodo, index) => (
                            <button key={index} onClick={() => setIndex(index)}>
                                {`${periodo.inicio} -- ${periodo.fim}`}
                            </button>
                        ))}
                    </div>
                </VacationContainer>
            }
            {(type === "newVacation" && selectedEmployee.name !== "" && index >= 0) &&
                <NewVacationComponent name={selectedEmployee.name} periodoAquisitivo={feriasDisponiveis[index]} />
            }
        </PageContainer>
    )
}

export default VacationsAdminPage;

const PageContainer = styled.div`
    width: 100%;
    height: 100%;
    min-height: 100vh;
    flex-direction: column;
    align-items: center;
    gap: 20px;
`

const FormContainer = styled.form`
    width: 65%;
    min-width: 700px;
    gap: 30px;
    align-items: center;
`

const InputArea = styled.div`
    justify-content: center;
    align-items: center;
    gap: 30px;
    margin-top: 10px;
    select {
        width: 50%;       
    }
`

const EmployeeInfo = styled.div`
    max-width: 30%;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    border: 3px solid #343434;
    border-radius: 30px;
    gap:10px;
    padding: 10px 0;
`

const VacationContainer = styled.div`
    min-width: 700px;
    gap: 30px;
    align-items: center;
    h2{
        width: 200px;
    }
    div{
        gap: 30px;
        justify-content: center;
    }
    
`

const VacationPeriod = styled.div`
    margin-bottom: 20px;
    justify-content: center;
`

const VacationTable = styled.div`
    width:  80%;  
    flex-direction: column;
    justify-content: space-between;
    gap: 10px;
    margin-top: 50px;
    div {
        align-items: center;
        min-height: 40px;
        border-bottom: 2px solid gray;
    }
    h2:first-of-type {
        width: 70%;
    }
    h2{
        text-align: center;
        width: 20%;
        display: flex;
        justify-content: center;
    }
`

const ButtonContainer = styled.div`
    justify-content: center;
    gap: 50px;
    margin: 15px 0;
    button {
        justify-content: center;
        width: 10%;
        min-width: 150px;
    }
`