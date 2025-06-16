// SugestoesComponent.jsx
import { useState } from 'react';
import styled from "styled-components";
import { postVagaIndicada } from "../../services/graph";
import { useMsal } from "@azure/msal-react";
import IndicaIcon from "../../assets/basic/indica-icon.png"


function IndicAccerteComponent({user}) {
    const { instance, accounts } = useMsal();
    const [arquivo, setArquivo] = useState(null);
    const [area, setArea] = useState("");
    const areas = ["Administrativo", "Arquitetura de Soluções", "Comercial Público", "Comercial Privado", "Financeiro", "Gente e Gestão", "Governança de Dados", "Jurídico", 'Marketing', "Tecnologia da Informação"];

    const handleArquivoChange = (e) => {
        setArquivo(e.target.files[0]);
    };

    const handleIndicar = async (e) => {
        e.preventDefault(); // ⛔️ impede o reload
        if (!arquivo) {
            alert("Selecione um currículo antes de indicar.");
            return;
        }
        if(area===""){
            alert("Selecione uma área antes de indicar.");
            return;
        }
        
        const novoNome = `${area} (${user.displayName}) - ${arquivo.name}`;
        const local = 'BANCO DE TALENTOS';
        const novoArquivo = new File([arquivo], novoNome, {
            type: arquivo.type,
        });

        const response = await postVagaIndicada(instance, accounts, local, novoArquivo);
        alert(`Indicação Finalizada com Sucesso! Obrigada!`);
        setArquivo(null);
        setArea("");
        // console.log(response.webUrl);

    };

    return (
        <Container>
            <Title><img src={IndicaIcon} alt={"Ideia"} /> Indic<span>Accerte</span> </Title>
            <form>
                <ItensContainer>
                    <select value={area} onChange={(e) => setArea(e.target.value)}>
                        <option value={""}>Área</option>
                        {areas.map((area) => (
                            <option key={area} value={area}>
                                {area}
                            </option>
                        ))}
                    </select>
                </ItensContainer>

                <ItensContainer>
                    <label>
                        Indique alguém para o banco de talentos. (extensões permitidas PDF ou DOC):
                    </label>
                    <input type="file" accept=".pdf,.doc,.docx" onChange={handleArquivoChange} />
                </ItensContainer>
                <Button onClick={handleIndicar}>
                    ENVIAR
                </Button>
            </form>
        </Container>
    );
};

export default IndicAccerteComponent;

const Container = styled.div`
    width: 90%;
    color: #002972;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    margin-bottom: 50px;
    form{
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
}
`

const Title = styled.div`
    height: 60px;   
    font-size: 30px;
    align-items: center;
    justify-content: flex-start;
    line-height: 45px;
    margin-bottom: 20px;
    font-weight: 500;
    font-size: 30px;
    img{
        height: 60px;
    }
`

const ItensContainer = styled.div`
    width: 90%;
    align-items: center;
    margin: 10px 0;
    label{
        text-align: left;
        width: 100%;
    }
    input{
        width: 650px;
        flex-wrap: wrap;
        cursor: pointer;
        margin-top: 10px;
        font-size: 16px;
        gap: 20x;
        padding: 4px;
    }
    select{
        width: 100%;
        height: 50px;
        color: #002972;
        border-radius: 8px;
        box-shadow: 2px 2px 3px 2px rgba(0, 0, 0, 0.3);
    }
    ::-webkit-file-upload-button {
        color: #555;
        border-radius: 8px;
        padding: 4px 10px;
        margin-right: 10px;
    }
`

const Button = styled.button`
    height: 50px;
    justify-content: center;
    border: none;
    margin: 10px 0;
    border-radius: 10px;
    cursor: pointer;
    color: white;
    box-shadow: 0px 4px 4px 0px #00000040;
    font-weight: 600;
    font-size: 25px;
    line-height: 14px;
    background: linear-gradient(to right,#205fdd, #001143);
`;