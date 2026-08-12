import styled from 'styled-components';
import { Link } from "react-router-dom";
import HeaderGGNewComponent from "../../components/gentegestao/HeaderGGNewComponent";

function UsuariosAdminPage(){
    return (
        <PageContainer>
         <HeaderGGNewComponent pageTitle={"Painel Usuários | Admin"} lastPage={"admin"} />
        <Container>
            <ButtonsContainer>
                <Link to="/criarusuario/admin">
                    <Button>
                        Criar Usuario
                    </Button>
                </Link>
                <Link to="/editarusuario/admin">
                    <Button>
                        Editar Usuario
                    </Button>
                </Link>
            </ButtonsContainer>
        </Container>
        </PageContainer>
    );
};

export default UsuariosAdminPage;

const PageContainer = styled.div`
    width: 100%;
    min-height: 100%;
    flex-direction: column;
    align-items: center;
    position: absolute;
    gap: 20px;
    color:rgb(75, 74, 75);
`

const Container = styled.div`
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    gap: 10px;
    color: #555;
    border: none;
    h2 {
        margin: 10px 0;
    }
`

const ButtonsContainer = styled.div`
    width: 50%;
    justify-content: center;
    gap: 30px;
`

const Button = styled.button`
    background: linear-gradient(94.61deg, #E7185A 3.73%, #aa1041ff 133.27%);
    height: 50px;
    &:hover {
        background-color: white;
        background: white;
        color: #E7185A;
        border: 3px solid #ff5843;
    };
`
