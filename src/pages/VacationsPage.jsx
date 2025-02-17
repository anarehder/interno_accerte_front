import styled from 'styled-components';
import TitleComponent from '../components/TitleComponent';

function VacationsPage() {

    return (
        <PageContainer>
            <TitleComponent pageTitle={"FÉRIAS"} />
            <h1>CONFIRA AQUI SEU RELATÓRIO DE FÉRIAS:</h1>
        </PageContainer>
    )
}

export default VacationsPage;

const PageContainer = styled.div`
    width: 100%;
    height: 100%;
    min-height: 100vh;
    flex-direction: column;
    align-items: center;
    gap: 20px;
`
