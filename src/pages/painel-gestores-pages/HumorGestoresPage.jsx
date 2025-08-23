// SugestoesComponent.jsx
import { useEffect, useState } from 'react';
import styled from "styled-components";
import { FaArrowRightLong } from "react-icons/fa6";
import { useAuth } from '../../contexts/AuthContext';
import ThermometerChart from '../../components/gestores/ThermometerChart';
import apiService from '../../services/apiService';
import HeaderImageComponent from '../../components/basic/HeaderImageComponent';
import TermometroHumor from '../../assets/painel-gestores/termometro-humor.png';

function HumorGestoresPage() {
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
            const body = {email: user.mail, data: date};
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
        <PageContainer>
            <HeaderImageComponent pageTitle={"Humor"} subtitle={"Equipe"} lastPage={"painelgestores"} image={TermometroHumor} />
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
        </PageContainer>
    );
};

export default HumorGestoresPage;

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
    width: 250px;
    padding: 3px;
    height: 180px;
    text-align: center;
    padding: 5px;
    justify-content: space-between;
    box-shadow: 2px 4px 12px rgba(0, 0, 0, 0.5);
    border-radius: 5px;
    align-items: center;
    flex-direction: column;
    h2{
        text-align: center;
        height: 25px;
        margin: 5px auto;
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