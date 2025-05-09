import styled from 'styled-components';
import { useState, useEffect } from "react";
import dayjs from 'dayjs';
import apiService from '../services/apiService';

function PlantoesTIComponent({id, currentDay, lastDay, oncall}) {
    const [users, setUsers] = useState([]); // Usuários da escala
    const [schedule, setSchedule] = useState(null);
    const [info, setInfo] = useState({ "name": "", "time_zone": "", "id": "", "url": "" });
    const [carregando, setCarregando] = useState(true);
    const now = dayjs();
    const colors = [
        '#1F1FF5', '#B42F2F', '#F5A91F', '#3D3D3D', '#009595', '#FFFFFF', '#AF5F5F'
    ];

    const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);
    const WEEK_MINUTES = 7 * 24 * 60;
    // console.log(`${currentDay.   format('YYYY-MM-DD')}T00:00:00.000Z`, currentDay.toISOString());
    useEffect(() => {
      const fetchEntries = async () => {
        try {
          setCarregando(true);
          const params = `id=${id}&since=${currentDay.toISOString()}&until=${lastDay.toISOString()}`;
          const response = await apiService.getEscalaPagerDuty(params);
          
          const dados = { "name": response.data.schedule.summary, "time_zone": response.data.schedule.time_zone, "id": response.data.schedule.id, "url": response.data.schedule.html_url };
          
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
    }, [currentDay]);

    return (
        <PageContainer>
            {/* {carregando && <ScaleName> Carregando dados...</ScaleName>} */}
            {!carregando && info?.name && 
            <ScaleName>
                <div>{info.name}</div>
                <div>Cobertura: {schedule.rendered_coverage_percentage}%</div>
                <div>Agora ({now.format('DD/MM/YY HH:mm')}): {oncall.user.summary}</div>
            </ScaleName>}            
            {(!carregando && users.length > 0) &&
                <>
                <EscalaWrapper>
                    <HeaderWrapper>
                        {[...Array(7)].map((_, index) => {
                            const date = currentDay.add(index, 'day');
                            const diaIngles = date.format('ddd'); // 'Monday', 'Tuesday', etc

                            return <DayBlock key={index*10}>{capitalize(diaIngles)} - {date.format('DD/MM')}</DayBlock>;
                        })}
                    </HeaderWrapper>
                    <Timeline>
                                {schedule?.rendered_schedule_entries?.map((s, index) => {

                                    const start = dayjs(s.start);
                                    const end = dayjs(s.end);
                                    const diffStart = start.diff(currentDay, 'minute');
                                    const diffEnd = end.diff(currentDay, 'minute');
                                    const startPercent = Math.max((diffStart / WEEK_MINUTES) * 100, 0);
                                    const endPercent = Math.min((diffEnd / WEEK_MINUTES) * 100, 100);
                                    const width = endPercent - startPercent;

                                    return (
                                        <HourBlock key={start} start={startPercent} width={width}>
                                            <div>{start.format('HH[h]')} </div> <div>{end.format('HH[h]')}</div>
                                        </HourBlock>);
                                })}
                            </Timeline>
                            <Timeline>
                                {schedule?.rendered_schedule_entries?.map((s, index) => {

                                    const start = dayjs(s.start);
                                    const end = dayjs(s.end);
                                    const diffStart = start.diff(currentDay, 'minute');
                                    const diffEnd = end.diff(currentDay, 'minute');
                                    const startPercent = Math.max((diffStart / WEEK_MINUTES) * 100, 0);
                                    const endPercent = Math.min((diffEnd / WEEK_MINUTES) * 100, 100);
                                    const width = endPercent - startPercent;

                                    return (
                                        <TimeBlock
                                            key={s.end}
                                            start={startPercent}
                                            width={width}
                                            color={colors[index % users.length]}
                                            title={`${s.user.summary} de ${start.format('DD/MM [-] HH:mm')} até ${end.format('DD/MM [-] HH:mm')}`}
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