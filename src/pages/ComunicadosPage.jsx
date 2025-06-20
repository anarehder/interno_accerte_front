import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import ContactsComponent from "../components/ContactsComponent";
import HeaderNewComponent from "../components/basic/HeaderNewComponent";
import { useEffect, useState } from "react";
import apiService from "../services/apiService";

const ComunicadosPage = () => {{
    const { user } = useAuth();
    const [comunicados, setComunicados] = useState([]);
    const [updated, setUpdated] = useState(false);
    console.log(comunicados);
    useEffect(() => {
            if (!user) return;
            const fetchScale = async () => {
                try {
                    const body = {email: user.mail};
                    const response = await apiService.buscarComunicadosEmail(body);
                    setComunicados(response.data);
                    setUpdated(false);
                } catch (error) {
                    console.error("Erro ao buscar a escala:", error);
                }
            };
    
            fetchScale();
        
        }, [updated, user]);

        //listar comunicados, icone titulo e data comeco do texto... botao de abrir, no abrir marcar como lido
    return (
        <Container>
            <HeaderNewComponent pageTitle={"Comunicados"} />
            <div>Teste, {comunicados.length}</div>
        </Container>
    );
  };
}

export default ComunicadosPage;
  

const Container = styled.div`
    flex-direction: column;
    border-radius: 8px;
    align-items: center;

`;