import { useState } from 'react';
import styled from 'styled-components';
import ParceriaEducacionalComponent from '../components/ParceriaEducacionalComponent';
import HeaderGGNewComponent from '../components/gentegestao/HeaderGGNewComponent';

function ParceriaEducacionalPage() {
    const [selectedItem, setSelectedItem] = useState("IPOG");
    const options = [
        { value: "IPOG", label: "IPOG" },
    ];

    return (
        <PageContainer>
            <HeaderGGNewComponent  pageTitle={`Parceria Educacional`} />
            <Container>
                {/* <MenuLateral>
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
                </MenuLateral> */}
                <Info>
                {selectedItem === 'IPOG' && <ParceriaEducacionalComponent />}
                </Info>
                    
            </Container>
        </PageContainer>
    )
}

export default ParceriaEducacionalPage;

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
    // width: calc(100% - 320px);
`