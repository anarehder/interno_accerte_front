import React, { useState, useEffect } from "react";
import styled from "styled-components";
import banner1 from "../assets/BANNER1.png";
import banner2 from "../assets/BANNER2.jpeg";
import banner3 from "../assets/BANNER3.jpeg";

function BannerSlideComponent() {
    const images = [banner1, banner2, banner3];
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);
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
            <Slide style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {images.map((image, index) => (
                    <SlideImage key={index} src={image} alt={`Slide ${index}`} />
                ))}
            </Slide>
            <PrevNextButton onClick={nextSlide}>&#10095;</PrevNextButton>
        </SliderContainer>
    );
};

export default BannerSlideComponent;

const SliderContainer = styled.div`
  width: 100%;
  max-width: 800px;
  max-height: 400px;
  overflow: hidden;
  position: relative;
  border-radius: 10px;
`;

const Slide = styled.div`
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
  padding: 10px;
  cursor: pointer;
  font-size: 20px;
  border-radius: 5px;
  z-index: 10;
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
