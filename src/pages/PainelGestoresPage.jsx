import { useState } from 'react';
import styled from 'styled-components';
import { MdOutlineRadioButtonChecked } from "react-icons/md";
import { MdOutlineRadioButtonUnchecked } from "react-icons/md";
import HeaderComponent from '../components/HeaderComponent';
import CriarVagaComponent from '../components/CriarVagaComponent';
import BuscarVagasComponent from '../components/BuscarVagasComponent';
import HumorGestoresComponent from '../components/HumorGestoresComponent';

function PainelGestoresPage() {
    const [selectedItem, setSelectedItem] = useState("");
    // buscar gestores
    // se meu email tiver na lista ok

    return (
        <PageContainer>
            <HeaderComponent pageTitle={"Painel Gestores"} />
            <div>
                <SideBar>
                    <button onClick={() => setSelectedItem("ReqVaga")}>
                        {selectedItem === "ReqVaga" ? <MdOutlineRadioButtonChecked size={16} /> : <MdOutlineRadioButtonUnchecked size={16} />}
                        Requisição de Vaga
                    </button>
                    <button onClick={() => setSelectedItem("ListarVagas")}>
                        {selectedItem === "ListarVagas" ? <MdOutlineRadioButtonChecked size={16} /> : <MdOutlineRadioButtonUnchecked size={16} />}
                        Minhas Vagas
                    </button>
                    <button onClick={() => setSelectedItem("Humor")}>
                        {selectedItem === "Humor" ? <MdOutlineRadioButtonChecked size={16} /> : <MdOutlineRadioButtonUnchecked size={16} />}
                        Termômetro de Humor
                    </button>
                </SideBar>
                <div>    
                    {selectedItem === "ReqVaga" && <CriarVagaComponent setSelectedItem={setSelectedItem}/>}
                    {selectedItem === "ListarVagas" && <BuscarVagasComponent />}
                    {selectedItem === "Humor" && <HumorGestoresComponent />}
                </div>
            </div>

        </PageContainer>
    )
}

export default PainelGestoresPage;

const PageContainer = styled.div`
    width: 100%;
    height: 60vh;
    flex-direction: column;
    align-items: center;
    position: absolute;
    gap: 20px;
    color:rgb(75, 74, 75);
`
const SideBar = styled.div`
    width: 350px;
    position: fixed;
    padding: 15px 0;
    align-items: center;
    height: 60vh;
    border-right: 2px solid gray;
    flex-direction: column;
    gap: 30px;
    button{
        width: 300px;
        height: 60px;
        font-size: 22px;
        align-items: center;
        justify-content: flex-start;
        gap: 10px;
        &: hover {
        cursor: pointer;
        }
    }
`