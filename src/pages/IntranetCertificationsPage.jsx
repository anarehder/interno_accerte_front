import styled from 'styled-components';
import CertificationsValueComponent from '../components/CertificationsValuesComponent';
import { useState } from 'react';
import { Link } from "react-router-dom";
import logo from "../assets/LOGO_PNG.png";
import CertificationsLevelsComponent from '../components/CertificationsLevelsComponent';
import CertificationsList from "../assets/CertificationsList";

function IntranetCertificationsPage() {
    const partnersList = Object.keys(CertificationsList);
    const [activeButton, setActiveButton] = useState("VALORES");

    const handleClick = (label) => {
      setActiveButton(label);
    };

    return (
        <PageContainer>
            <Link to="/intranet/portal">
                <ReturnButton> Voltar </ReturnButton>
            </Link>
            <TitleContainer>
                <img src={logo} alt="Logo" />
                <div>
                    CERTIFICAÇÕES
                </div>
            </TitleContainer>
            <ButtonsContainer>
                {partnersList.map((label) => (
                    <Button
                        key={label}
                        active={activeButton === label ? true : undefined}
                        onClick={() => handleClick(label)}
                    >
                        {label}
                        {/* {label} - {activeButton === label && <p>T</p>} */}
                    </Button>
                ))}
            </ButtonsContainer>
            {activeButton && <a href={CertificationsList[activeButton]?.site_treinamentos} target="_blank" rel="noopener noreferrer">
                <h1>{activeButton}</h1>
            </a>
            }
            { activeButton === partnersList[0] && <CertificationsValueComponent /> }
            { (activeButton && activeButton !== partnersList[0]) && 
                <CertificationsLevelsComponent list = {CertificationsList[activeButton]} />
            }
        </PageContainer>
    )
}

export default IntranetCertificationsPage;

const PageContainer = styled.div`
    width: 100%;
    height: 100%;
    min-height: 100vh;
    flex-direction: column;
    align-items: center;
    gap: 20px;
`


const TitleContainer = styled.div`
    width: 80%;
    gap: 15px;
    justify-content: center;
    margin-top: 30px;
    align-items: center;
    font-family: 'Conthrax', sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 40px;
    div{
        flex-direction: column;
        align-items: center;
        gap: 10px;
    }
    p {
        font-size: 50px;
        font-family: "Dosis", serif;
        word-spacing: 10px;
    }
    img {
        width: 100px;
        position: absolute;
        left: 10%;
    }
}
`

const ReturnButton = styled.button`
  top: 10%;
  left: 2%;
  position: absolute;
  font-size: 16px;
  justify-content: center;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: ${(props) => (props.color === "clear" ? "#ba1d2a" : "#007bff")};
  color: white;
  &:hover {
    background-color: ${(props) => (props.color === "clear"  ? "#962831" : "#0056b3")};
  }
`;

const Button = styled.button`
    width: 100%;
    font-size: 16px;
    justify-content: center;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    color: white;
    background-color: ${({ active }) => (active ? "black" : "#345B68")};
    &:hover {
        background-color: ${({ active }) => (active ? "rgb(141, 171, 181)" : "black")};
`;

const ButtonsContainer = styled.div`
    width: 80%;
    gap: 15px;
    margin: 40px 0 20px 0;
`