import styled from 'styled-components';
import HeaderGGComponent from '../components/HeaderGGComponent';

function ScalePage() {

    return (
        <PageContainer>
            <HeaderGGComponent pageTitle={"Escala Semanal"} />
            <AdminButton>Gerar Nova  <br/>Semana</AdminButton>
        </PageContainer>
    )
}

export default ScalePage;

const PageContainer = styled.div`
    width: 100%;
    height: 100%;
    min-height: 100vh;
    flex-direction: column;
    align-items: center;
    gap: 20px;
`

const AdminButton = styled.button`
    top: 220px;
    right: 5%;
    position: absolute;
    font-size: 16px;
    justify-content: center;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: #ED1F4C;
    color: white;
    &:hover {
        background-color: #ED1F4C;
    }
`;