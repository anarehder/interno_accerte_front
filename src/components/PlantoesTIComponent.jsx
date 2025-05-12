import styled from 'styled-components';
import { useState, useEffect } from "react";
import apiService from '../services/apiService';

function PlantoesTIComponent({id, currentDay, lastDay, oncall, duration}) {
    const [users, setUsers] = useState([]); // Usuários da escala
    const [schedule, setSchedule] = useState(null);
    const [info, setInfo] = useState({ "name": "", "time_zone": "", "id": "", "url": "" });
    const [carregando, setCarregando] = useState(true);
    const [weekMinutes, setWeekMinutes] = useState(duration * 24 * 60);
    const now = new Date();
    const colors = [
        '#1F1FF5', '#B42F2F', '#F5A91F', '#3D3D3D', '#009595', '#FFFFFF', '#AF5F5F'
    ];

    const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);
    
    useEffect(() => {
      const fetchEntries = async () => {
        try {
          setCarregando(true);
        //   console.log(duration, currentDay.toISOString(), lastDay.toISOString());
          const novaData = new Date(currentDay);
          novaData.setDate(novaData.getDate() + duration);
          const params = `id=${id}&since=${currentDay.toISOString()}&until=${novaData.toISOString()}`;
          const response = await apiService.getEscalaPagerDuty(params);
        //   console.log("busquei novos dados");
          const dados = { "name": response.data.schedule.summary, "time_zone": response.data.schedule.time_zone, "id": response.data.schedule.id, "url": response.data.schedule.html_url };
          setWeekMinutes(duration * 24 * 60);
          setInfo(dados);
            setUsers(response.data.schedule.users);
            setSchedule(response.data.schedule.final_schedule);
            setCarregando(false);
        } catch (error) {
            console.error("Erro ao buscar escalas", error);
          setCarregando(false);
        }
        };

        fetchEntries();
    }, [currentDay, duration]);

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2); // pega os dois últimos dígitos do ano
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    const formatHour = (date) => {
        const hours = String(date.getHours()).padStart(2, '0');
        return `${hours}h`;
    };
    return (
        <PageContainer>
            {/* {carregando && <ScaleName> Carregando dados...</ScaleName>} */}
            {!carregando && info?.name &&
                <ScaleName>
                    <div>{info.name}</div>
                    <div>Cobertura: {schedule.rendered_coverage_percentage}%</div>
                    <div>Agora ({formatDate(now)}): {oncall.user.summary}</div>
                </ScaleName>}
            {(!carregando && users.length > 0) &&
                <>
                    <EscalaWrapper>
                        <HeaderWrapper>
                            {[...Array(duration)].map((_, index) => {
                                const date = new Date(currentDay);
                                date.setDate(date.getDate() + index);

                                const diaPort = date.toLocaleDateString('pt-BR', { weekday: 'short' }); // ex: 'Mon', 'Tue'
                                const dia = String(date.getDate()).padStart(2, '0');
                                const mes = String(date.getMonth() + 1).padStart(2, '0');

                                return (
                                    <DayBlock key={index * 10}>
                                        {capitalize(diaPort).slice(0,3)} - {`${dia}/${mes}`}
                                    </DayBlock>
                                );
                            })}
                        </HeaderWrapper>
                    <Timeline>
                        {schedule?.rendered_schedule_entries?.map((s, index) => {

                            const start = new Date(s.start);
                            const end = new Date(s.end);
                            const diffStart = Math.floor((start - currentDay) / (1000 * 60)); // Convertendo de milissegundos para minutos
                            const diffEnd = Math.floor((end - currentDay) / (1000 * 60));
                            const startPercent = Math.max((diffStart / weekMinutes) * 100, 0);
                            const endPercent = Math.min((diffEnd / weekMinutes) * 100, 100);
                            const width = endPercent - startPercent;

                            return (
                                <HourBlock key={start} start={startPercent} width={width}>
                                    <div>{formatHour(start)} </div> <div>{formatHour(end)}</div>
                                </HourBlock>);
                        })}
                    </Timeline>
                    <Timeline>
                        {schedule?.rendered_schedule_entries?.map((s, index) => {

                            const start = new Date(s.start);;
                            const end = new Date(s.end);
                            const diffStart = Math.floor((start - currentDay) / (1000 * 60)); // Convertendo de milissegundos para minutos
                            const diffEnd = Math.floor((end - currentDay) / (1000 * 60));
                            const startPercent = Math.max((diffStart / weekMinutes) * 100, 0);
                            const endPercent = Math.min((diffEnd / weekMinutes) * 100, 100);
                            const width = endPercent - startPercent;

                            return (
                                <TimeBlock
                                    key={s.end}
                                    start={startPercent}
                                    width={width}
                                    color={colors[index % users.length]}
                                    title={`${s.user.summary} de ${formatDate(start)} até ${formatDate(end)}`}
                                >
                                    {s.user.summary}
                                </TimeBlock>
                            );
                        })}
                    </Timeline>
                    </EscalaWrapper>
                </>

            }
        </PageContainer>
    )
}

export default PlantoesTIComponent;

const PageContainer = styled.div`
    width: 90%;
    position: relative;
    justify-content: center;
    flex-direction: column;
    margin-bottom: 20px;
`

const ScaleName = styled.div`
  font-weight: bold;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  margin: 8px 20px;
  div:nth-child(2){
    justify-content: center;
  }
  div:nth-child(3){
    font-weight: 500;
    font-size: 15px;
    justify-content: flex-end;
  }
`;

const EscalaWrapper = styled.div`
  padding: 1rem;
  flex-direction: column;
  height: 110px;
`;
const HeaderWrapper = styled.div`
  display: flex;
  border-bottom: 1px solid #ccc;
  align-items: center;
  justify-content: center;
`;

const DayBlock = styled.div`
  text-align: center;
  height: 25px;
  padding: 6px 0;
  font-weight: bold;
  font-size: 12px;
  border: 1px solid gray;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  background: linear-gradient(to bottom, white, #F0F5F9);
  justify-content: center;
`;

const Timeline = styled.div`
    position: relative;
    width: 100%;
`;

const TimeBlock = styled.div`
    position: absolute;
    top: 18px;
    align-items: center;
    color: white;
    line-height: 40px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-indent: 5px;
    height: 40px;
    background-color: ${({ color }) => color || "#ccc"};
    left: ${({ start }) => `${start}%`};
    width: ${({ width }) => `${width}%`};
    border-radius: 5px;
`;

const HourBlock = styled.div`
    position: absolute;
    align-items: center;
    top: 3px;
    font-size: 11px;
    justify-content: space-between;
    color: black;
    border-radius: 1px !important;
    height: 10px;
    margin: 2px;  
    gap: 5px;
    left: ${({ start }) => `${start}%`};
    width: ${({ width }) => `${width}%`};
    div:first-child{
        justify-content: flex-start;
    }
    div:nth-child(2){
        justify-content: flex-end;
  }
`;