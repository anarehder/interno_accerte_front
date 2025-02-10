import styled from 'styled-components';


function CertificationsValueComponent() {
    
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
            <LevelContainer>
                <LevelRows>
                    <div>I</div>
                    <div>R$ 100,00</div>
                    <div>Única</div>
                    <div>Cartão Benefícios</div>
                </LevelRows>
                <LevelRows>
                    <div>II</div>
                    <div>R$ 200,00</div>
                    <div>Mensalmente</div>
                    <div>Cartão Benefícios</div>
                </LevelRows>
                <LevelRows>
                    <div>III</div>
                    <div>R$ 300,00</div>
                    <div>Mensalmente</div>
                    <div>Cartão Benefícios</div>
                </LevelRows>
                <LevelRows>
                    <div>IV</div>
                    <div>R$ 400,00</div>
                    <div>Mensalmente</div>
                    <div>Cartão Benefícios</div>
                </LevelRows>
                <LevelRows>
                    <div>V</div>
                    <div>R$ 600,00</div>
                    <div>Mensalmente</div>
                    <div>Cartão Benefícios</div>
                </LevelRows>
            </LevelContainer>
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
    font-size: 30px;
`

const LevelContainer = styled.div`
    width: 80%;
    border: 2px solid #345B68;
    flex-direction: column;
    gap: 5px;
    border-radius: 50px;
    padding: 10px;
`

const LevelTitle = styled.div`
    background-color: #345B68;
    border-radius: 50px;
    color: white;
    width: 80%;
    margin-top: 10px;
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