import { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuth } from "../../contexts/AuthContext";
import Banner1 from "../../assets/basic/banner-test.jpg"
import BannerIndicai from "../../assets/basic/BannerCerts.jpeg"
import BannerSesc from "../../assets/basic/BannerSesc.png"

function BannerSlideComponent() {
    const { dados } = useAuth();
    const images = dados?.banners?.length > 0 ? dados.banners : [{ name: "Default", url: Banner1 }];
    const [currentIndex, setCurrentIndex] = useState(0);
    const imagesFull = [{ name: "Banner IndicAI", url: BannerIndicai, externo: 'https://accerte.sharepoint.com/sites/AccerteTecnologiadaInformaoLtda/Documentos%20Compartilhados/Pol%C3%ADticas/Pol%C3%ADtica%20do%20Programa%20de%20Certifica%C3%A7%C3%B5es%20Accerte.pdf' }, { name: "Banner Sesc", url: BannerSesc, externo:'https://www.sescgo.com.br/o-sesc/credencial-sesc/a-credencial/' }, ...images];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % imagesFull.length);
        }, 10000);
        return () => clearInterval(interval);
    }, [imagesFull.length]);

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? imagesFull.length - 1 : prevIndex - 1
        );
    };

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % imagesFull.length);
    };

  return (
    <SliderContainer>
      <PrevNextButton onClick={prevSlide}>&#10094;</PrevNextButton>
      <SlideWrapper style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {imagesFull.map((image, index) => (
              <Slide key={index}>
                <BannerLink href={image.externo} target={"_blank"} rel="noreferrer">
                <SlideImage src={image.url} alt={`Slide ${image.name}`} />
                </BannerLink>
              </Slide>
            ))}
      </SlideWrapper>
      <PrevNextButton onClick={nextSlide}>&#10095;</PrevNextButton>
      <DotsContainer>
        {imagesFull.map((_, index) => (
          <DotButton
            key={index}
            onClick={() => setCurrentIndex(index)}
            $active={index === currentIndex}
            aria-label={`Ir para banner ${index + 1}`}
          />
        ))}
      </DotsContainer>
    </SliderContainer>
  );
};

export default BannerSlideComponent;

const SliderContainer = styled.div`
  width: 100%;
  width: 1000px;
  height: 500px;
  overflow: hidden;
  position: relative;
  border-radius: 10px;
  box-shadow: 4px 4px 8px 4px rgba(0, 0, 0, 0.4);
`;

const SlideWrapper = styled.div`
  display: flex;
  transition: transform 0.5s ease-in-out;
  width: 100%;
  height: 100%;
`

const Slide = styled.div` 
  min-width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
`

const BannerLink = styled.a`
  width: 100%;
  height: 100%;
  display: flex;
  border-radius: 10px;
  overflow: hidden;
`;

const SlideImage = styled.img`
  width: 100%;
  height: 100%;
  flex-shrink: 0;
  border-radius: 10px;
`;

const PrevNextButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 5px;
  cursor: pointer;
  font-size: 10px;
  border-radius: 5px;
  z-index: 5;
  &:first-of-type{
    left: 10px;
  }
  &:not(:first-of-type) {
    right: 10px;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }

`;

const DotsContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 12px;
  display: flex;
  justify-content: center;
  gap: 8px;
  z-index: 6;
`;

const DotButton = styled.button`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  padding: 0;
  cursor: pointer;
  background: ${({ $active }) => ($active ? "#002367" : "rgba(88, 84, 84, 0.5)")};
  transition: background 0.2s ease;
`;
