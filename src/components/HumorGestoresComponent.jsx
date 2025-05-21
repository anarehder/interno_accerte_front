// SugestoesComponent.jsx
import { useEffect, useState } from 'react';
import styled from "styled-components";
import { FaArrowRightLong } from "react-icons/fa6";
import { useAuth } from '../contexts/AuthContext';
import ThermometerChart from './ThermometerChart';
import apiService from '../services/apiService';

function HumorGestoresComponent() {
    const { user } = useAuth();
    const [humor, setHumor] = useState([]);
    const [media, setMedia] = useState(0);
    const emoji = ["-", '😡', '🥹', '😐','😁','🤩'];
    const today = new Date().toISOString().slice(0, 10);
    const [date, setDate] = useState(today);

    const handleDateChange = (value) => {
        setDate(value);
    };

    const [errorMessage, setErrorMessage] = useState("");
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        if (!user) return;
        const fetchScale = async () => {
            try {
                const body = {email: user.mail, data: date};
                const response = await apiService.buscarHumorArea(body);
                if (response.data.length !== 0) {
                    const mediaHumor = response.data.reduce((soma, item) => soma + item.humor, 0) / response.data.length;
                    setMedia(mediaHumor);
                    setHumor(response.data);
                } else {
                    setMedia(0);
                    setHumor([]);
                }
                setCarregando(false);
            } catch (error) {
                setErrorMessage(error.response.data.message);
                setCarregando(false);
            }
        };

        fetchScale();

    }, [user]);


    const handleConfirm = async () => {
        try {
            // const body = {email: user.mail, data: date};
            const body = {email: 'maria.silva@accerte.com.br', data: date};
            const response = await apiService.buscarHumorArea(body);
            if(response.data.length !== 0 ) {
                const mediaHumor = response.data.reduce((soma, item) => soma + item.humor, 0) / response.data.length;
                setMedia(mediaHumor);
                setHumor(response.data);
            } else {
                setMedia(0);
                setHumor([]);
            }
            setCarregando(false);
        } catch (error) {
            setErrorMessage(error.response.data.message);
            setCarregando(false);
        }
    };



    return (
        <Container>
            <h2>Como sua equipe está se sentindo hoje...</h2>
            <ThermometerChart media={media} />
            <Form>
                <Input
                    type="date"
                    value={date}
                    onChange={(e) => handleDateChange(e.target.value)}
                />
                <button onClick={handleConfirm}>
                    <FaArrowRightLong size={24} />
                </button>
            </Form>
            <ItensContainer>
                {
                    !carregando && humor.length === 0 &&
                    <h2> Sem dados para o dia atual. </h2>
                }
                {
                    humor.map((k, index) => (
                        <HumorContainer0 key={index}>
                            <h2>{k.Funcionarios.nome} {k.Funcionarios.sobrenome}</h2> <p>{emoji[k.humor]}</p>   <div> {k.mensagem}</div>
                        </HumorContainer0>
                    ))
                }
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
        justify-content: center;
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