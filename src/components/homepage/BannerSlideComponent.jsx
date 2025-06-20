import { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuth } from "../../contexts/AuthContext";
import Banner1 from "../../assets/basic/banner-test.jpg"

function BannerSlideComponent() {
    const { dados } = useAuth();
    const images = dados?.banners?.length > 0 ? dados.banners : [{ name: "Default", url: Banner1 }];
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 10000);
        return () => clearInterval(interval);
    }, [images.length]);

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

  return (
    <SliderContainer>
      <PrevNextButton onClick={prevSlide}>&#10094;</PrevNextButton>
      <SlideWrapper style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {/* <Slide>
          <SlideLink href="https://tinyurl.com/37razdyb" target="_blank" >
            <SlideImage src={ipog} alt="IPOG" />
          </SlideLink>
        </Slide> */}
        <Slide>
          {images.map((image, index) => (
            <SlideImage key={index} src={image.url} alt={`Slide ${image.name}`} />
          ))}
        </Slide>
      </SlideWrapper>
      <PrevNextButton onClick={nextSlide}>&#10095;</PrevNextButton>
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
  a{
    height: 500px !important;
    margin: 0;
    padding:0;
  }
`

const Slide = styled.div` 
  min-width: 100%;
  min-height: 100%;
  box-sizing: border-box;
`

const SlideLink = styled.a`
  display: flex;
  transition: transform 0.5s ease-in-out;
  width: 300%;
`;

const SlideImage = styled.img`
  width: 100%;
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
