import styled from 'styled-components';

function BalloonAnimationComponent() {
  const balloons = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 6 + Math.random() * 3,
    offsetX1: (Math.random() - 0.5) * 20,
    offsetX2: (Math.random() - 0.5) * 40,
  }));

  return (
    <BalloonWrapper>
      {balloons.map(balloon => (
        <Balloon
          key={balloon.id}
          $left={balloon.left}
          $delay={balloon.delay}
          $duration={balloon.duration}
          $offsetX1={balloon.offsetX1}
          $offsetX2={balloon.offsetX2}
        >
          🎈
        </Balloon>
      ))}
    </BalloonWrapper>
  );
}

export default BalloonAnimationComponent;

const BalloonWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 12;
`;

const Balloon = styled.div`
  position: absolute;
  bottom: -100px;
  left: ${props => props.$left}%;
  font-size: 60px;
  filter: hue-rotate(${props => Math.random() * 360}deg);
  animation: float ${props => props.$duration}s linear infinite;
  animation-delay: ${props => props.$delay}s;
  opacity: 0.95;

  @keyframes float {
    0% {
      transform: translateY(0) translateX(0);
      opacity: 0;
    }
    8% {
      opacity: 0.95;
    }
    92% {
      opacity: 0.95;
    }
    100% {
      transform: translateY(-120vh) translateX(${props => props.$offsetX2}px);
      opacity: 0;
    }
  }
`;
