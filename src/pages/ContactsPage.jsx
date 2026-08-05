import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import ContactsComponent from "../components/ContactsComponent";
import HeaderNewComponent from "../components/basic/HeaderNewComponent";
import { useFuncionarios } from "../contexts/FuncionariosContext";

const ContactsPage = () => {{
    // const { dados } = useAuth();
    const { dados } = useFuncionarios();

    return (
        <Container>
            <HeaderNewComponent pageTitle={"Contatos"} />
            {dados && <ContactsComponent dados={dados} />}
        </Container>
    );
  };
}

export default ContactsPage;
  

const Container = styled.div`
    flex-direction: column;
    border-radius: 8px;
    align-items: center;
    
`;