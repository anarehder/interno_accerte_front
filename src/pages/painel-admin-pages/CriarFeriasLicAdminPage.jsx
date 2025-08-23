import { useState } from "react";
import styled from 'styled-components';
import { useAuth } from "../../contexts/AuthContext";
import NewVacationComponent from "../../components/vacations/NewVacationComponent";
import NewLicenseComponent from "../../components/admin/NewLicenseComponent";
import HeaderGGNewComponent from "../../components/gentegestao/HeaderGGNewComponent";

function CriarFeriasLicAdminPage() {
    const { dados } = useAuth();
    const [action, setAction] = useState("");

    return (
        <PageContainer>
            <HeaderGGNewComponent pageTitle={"Criar Férias e Licenças | Admin"} lastPage={"admin"} />
            <Container>
                {dados &&
                    <ButtonsContainer>
                        <Button onClick={() => setAction("Criar")}>
                            Criar Férias
                        </Button>
                        <Button onClick={() => setAction("Licenca")}>
                            Criar Licenças
                        </Button>
                    </ButtonsContainer>
                }
                {action === "Criar" &&
                    <>
                        <h2>Criar Férias</h2>
                        <NewVacationComponent />
                    </>
                }
                {action === "Licenca" &&
                    <>
                        <h2>Criar Licença</h2>
                        <NewLicenseComponent />
                    </>
                }
            </Container>
        </PageContainer>
    );
};

export default CriarFeriasLicAdminPage;

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
        margin-top: 25px;
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