import { useState } from 'react';
import styled from 'styled-components';
import { MdOutlineRadioButtonChecked } from "react-icons/md";
import { MdOutlineRadioButtonUnchecked } from "react-icons/md";
import HeaderComponent from '../components/HeaderComponent';
import CriarVagaComponent from '../components/CriarVagaComponent';

function PainelGestoresPage() {
    const [selectedItem, setSelectedItem] = useState("");

    return (
        <PageContainer>
            <HeaderComponent pageTitle={"Painel Gestores"} />
            <div>
                <SideBar>
                    <div onClick={() => setSelectedItem("ReqVaga")}>
                        {selectedItem === "ReqVaga" ? <MdOutlineRadioButtonChecked size={16} /> : <MdOutlineRadioButtonUnchecked size={16} />}
                        Requisição de Vaga
                    </div>
                    <div onClick={() => setSelectedItem("RelTI")}>
                        {selectedItem === "RelTI" ? <MdOutlineRadioButtonChecked size={16} /> : <MdOutlineRadioButtonUnchecked size={16} />}
                        Relatórios TI
                    </div>
                    <div onClick={() => setSelectedItem("DashMark")}>
                        {selectedItem === "DashMark" ? <MdOutlineRadioButtonChecked size={16} /> : <MdOutlineRadioButtonUnchecked size={16} />}
                        Dashboards Marketing
                    </div>
                </SideBar>
                <div>    
                    {selectedItem === "ReqVaga" && <CriarVagaComponent setSelectedItem={setSelectedItem}/>}
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
    // margin-bottom: 35px;
    position: relative;
    color:rgb(75, 74, 75);
`
const SideBar = styled.div`
    width: 400px;
    position: fixed;
    padding: 15px 0;
    height: 60vh;
    border-right: 2px solid gray;
    margin: 0 15px;
    flex-direction: column;
    gap: 30px;
    div{
        font-size: 22px;
        align-items: center;
        gap: 5px;
        &: hover {
        cursor: pointer;
        }
    }
`