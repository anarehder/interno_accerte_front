import { useState } from 'react';
import { MdOutlineRadioButtonChecked } from "react-icons/md";
import { MdOutlineRadioButtonUnchecked } from "react-icons/md";
import styled from 'styled-components';
import ParceriaEducacionalComponent from '../components/ParceriaEducacionalComponent';
import BeneficiosComponent from '../components/gentegestao/BeneficiosComponent';
import HeaderGGNewComponent from '../components/gentegestao/HeaderGGNewComponent';

function BeneficiosPage() {
    const [selectedItem, setSelectedItem] = useState("");
    const options = [
        { value: "AFASTAMENTOS", label: "Afastamentos" },
        // { value: "AUXILIO_ALIMENTACAO", label: "Auxílio Alimentação" },
        // { value: "DAYOFF", label: "Day Off" },
        { value: "HOME_OFFICE", label: "Home Office" },
        { value: "PARCERIA_EDUCACIONAL", label: "Parceria Educacional" },
        // { value: "AUXILIO_SAUDE", label: "Plano de Saúde" },
        // { value: "AUXILIO_ODONTOLOGICO", label: "Plano Odontológico" },
        { value: "CERTIFICACAO", label: "Programa de Certificação" },
        // { value: "SEGURO_VIDA", label: "Seguro de Vida" },
        { value: "VALE_TRANSPORTE", label: "Vale Transporte" },
        { value: "WELLHUB_GYMPASS", label: "Wellhub (Gympass)" },
    ];

    return (
        <PageContainer>
            <HeaderGGNewComponent pageTitle={"Benefícios"} />
            <Container>
                <MenuLateral>
                    {options.map((item) => (
                        <button key={item.label} onClick={() => setSelectedItem(item.label)}>
                            {selectedItem === item.label ? (
                                <MdOutlineRadioButtonChecked size={16} />
                            ) : (
                                <MdOutlineRadioButtonUnchecked size={16} />
                            )}
                            {item.label}
                        </button>
                    ))}
                </MenuLateral>
                <Info>
                {selectedItem === 'Parceria Educacional' && <ParceriaEducacionalComponent />}
                    
                    {(selectedItem !== 'Parceria Educacional' && selectedItem !== "") && <BeneficiosComponent item={selectedItem} />}

                </Info>
                    
            </Container>
        </PageContainer>
    )
}

export default BeneficiosPage;

const PageContainer = styled.div`
    width: 100%;
    height: 100%;
    min-height: 100vh;
    flex-direction: column;
    color: #555;
    align-items: center;
`

const Container = styled.div`
    margin-top: 40px;
    width: 95%;
    gap: 50px;
    margin-bottom: 30px;
`

const MenuLateral = styled.div`
    width: 320px;
    gap: 15px;
    flex-direction: column;
    padding-right: 50px;
    border-right: 1px solid #555;
    button {
        text-align: left;
        justify-content: flex-start;
        gap: 15px;
    }
`

const Info = styled.div`
    width: calc(100% - 320px);
`