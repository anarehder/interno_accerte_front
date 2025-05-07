import { useState } from 'react';
import HeaderGGComponent from '../components/HeaderGGComponent';
import { MdOutlineRadioButtonChecked } from "react-icons/md";
import { MdOutlineRadioButtonUnchecked } from "react-icons/md";
import { CiCircleMinus } from "react-icons/ci";
import { CiCirclePlus } from "react-icons/ci";
// import IPOG1 from "../assets/IPOG/IPOG1.png";
// import IPOG2 from "../assets/IPOG/IPOG2.png";
// import IPOG3 from "../assets/IPOG/IPOG3.png";
// import IPOG4 from "../assets/IPOG/IPOG4.png";
// import IPOG5 from "../assets/IPOG/IPOG5.png";
// import IPOG6 from "../assets/IPOG/IPOG6.png";
// import IPOG7 from "../assets/IPOG/IPOG7.png";
// import IPOG8 from "../assets/IPOG/IPOG8.png";
import styled from 'styled-components';

function BeneficiosPage() {
    const [selectedItem, setSelectedItem] = useState("");
    const [open, setOpen] = useState(false);

    return (
        <PageContainer>
            <HeaderGGComponent pageTitle={"Benefícios"} />
            <Container>
                <MenuLateral>
                    
                    <button onClick={() => setSelectedItem("AUXILIO_ALIMENTACAO")}>
                        {selectedItem === "AUXILIO_ALIMENTACAO" ? <MdOutlineRadioButtonChecked size={16} /> : <MdOutlineRadioButtonUnchecked size={16} />}
                        Auxílio Alimentação
                    </button>
                    <button onClick={() => setSelectedItem("DAYOFF")}>
                        {selectedItem === "DAYOFF" ? <MdOutlineRadioButtonChecked size={16} /> : <MdOutlineRadioButtonUnchecked size={16} />}
                        Day Off
                    </button>
                    <button onClick={() => setSelectedItem("HOME_OFFICE")}>
                        {selectedItem === "HOME_OFFICE" ? <MdOutlineRadioButtonChecked size={16} /> : <MdOutlineRadioButtonUnchecked size={16} />}
                        Home Office
                    </button>
                    <button onClick={() => setSelectedItem("PARCERIAS")}>
                        {selectedItem === "PARCERIAS" ? <MdOutlineRadioButtonChecked size={16} /> : <MdOutlineRadioButtonUnchecked size={16} />}
                        Parceria Educacional
                    </button>
                    <button onClick={() => setSelectedItem("AUXILIO_SAUDE")}>
                        {selectedItem === "AUXILIO_SAUDE" ? <MdOutlineRadioButtonChecked size={16} /> : <MdOutlineRadioButtonUnchecked size={16} />}
                        Plano de Saúde
                    </button>
                    <button onClick={() => setSelectedItem("AUXILIO_ODONTOLOGICO")}>
                        {selectedItem === "AUXILIO_ODONTOLOGICO" ? <MdOutlineRadioButtonChecked size={16} /> : <MdOutlineRadioButtonUnchecked size={16} />}
                        Plano Odontológico
                    </button>
                    <button onClick={() => setSelectedItem("CERTIFICACAO")}>
                        {selectedItem === "CERTIFICACAO" ? <MdOutlineRadioButtonChecked size={16} /> : <MdOutlineRadioButtonUnchecked size={16} />}
                        Programa de Certificação
                    </button>
                    <button onClick={() => setSelectedItem("SEGURO_VIDA")}>
                        {selectedItem === "SEGURO_VIDA" ? <MdOutlineRadioButtonChecked size={16} /> : <MdOutlineRadioButtonUnchecked size={16} />}
                        Seguro de Vida
                    </button>
                    <button onClick={() => setSelectedItem("VALE_TRANSPORTE")}>
                        {selectedItem === "VALE_TRANSPORTE" ? <MdOutlineRadioButtonChecked size={16} /> : <MdOutlineRadioButtonUnchecked size={16} />}
                        Vale Transporte
                    </button>
                    <button onClick={() => setSelectedItem("WELLHUB")}>
                        {selectedItem === "WELLHUB" ? <MdOutlineRadioButtonChecked size={16} /> : <MdOutlineRadioButtonUnchecked size={16} />}
                        Wellhub
                    </button>
                </MenuLateral>
                <Descricoes>
                    <div> DOWNLOADS</div>
                    <div>FAQS</div>
                    {open ?
                    <Perguntas>1. Quem é elegível a fazer home office? <CiCircleMinus size={24}  onClick={() => setOpen(!open)}/></Perguntas>
                    :
                    <Perguntas>1. Quem é elegível a fazer home office? <CiCirclePlus size={24} onClick={() => setOpen(!open)}/></Perguntas>
                    }

                    {open && 
                    <Respostas>
                        A política se aplica aos colaboradores e parceiros da Accerte Tecnologia (celetistas e prestadores de serviço PJ), área administrativa e técnica.
                        <span>Estagiários e jovens aprendizes não têm direito ao home office.</span>
                    </Respostas>}
                    
                </Descricoes>
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
    img{
        width: 101%;
        display: block;
        margin: 0 auto;
    }
`

const Container = styled.div`
    margin-top: 40px;
    width: 95%;
    gap: 30px;
    justify-content: space-between;
    margin-bottom: 30px;
`

const MenuLateral = styled.div`
    width: 450px;
    gap: 15px;
    flex-direction: column;
    padding-right: 15px;
    border-right: 1px solid #555;
    button {
        text-align: left;
        justify-content: flex-start;
        gap: 15px;
    }
    // background-color: red;
`
const Descricoes = styled.div`
    flex-direction: column;
    // background-color: blue;
    font-size: 18px;
    line-height: 24px;
`

const Perguntas = styled.div`
    width: 90%;
    justify-content: space-between;
    color: #555;
    padding: 15px;
    margin-right: 25%;
    border: 1px solid #555;
    border-radius: 30px;
    margin: 15px 0;
    
`

const Respostas = styled.div`
    flex-direction: column;
    padding: 15px;
    text-align: justify;
    width: 90%;
    span{
        font-weight: 700;
    }
`