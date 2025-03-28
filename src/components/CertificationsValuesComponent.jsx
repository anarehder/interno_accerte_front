import styled from 'styled-components';
import prices from "../assets/LevelsPrices";

function CertificationsValueComponent() {
    const pricesArray = Object.keys(prices);
    console.log(prices[pricesArray[0]]);
    return (
        <PageContainer>
            <LevelTitle>
                <LevelRows>
                        <div><strong>Nível</strong></div>
                        <div><strong>Premiação</strong></div>
                        <div><strong>Frequência</strong></div>
                        <div><strong>Plataforma</strong></div>
                    </LevelRows>
            </LevelTitle>
            {pricesArray?.map((i, index) => (
                 <LevelContainer key={index}>
                 <LevelRows>
                     <div>{i}</div>
                     <div>{prices[i].price}</div>
                     <div>{prices[i].frequency}</div>
                     <div>{prices[i].paymentMethod}</div>
                 </LevelRows>
                 </LevelContainer> ))
            }
        </PageContainer>
    )
}

export default CertificationsValueComponent;

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
    }
    div:first-child {
        width: 40%;
    }
`