import { useState } from "react";
import styled from 'styled-components';
// import apiService from "../services/apiService";
import { useAuth } from "../../contexts/AuthContext";
import VacationsFilterComponent from "../VacationsFilterComponent";
import AprovarFeriasComponent from "../vacations/AprovarFeriasComponent";
import NewVacationComponent from "../NewVacationComponent";
import NewLicenseComponent from "../NewLicenseComponent";

function FeriasAdminComponent() {
    const { user, dados } = useAuth();
    const agenda = dados?.agenda;
    const [carregando, setCarregando] = useState(false);
    const [updated, setUpdated] = useState(false);
    const [action, setAction] = useState("");
    //buscar todas as ferias e licencas
    return (
        <Container>
            {dados && !carregando &&
                <ButtonsContainer>
                    <Button onClick={() => setAction("Filtrar")} $active={action === "Filtrar" ? "show" : ""}>
                        Filtrar Férias
                    </Button>
                    <Button onClick={() => setAction("Criar")} $active={action === "Criar" ? "show" : ""}>
                        Criar Férias
                    </Button>
                    <Button onClick={() => setAction("Aprovar")} $active={action === "Aprovar" ? "show" : ""}>
                        Aprovar Férias
                    </Button>
                     <Button onClick={() => setAction("Licenca")} $active={action === "Licenca" ? "show" : ""}>
                        Criar Licenças
                    </Button>
                </ButtonsContainer>
            }
            {action === "Filtrar" && <VacationsFilterComponent/>}  
            {action === "Aprovar" && <AdjustContainer><AprovarFeriasComponent type={"RH"} /></AdjustContainer>}
            {action === "Criar" && <NewVacationComponent/>}  
            {action === "Licenca" && <NewLicenseComponent/>} 
        </Container>
    );
};

export default FeriasAdminComponent;

const Container = styled.div`
    width: 80%;
    flex-direction: column;
    align-items: center;
    margin-bottom: 50px;
    gap: 25px;
    padding: 20px;
`

const AdjustContainer = styled.div`
    margin: 0 0 0 -350px;
    width: 120%;
`

const ButtonsContainer = styled.div`
    width: 50%;
    justify-content: center;
    gap: 30px;
`

const Button = styled.button`
    min-width: 200px;
    justify-content: center;
    background-color: #F94A5F;
    border: ${({ $active }) => ($active === 'show' ? "3px solid #555" : "3px solid #ff5843")};
    &:hover {
        background-color: ${({ active }) => (active === 'show' ? "#ff5843" : "white")};
        color: ${({ active }) => (active === 'show' ?"white" : '#ff5843')};
        border: 3px solid #ff5843;
    };
`