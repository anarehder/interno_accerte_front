import { useEffect, useState } from "react";
import styled from "styled-components";
import PlantoesTIComponent from "../components/PlantoesTIComponent";
import HeaderNewComponent from '../components/basic/HeaderNewComponent';
import { useRef } from 'react';
import { toPng } from "html-to-image";
import download from "downloadjs";
import apiService from "../services/apiService";

const PlantoesTIPage = () => {
  const [duration, setDuration] = useState(7);
  const [currentDay, setCurrentDay] = useState(new Date(new Date().setHours(0, 0, 0, 0)));
  const [lastDay, setLastDay] = useState(() => {
    const data = new Date(currentDay);
    data.setDate(data.getDate() + duration);
    return data;
  });
  const [currentOnCall, setCurrentOnCall] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const imageRef = useRef(null);

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

  useEffect(() => {
    const novaData = new Date(currentDay);
    novaData.setDate(novaData.getDate() + duration);
    setLastDay(novaData);
  }, [currentDay, duration]);

  const handleNextDay = () => {
    setCurrentDay(prev => {
      const novaData = new Date(prev);
      novaData.setDate(novaData.getDate() + 1);
      return novaData;
    });
  };

  const handlePreviousDay = () => {
    setCurrentDay(prev => {
      const novaData = new Date(prev);
      novaData.setDate(novaData.getDate() - 1);
      return novaData;
    });
  };

  const goToPreviousWeek = () => {
    setCurrentDay(prev => {
      const novaData = new Date(prev);
      novaData.setDate(novaData.getDate() - duration);
      return novaData;
    });
  };

  const goToNextWeek = () => {
    setCurrentDay(prev => {
      const novaData = new Date(prev);
      novaData.setDate(novaData.getDate() + duration);
      return novaData;
    });
  };

  const handleChangeDuration = (novaDuracao) => {
    setDuration(novaDuracao);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}`;
  };

  const formatDate2 = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${day}-${month}`;
  };

  const handleDownload = () => {
          if (imageRef.current) {
              toPng(imageRef.current, { quality: 1 })
                  .then((dataUrl) => {
                      download(dataUrl, `Escala_Plantoes-${formatDate2(currentDay)}-${formatDate2(lastDay)}.png`, "image/png");
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
        <HeaderNewComponent pageTitle={"Escala Plantões Sustentação"} />
        <WeekHeader>
          {/* <div> */}
            {/* <button onClick={() => handleChangeDuration(3)}>Escala de 3 dias</button> */}
            {/* <button onClick={() => handleChangeDuration(7)}>Escala de 7 dias</button> */}
            {/* Coloque aqui seus botões para navegação e exibição das datas */}
          {/* </div> */}
          <div>
            <button onClick={goToPreviousWeek}> ⏮ Semana Anterior</button>
            <button onClick={handlePreviousDay}>◀ Dia Anterior</button>
          </div>
          <div> <h2>Semana: {formatDate(currentDay)} – {formatDate(lastDay)}</h2> </div>
          <div>
            <button onClick={handleNextDay}>Próximo Dia ▶</button>
            <button onClick={goToNextWeek}> Próxima Semana ⏭</button>
          </div>

        </WeekHeader>
        {carregando && <h2> Carregando dados ... </h2>}
        {!carregando && currentOnCall.length > 0 &&
          scales.map((s, index) => (
            <PlantoesTIComponent key={s} id={s} currentDay={currentDay} lastDay={lastDay} oncall={currentOnCall.find((oc) => oc.schedule.id === s)} duration={duration}/>
          ))
        }
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
