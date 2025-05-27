import { useState } from "react";
import styled from 'styled-components';
// import apiService from "../services/apiService";
import { useAuth } from "../../contexts/AuthContext";

function FeriasAdminComponent(){
    const { user, dados } = useAuth();
    const agenda = dados?.agenda;
    //buscar todas as ferias e licencas
    return (
        <Container>
            {dados &&
                <div>Ferias</div>
            }
        </Container>
    );
};

export default FeriasAdminComponent;

const Container = styled.div`
    width: 60%;
    flex-direction: column;
    align-items: center;
    margin-bottom: 50px;
    gap: 25px;
    padding: 20px;
    div { 
        justify-content: center;
        align-items: center;
        gap: 20px;
        select{
          width: 250px;
        }
    }
`
