import styled from 'styled-components';
import CertificationsValueComponent from '../components/CertificationsValuesComponent';
import { useState } from 'react';
import TitleComponent from '../components/TitleComponent';
import CertificationsLevelsComponent from '../components/CertificationsLevelsComponent';
import CertificationsList from "../assets/CertificationsList";

function CertificationsPage() {
    const partnersList = Object.keys(CertificationsList);
    const [activeButton, setActiveButton] = useState(null);

    const handleClick = (label) => {
      setActiveButton(label);
    };

    return (
        <PageContainer>
            <TitleComponent pageTitle={"CERTIFICAÇÕES"} />
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

export default CertificationsPage;

const PageContainer = styled.div`
    width: 100%;
    height: 100%;
    min-height: 100vh;
    flex-direction: column;
    align-items: center;
    gap: 20px;
`

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