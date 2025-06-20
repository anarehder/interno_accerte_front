import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import ContactsComponent from "../components/ContactsComponent";
import HeaderNewComponent from "../components/basic/HeaderNewComponent";

const ContactsPage = () => {{
    const { dados } = useAuth();

    return (
        <Container>
            <HeaderNewComponent pageTitle={"Contatos"} />
            {dados?.agenda && <ContactsComponent contatos={dados?.agenda} />}
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