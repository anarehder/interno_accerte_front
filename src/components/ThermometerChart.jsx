import styled from 'styled-components';

const ThermometerChart = ({ media }) => {
  const colors = { 1: "#EB1E25", 2: "#F68C26", 3: "#FDD319", 4: "#AFD13D", 5: "#3CB54B" };

  const getColorByMedia = (media) => {
    if (media <= 1) return colors[1];
    if (media > 1 && media <= 2) return colors[2];
    if (media > 2 && media <= 3) return colors[3];
    if (media > 3 && media <= 4) return colors[4];
    return colors[5]; // media > 4 até 5
  };
  
  return (
    <ChartContainer>
      <TimeBlock
        start={0}
        width={(media/5)*100}
        color={getColorByMedia(media)}
        title={media}
      >
        {(media / 5 * 100).toFixed(1)}%
      </TimeBlock>
    </ChartContainer>
  );

};

export default ThermometerChart;


const ChartContainer = styled.div`
  width: 300px;
  background-color: white;
  border-radius: 5px;
  border: 1px solid #555;
`;

const TimeBlock = styled.div`
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 18px;
    line-height: 40px;
    height: 40px;
    background-color: ${({ color }) => color || "#ccc"};
    width: ${({ width }) => `${width}%`};
    border-radius: 4px;
`;
