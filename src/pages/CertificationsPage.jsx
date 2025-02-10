import styled from 'styled-components';
import CertificationsValueComponent from '../components/CertificationsValuesComponent';
import { useState } from 'react';
import TitleComponent from '../components/TitleComponent';

function CertificationsPage() {
    const partnersList = ["VALORES", "MICROSOFT", "ORACLE", "DENODO", "FORTINET", "SEGURANÇA", "LPIC", "ZABBIX"];
    const [activeButton, setActiveButton] = useState(null);
    console.log(activeButton);
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
                        active={activeButton === label}
                        onClick={() => handleClick(label)}
                    >
                        {label}
                        {/* {label} - {activeButton === label && <p>T</p>} */}
                    </Button>
                ))}
            </ButtonsContainer>
            {partnersList.map((label) => (
                activeButton === label && <h1>{label}</h1>))}
            { activeButton === partnersList[0] && <CertificationsValueComponent /> }
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
    margin-top: 40px;
`