import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import HeaderComponent from "../components/HeaderComponent";
import ContactsComponent from "../components/ContactsComponent";
import HeaderNewComponent from "../components/basic/HeaderNewComponent";
import MenuBarComponent from "../components/basic/MenuBarComponent";

const ContactsPage = () => {{
    const { dados } = useAuth();

    return (
        <Container>
            {/* <HeaderComponent pageTitle={"Contatos"} type={"page"}/> */}
            <HeaderNewComponent pageTitle={"Contatos"} />
            {/* <MenuBarComponent/> */}
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