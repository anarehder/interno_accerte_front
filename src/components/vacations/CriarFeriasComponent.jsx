import { useState } from "react";
import styled from "styled-components";
import { useAuth } from "../../contexts/AuthContext";
import apiService from "../../services/apiService";

function CriarFeriasComponent({ selected, info, setUpdated, setAgendarFerias }) {
    const { user } = useAuth();
    const [date, setDate] = useState({ start: "", end: "" });
    const [totalDays, setTotalDays] = useState(0);
    const minDate = formatDateToInput(new Date(Date.now() + 45 * 24 * 60 * 60 * 1000));
    const minDatePJ = formatDateToInput(new Date(Date.now() + 1 * 24 * 60 * 60 * 1000));

    function formatDateToInput(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // meses começam em 0
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

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

    const isValid = () => {
        const dataInicio = new Date(date.start);
        const dataFim = new Date(date.end);

        const [dia, mes, ano] = selected?.limite.split('/');
        const limite = new Date(`${ano}-${mes}-${dia}`);
        limite.setDate(limite.getDate() + 1);

        return (
            dataInicio < dataFim &&
            dataFim <= limite
        );
    };

    function dataISO (dataBR){
        const [dayS, monthS, yearS] = dataBR.split("/").map(Number);
        const dataISO = `${yearS}-${monthS.toString().padStart(2, '0')}-${dayS.toString().padStart(2, '0')}T00:00:00Z`;
        return dataISO;
    }
    
    function weekDay (){
        const startDate = new Date(date.start);
        startDate.setHours(startDate.getHours() + 6);
        
        const weekDay = startDate.getDay();
        const mondayOrTuesday = weekDay === 1 || weekDay === 2; 

        if (mondayOrTuesday) {
            return true;
        }
        return alert("A data de início das férias deve ser sempre na segunda-feira ou terça-feira.");
    }

    function validateVacationLength() {
        if (info.Contratos.tipo === "CLT" || info.Contratos.tipo === "ESTÁGIO") {
            if (totalDays <= 5) {
                alert("Para CLT e Estagiários, o período de férias deve ser maior que 5 dias.");
                return false;
            }
        } else if (info.Contratos.tipo === "PJ" || info.Contratos.tipo === "COOPERADO") {
            if (totalDays !== 10) {
                alert("Para PJ e Cooperados, o período de férias deve ser exatamente 10 dias.");
                return false;
            }
        }
        return true;
    }
    const handleConfirm = async () => {
        if (!weekDay()) {
            return;
        }

        if (!validateVacationLength()) {
            return;
        }

        if (info.Contratos.tipo === "CLT" || info.Contratos.tipo === "ESTÁGIO") {
            if (new Date(date.start) < new Date(minDate)) {
                alert("A data de início das férias deve ser selecionada com um intervalo de 45 dias.");
                return;
            }
        }

        if (new Date(date.start) < new Date()) {
                alert("A data de início das férias deve ser posterior ao dia de hoje.");
                return;
            }

        const min6mon = new Date(dataISO(selected.inicio));
        min6mon.setMonth(min6mon.getMonth() + 6);

        if (new Date(date.start) < new Date(min6mon)) {
            alert("Você pode agendar férias/pausas a partir de 6 meses da vigência do período aquisitivo.");
            return;
        }
        
        const confirmed = window.confirm(
            `Funcionário: ${info.nome} ${info.sobrenome}\n` +
            `Período Aquisitivo: de ${selected.inicio} até ${selected.fim} \n` +
            `Início das Férias: ${date.start}\n` +
            `Fim das Férias: ${date.end}\n` +
            `Total de Dias: ${totalDays}`
        );
        if (!confirmed) {
            return;
        }

        const body = {
            "adminEmail": user.mail,
            "ferias": {
                "funcionarioId": info.id,
                "inicio": `${date.start}T00:00:00Z`,
                "fim": `${date.end}T00:00:00Z`,
                "totalDias": totalDays,
                "referenteInicio": dataISO(selected.inicio),
                "referenteFim": dataISO(selected.fim)
            }
        }
        try {
            const response = await apiService.createVacation(body);
            if (response.status === 200) {
                alert("Período de Férias Inserido com Sucesso!");
                setDate({ start: "", end: "" });
                setUpdated(true);
                setAgendarFerias(false);
            }
        } catch (error) {
            // console.error("Erro ao enviar requisição:", error);
            alert(`Ocorreu um erro. Tente novamente, ${error.response.data.message}.`);
        }
    };

    return (
        <Container>
            {info &&
                <SelectContainer>
                    <Header>
                        <div>Nome: {info.nome}</div>
                        <div>E-mail: {info.email}</div>
                        <div>Período Aquisitivo: <br />de {selected?.inicio} até {selected?.fim}</div>
                        <div>Data Limite: {selected?.limite}</div>                        
                        <Button onClick={() => setAgendarFerias(false)}> Fechar Solicitação </Button>
                    </Header>
                    <Form>
                        <Label>Início das Férias:</Label>
                        <Input
                            type="date"
                            value={date.start}
                            onChange={(e) => handleDateChange("start", e.target.value)}
                            min={(info.Contratos.tipo === "CLT" || info.Contratos.tipo === "ESTÁGIO")  ? minDate : minDatePJ }
                        />
                        <Label>Fim das Férias:</Label>
                        <Input
                            type="date"
                            value={date.end}
                            onChange={(e) => handleDateChange("end", e.target.value)}
                        />
                        {totalDays > 0 && <TotalDias>Total de dias: {totalDays}</TotalDias>}
                        <Button disabled={!isValid()} onClick={handleConfirm}> Confirmar</Button>
                    </Form>
                </SelectContainer>
            }
            <p>Para PJs e Cooperados atentem-se aos 6 meses após o início do período aquisitivo para iniciar nova pausa.</p>
            <p>Para CLTs e Estagiários atentem-se aos 12 meses após o início do período aquisitivo para iniciar um período de férias.</p>
        </Container>
    );
};

export default CriarFeriasComponent;

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
  p{
    font-size:15px;
  }
`;

const Header = styled.div`
    font-size: 18px;
    color: #333;
    text-align: left;
    width: 55%;
    height: 350px;
    flex-direction: column;
    justify-content: flex-start;
    align-items: space-between;
    div{
        justify-content: flex-start;
        height: 22%;
    }
    span{
        font-weight: 700;
    }
`;

const SelectContainer = styled.div`
    justify-content: space-between;
    width: 700px;
    height: 400px;
    align-items: center;
`

const Form = styled.div`
    display: flex;
    flex-direction: column;
    width: 40%;
    height: 400px;
    justify-content: center;
`;

const Label = styled.label`
  font-weight: bold;
  color: #555;
  text-align: left;
  font-size: 16px;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 18px;
  height: 30px;
`;

const TotalDias = styled.p`
  font-size: 16px;
  font-weight: bold;
  color: #007bff;
//   margin: 10px 0;
`;

const Button = styled.button`
  padding: 10px;
  font-size: 16px;
  font-weight: bold;
  background-color: #28a745;
  border: 2px solid #218838;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: #218838;
    border: 2px solid #218838;
  }

  &:disabled {
    background-color: #ccc;
    border: 2px solid #ccc;
    cursor: not-allowed;
  }
`;
