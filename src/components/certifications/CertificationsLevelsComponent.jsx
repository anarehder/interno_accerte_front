import styled from 'styled-components';
import prices from '../../constants/LevelsPrices';

function CertificationsLevelsComponent({list}) {

    return (
        <PageContainer>
            <LevelTitle>
                <LevelRows>
                        <div><strong>Certificação</strong></div>
                        <div><strong>Nível</strong></div>
                        <div><strong>Valor</strong></div>
                    </LevelRows>
            </LevelTitle>
            {list?.certificacoes?.map((c) => (
                <LevelContainer key={c.nome}>
                    <LevelRows>
                        <div>{c.nome}</div>
                        <div>{c.nivel}</div>
                        <div>{prices[c.nivel].price}</div>
                    </LevelRows>
                </LevelContainer>
            ))
            }

        </PageContainer>
    )
}

export default CertificationsLevelsComponent;

const PageContainer = styled.div`
    width: 80%;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    font-size: 25px;
    margin-bottom: 20px;
`

const LevelContainer = styled.div`
    width: 80%;
    border: 2px solid #007bff;
    flex-direction: column;
    gap: 5px;
    border-radius: 50px;
    padding: 10px;
`

const LevelTitle = styled.div`
    background-color: #007bff;
    border-radius: 50px;
    color: white;
    width: 80%;
    margin-top: 10px;
    padding: 10px 20px;
`

const LevelRows = styled.div`
    display: flex;
    div {
        justify-content: center;
        padding: 10px 20px;
        width: 20%;
        align-items: center;
    }
    div:first-child {
        justify-content: flex-start;
        width:80%;
    }
`