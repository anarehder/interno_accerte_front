// SugestoesComponent.jsx
import { useEffect, useState } from 'react';
import styled from "styled-components";
import { FaArrowRightLong } from "react-icons/fa6";
import { useAuth } from '../contexts/AuthContext';
import ThermometerChart from './ThermometerChart';

function HumorGestoresComponent() {
    const { user } = useAuth();
    const [humor, setHumor] = useState([]);
    const [media, setMedia] = useState(4.7);
    
    const emoji = ["-", '😡', '🥹', '😐','😁','🤩'];
    const today = new Date().toISOString().slice(0, 10);
    const [date, setDate] = useState(today);
    console.log(humor);
    const handleDateChange = (value) => {
        // const newDate = { ...date, [field]: value };
        setDate(value);
    };

    const [errorMessage, setErrorMessage] = useState("");
    const [carregando, setCarregando] = useState(true);
    useEffect(() => {
        if (!user) return;
        // const fetchScale = async () => {
        //     try {
        //         const body = {adminEmail: user.mail};
        //         const response = await apiService.getVagas(body);
        //         setVagas(response.data);
        //         setCarregando(false);
        //         setUpdated(false);
        //     } catch (error) {
        //         setErrorMessage(error.response.data.message);
        //         setCarregando(false);
        //     }
        // };

        // fetchScale();

    }, [user]);


    const handleConfirm = async () => {
        // const [dayE, monthE, yearE] = feriasDisponiveis[selectedPeriod].fim.split("/").map(Number);
        const body = {
          "adminEmail": user.mail,
          "data": date
        }
        alert(date);
        // try {
        //   const response = await apiService.createVacation(body);
        //   if (response.statusText === "OK") {
        //     alert("Período de Férias Inserido com Sucesso!");
        //     selectedPeriod(-1);
        //     setDate({ start: "", end: "" });
        //   }
        // } catch (error) {
        //   // console.error("Erro ao enviar requisição:", error);
        //   alert(`Ocorreu um erro. Tente novamente, ${error.response.data.message}.`);
        // }
      };

    

    return (
        <Container>
            <h2>Como sua equipe está se sentindo hoje...</h2>
            <ThermometerChart media={media} />
            <Form>
                {/* <Label>Selecione uma data</Label> */}
                <Input
                    type="date"
                    value={today}
                    onChange={(e) => handleDateChange(e.target.value)}
                />
                <button onClick={handleConfirm}>
                    <FaArrowRightLong size={24}/>
                </button>
            </Form>
            <ItensContainer>
                <HumorContainer0>
                    <h2>João Maria José</h2> <p>{emoji[1]}</p>   <div> OBS.: texto se tiver texto se tiver texto se tiver texto se tiver texto se tiver se tiver texto se tiver texto se tiver texto se tiver</div>
                </HumorContainer0>
                <HumorContainer0>
                    <h2>João Maria José</h2> <p>{emoji[2]}</p>  <div>  </div>
                </HumorContainer0>
                <HumorContainer0>
                    <h2>João Maria José</h2> <p>{emoji[3]}</p>  <div>  OBS.: texto se tiver texto se tiver texto se tiver texto se tiver texto se tiver se tiver texto se tiver texto se tiver texto se tiver</div>
                </HumorContainer0>
                <HumorContainer0>
                    <h2>João Maria José</h2> <p>{emoji[5]}</p>  <div>  OBS.: texto se tiver texto se tiver texto se tiver texto se tiver texto se tiver se tiver texto se tiver texto se tiver texto se tiver</div>
                </HumorContainer0>
            </ItensContainer>
        </Container>
    );
};

export default HumorGestoresComponent;

const Container = styled.div`
    margin: 0 10px 0 350px;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    gap: 10px;
    height: 60vh;
    color: #555;
    border: none;
    position: relative;
    // background-color: blue;
    overflow-y: scroll;
    h2 {
        margin: 10px 0;
    }
}
`



const Form = styled.div`
  display: flex;
//   flex-direction: column;
  margin-top: 15px;
  gap: 10px;
  justify-content: center;
  align-items: center;
  button{
    width: 50px;
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
  height: 30px;
  width: 200px;
`;

const ItensContainer = styled.div`
    width: 85%;
    margin-top: 50px;
    font-size: 20px;
    align-items: flex-start; 
    flex-wrap: wrap;
    gap: 30px;
    justify-content: center;
    margin-bottom: 50px;
    textarea {
        min-width: 450px; 
        height: 70px; 
        border-radius: 10px;
        color: #555;
        font-family: "Poppins", serif;
        padding: 5px;
    }
`
const HumorContainer0 = styled.div`
    width: 45%;
    padding: 3px;
    height: 120px;
    text-align: center;
    padding: 5px;
    justify-content: space-between;
    box-shadow: 2px 4px 12px rgba(0, 0, 0, 0.5);
    border-radius: 5px;
    align-items: center;
    flex-direction: column;
    h2{
        text-align: left;
        height: 25px;
        margin: 0 auto;
    }
    p{
        font-size: 40px;
        line-height: 45px;
    }
    div{
        height: 42px;
        width: 97%;
        line-height: 20px;
        font-size: 15px;
        justify-content: flex-start;
        align-items: flex-start;
        text-align: left;
        overflow-y: auto;
        padding: 0 5px;
    }
`

const HumorContainer = styled.div`
    // width: 150px;
    height: auto;
    text-align: center;
    padding: 5px;
    gap: 15px;
    justify-content: center;
    box-shadow-top: 0px 4px 12px rgba(0, 0, 0, 0.1);
    flex-direction: column;
    // background-color: red;
    align-items: center;
    div{
        justify-content: flex-start;
        align-items: center;
        gap: 10px;
    }
    img {
        width: 50px;
    }
`

const ChartContainer = styled.div`
  width: 200px;
  height: 400px;
`;