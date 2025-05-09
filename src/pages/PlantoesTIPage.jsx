import { useEffect, useState } from "react";
import styled from "styled-components";
import HeaderComponent from "../components/HeaderComponent";
import dayjs from 'dayjs';
// import PlantoesTIComponent from "../components/PlantoesTIComponent";
import { useRef } from 'react';
import { toPng } from "html-to-image";
import download from "downloadjs";
import apiService from "../services/apiService";

const PlantoesTIPage = () => {
  const [currentDay, setCurrentDay] = useState(dayjs().startOf('day'));
  const [lastDay, setLastDay] = useState(dayjs().startOf('day').add(7, 'day'));
  const [currentOnCall, setCurrentOnCall] = useState([]);
  const [carregando, setCarregando] = useState(true);
  
  const imageRef = useRef(null);
  dayjs.locale('pt-br');
  const scales = [
    "PCHC5N9",
    "PABNNC7",
    "PSWQJGP",
    "P9Y68SR",
    "PAHZ4GE",
  ];

    useEffect(() => {
          const fetchEntries = async () => {
            try {
              setCarregando(true);
              const response = await apiService.getOnCallsPagerDuty();
              setCurrentOnCall(response.data.oncalls); // salva quem está de plantão agora
              setCarregando(false);
            } catch (error) {
              console.error("Erro ao buscar escalas", error);
              setCarregando(false);
            }
          };
    
          fetchEntries();
          const interval = setInterval(() => {
            fetchEntries(); // chama a cada 5 minutos
          }, 5 * 60 * 1000); // 5 minutos em milissegundos
        
          return () => clearInterval(interval); // limpa o intervalo ao desmontar o componente
        }, [currentDay]);

  const handleNextDay = () => {
    setCurrentDay(prev => prev.add(1, 'day'));
    setLastDay(currentDay.add(8, 'day'));
  };

  const handlePreviousDay = () => {
    setCurrentDay(prev => prev.subtract(1, 'day'));
    setLastDay(currentDay.add(6, 'day'));
  };

  const goToPreviousWeek = () => {
    setCurrentDay(prev => prev.subtract(7, 'day'));
    setLastDay(currentDay);
  };

  const goToNextWeek = () => {
    setCurrentDay(prev => prev.add(7, 'day'));
    setLastDay(currentDay.add(14, 'day'));
  };

  const handleDownload = () => {
          if (imageRef.current) {
              toPng(imageRef.current, { quality: 1 })
                  .then((dataUrl) => {
                      download(dataUrl, `Escala_Plantoes-${currentDay.format('DD/MM')}-${lastDay.format('DD/MM')}.png`, "image/png");
                  })
        .catch((error) => {
          console.error("Erro ao gerar a imagem:", error);
        });
    }
  };

  return (
    <>
      <Button onClick={handleDownload}>
        Baixar Escala
      </Button>
      <Container ref={imageRef}>
        <HeaderComponent pageTitle={"Escala Plantões Sustentação"} type={"page"} />

        <WeekHeader>
          <div>
            <button onClick={goToPreviousWeek}> ⏮ Semana Anterior</button>
            <button onClick={handlePreviousDay}>◀ Dia Anterior</button>
          </div>
          <div> <h2>Semana: {currentDay.format('DD/MM')} – {lastDay.format('DD/MM')}</h2> </div>
          <div>
            <button onClick={handleNextDay}>Próximo Dia ▶</button>
            <button onClick={goToNextWeek}> Próxima Semana ⏭</button>
          </div>

        </WeekHeader>
        {carregando && <h2> Carregando dados ... </h2>}
        {/* {!carregando && currentOnCall.length > 0 &&
          scales.map((s, index) => (
            <PlantoesTIComponent key={s} id={s} currentDay={currentDay} lastDay={lastDay} oncall={currentOnCall.find((oc) => oc.schedule.id === s)} />
          ))
        } */}
      </Container>
    </>
  );
};

export default PlantoesTIPage;
  

const Container = styled.div`
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    color: #555;
    margin-bottom: 30px;
    background-color: #F0F5F9;
`;


const WeekHeader = styled.div`
  max-width: 90%;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 30px;
  height: 65px;
  justify-content: space-between;
  button{
    max-width: 180px;
    font-size: 15px;
    justify-content: center;
    padding: 12px;
  }
  div{
    gap: 5px;
    justify-content: center;
    width: 300px; 
  }
`;

const Button = styled.button`
    width: 80px;
    justify-content: center;
    position: absolute;
    right: 5%;
    top: 30px;
    font-size: 15px;
    z-index: 3;
`;
