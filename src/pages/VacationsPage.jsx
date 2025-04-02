import styled from 'styled-components';
import { useState } from 'react';
import { Link } from "react-router-dom";
import HeaderGGComponent from '../components/HeaderGGComponent';

function VacationsPage() {
    const info = { "admissao": "15/01/2023", "tipo": "CLT", "annualVacation": "30 dias" };
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
    const [index, setIndex] = useState(null);
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
    return (
        <PageContainer>
            <HeaderGGComponent pageTitle={"Férias"} />
            <AdminButton><Link to="/ferias/admin">Administrar</Link></AdminButton>
            <HeaderContainer>
                <LogoContainer>
                    {/* <img src={Logo} alt="ACCERTE" /> */}
                    <h1>Olá, João. <br /> <br /> <br />Confira aqui suas férias:</h1>
                </LogoContainer>
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
            </HeaderContainer>
            <VacationContiner>
                <h1>Períodos Aquisitivos de Férias:</h1>
                <div>
                    {feriasDisponiveis.map((periodo, index) => (
                        <button key={index} onClick={()=>setIndex(index+1)}>
                            {`${periodo.inicio} -- ${periodo.fim}`}
                        </button>
                    ))}
                </div>
                {index &&
                    <>
                        <VacationPeriod>
                            <VacationTable>
                                <div>
                                    <h2>Início</h2>
                                    <h2>Fim</h2>
                                    <h2>Total</h2>
                                    <h2>Status</h2>
                                </div>
                                {index && vacations[index].map((v, i) => (
                                    <div>
                                        <h2>{v.inicio}</h2>
                                        <h2>{v.fim}</h2>
                                        <h2>{v.totalDias}</h2>
                                        <h2>{v.status}</h2>
                                    </div>
                                ))}
                            </VacationTable>
                            <VacationButtons>
                                <button> Data Limite - {feriasDisponiveis[index-1].limite} </button>
                                <button> Agendar Férias </button>
                                <button> Alterar Férias</button>
                            </VacationButtons>
                        </VacationPeriod>
                        <div>
                            <h2>Dias Agendados ou Finalizados: {vacations[index].map(v => v.totalDias).reduce((acc, val) => acc + val, 0)} dias </h2>
                            <h2> / </h2>
                            <h2>Dias Restantes no Período: {info.annualVacation.slice(0, 2) - vacations[index].map(v => v.totalDias).reduce((acc, val) => acc + val, 0)} dias</h2>
                        </div>
                    </>
                }
            </VacationContiner>
        </PageContainer>
    )
}

export default VacationsPage;

const PageContainer = styled.div`
    width: 100%;
    height: 100%;
    min-height: 100vh;
    flex-direction: column;
    align-items: center;
    gap: 20px;
`

const AdminButton = styled.button`
    top: 2%;
    right: 2%;
    position: absolute;
    font-size: 16px;
    justify-content: center;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: #ED1F4C;
    color: white;
    &:hover {
        background-color: #ED1F4C;
    }
`;

const HeaderContainer = styled.div`
    width: 90%;
    margin-top: 20px;
    min-height: 20vh;
    gap: 5%;
    justify-content: center;
`

const LogoContainer = styled.div`
    flex-direction: column;
    max-width: 30%;
    background-color: #343434;
    justify-content: space-around;
    align-items: center;
    border-radius: 30px;
    h1{
        font-size: 25px;
        color: white;
        font-family: 'Conthrax', sans-serif;
        word-break: break-word;
    }
    img{
        width: 20%;
    }
`

const EmployeeInfo = styled.div`
    max-width: 30%;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    border: 3px solid #343434;
    border-radius: 30px;
`

const VacationContiner = styled.div`
    width: 65%;
    min-width: 700px;
    flex-direction: column;
    gap: 30px;
    div:first-of-type {
        margin-bottom: 20px;
    }
    div {
        display: flex;
        justify-content: center;
        gap: 30px;
    }
`

const VacationPeriod = styled.div`
    width: 100%;
    gap: 8% !important;
    margin-bottom: 20px;
    div {
        margin-bottom: 0 !important;
    }
`

const VacationTable = styled.div`
    width:  70%;  
    flex-direction: column;
    justify-content: space-between;
    gap: 10px;
    div {
        margin-bottom: 0 !important;
        align-items: center;
        min-height: 40px;
        border-bottom: 2px solid gray;
    }
    h2{
        text-align: center;
        width: 25%;
    }
`

const VacationButtons = styled.div`
    width: 12%;   
    flex-direction: column;
    gap: 40px;
    align-items: center;
    button {
        text-align: center;
        word-break: break-word;
    }
`