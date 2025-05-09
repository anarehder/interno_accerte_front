// SugestoesComponent.jsx
import { useState } from 'react';
import styled from "styled-components";
import { BsPersonVcardFill } from "react-icons/bs";
import { postVagaIndicada } from "../services/graph";
import { useMsal } from "@azure/msal-react";


function IndicAccerteComponent({user}) {
    const { instance, accounts } = useMsal();
    const [arquivo, setArquivo] = useState(null);
    const [area, setArea] = useState("");
    const areas = ["Administrativo", "Arquitetura de Soluções", "Comercial Público", "Comercial Privado", "Financeiro", "Gente e Gestão", "Governança de Dados", "Jurídico", 'Marketing', "Tecnologia da Informação"];
    const handleArquivoChange = (e) => {
        setArquivo(e.target.files[0]);
    };

    const handleIndicar = async () => {
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
        console.log(response.webUrl);
        alert(`Indicação Finalizada com Sucesso! Obrigada!`)
    };

    return (
        <Container>
            <h2><BsPersonVcardFill size={30} /> IndicAccerte</h2>
            <form>
                <ItensContainer>
                    <label>
                        Área:
                    </label>
                    <select
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                    >
                        {areas.map((area) => (
                            <option key={area} value={area}>
                                {area}
                            </option>
                        ))}
                    </select>
                </ItensContainer>

                <ItensContainer>
                    <label>
                        Indique alguém para o banco de talentos. <br/>(extensões permitidas PDF ou DOC):
                    </label>
                    <input type="file" accept=".pdf,.doc,.docx" onChange={handleArquivoChange} />
                </ItensContainer>
                <Button onClick={handleIndicar}>
                    Indicar
                </Button>
            </form>
        </Container>
    );
};

export default IndicAccerteComponent;

const Container = styled.div`
    width:90%;
    color: #555;
    flex-direction: column;
    justify-content: flex-start;
    margin-bottom: 50px;
    h2{
        color:#067DD1;
        text-align: left;
        font-size: 26px;
        margin: 15px 0;
        margin-bottom: 35px;
        display: flex;
        align-items: center;
        svg {
            margin-right: 10px;
        }
    }
    form{
        display: flex;
        justify-content: space-between;
        align-items: center;
        div:first-of-type{
            width: 30%;
        }
        div:nth-of-type(2){
            min-width: 40%;
        }
    }
}
`

const ItensContainer = styled.div`
    flex-direction: column;
    justify-content: flex-start;
    font-size: 20px;
    gap: 20px;
    height: 160px;
    max-width: 50%;
    label{
        text-align: left;
        width: 100%;
    }
    input{
        width: 90%;
        flex-wrap: wrap;
        cursor: pointer;
        margin-top: 10px;
        font-size: 18px;
        gap: 15x;
        padding: 4px;
    }
    ::-webkit-file-upload-button {
        color: #555;
    }
`

const Button = styled.button`
    width: 100px;
    height: 50px;
    justify-content: center;
    border: none;
    border-radius: 10px;
    cursor: pointer;
`;