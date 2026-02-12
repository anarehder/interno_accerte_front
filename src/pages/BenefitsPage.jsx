import { useState } from 'react';
import { MdOutlineRadioButtonChecked } from "react-icons/md";
import { MdOutlineRadioButtonUnchecked } from "react-icons/md";
import styled from 'styled-components';
import FAQComponent from '../components/FAQComponent';
import HeaderGGNewComponent from '../components/gentegestao/HeaderGGNewComponent';
import { useAuth } from '../contexts/AuthContext';

function BenefitsPage() {
    const { dados } = useAuth();
    const [selectedItem, setSelectedItem] = useState("");
    const options = dados?.beneficios?.map(f => ({
            value: f.name,
            label: f.name.slice(0,-4),
            url: f.url
        }))
        console.log(selectedItem);
        // < a href = { file.url } target = { "_blank"} key = { index } >
        //     <Image src={file.url} alt={`Slide ${file.name}`} />
        //             </a >
    return (
        <PageContainer>
            <HeaderGGNewComponent  pageTitle={`Benefícios`} />
            <Container>
                <MenuLateral>
                    {options.map((item) => (
                        <button key={item.label} onClick={() => setSelectedItem(prev => prev.label === item.label ? "" : item)}>
                            {selectedItem.label === item.label ? (
                                <MdOutlineRadioButtonChecked size={16} />
                            ) : (
                                <MdOutlineRadioButtonUnchecked size={16} />
                            )}
                            {item.label}
                        </button>
                    ))}
                </MenuLateral>
                <Info>
                    {selectedItem !== "" && 
                    < a href={selectedItem.url} target={"_blank"} >
                        <Image src={selectedItem.url} alt={`Imagem ${selectedItem.name}`} />
                    </a >}
                </Info>
            </Container>
        </PageContainer>
    )
}

export default BenefitsPage;

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
    width: 350px;
    min-height: 65vh;
    gap: 15px;
    flex-direction: column;
    padding-right: 50px;
    border-right: 1px solid #555;
    button {
        background: linear-gradient(to bottom, #F1314D,rgb(152, 8, 61));
        text-align: left;
        justify-content: flex-start;
        gap: 15px;
    }
`

const Info = styled.div`
    width: calc(100% - 320px);
`

const Image = styled.img`
    width: 100%;
`