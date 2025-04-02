import styled from 'styled-components';
import HeaderComponent from '../components/HeaderComponent';

function AboutUsPage() {

    return (
        <PageContainer>
            <HeaderComponent pageTitle={"Sobre nós"} />
            <AboutUsContainer>
                <Section>
                    <Title>Negócio</Title>
                    <Text>Prover soluções por meio da tecnologia.</Text>
                </Section>
                <Section>
                    <Title>Missão</Title>
                    <Text>Garantir a segurança e disponibilidade das informações do seu negócio.</Text>
                </Section>
                <Section>
                    <Title>Visão</Title>
                    <Text>Estar entre as 100 maiores empresas de tecnologia do país sendo reconhecida por oferecer produtos e serviços inovadores.</Text>
                </Section>
                <Section>
                    <Title>Propósito</Title>
                    <Text>Existimos para acelerar negócios e conectar pessoas a tecnologia e inovação.</Text>
                </Section>
                <Section>
                    <Title>Valores</Title>
                    <Text><strong>TRANSPARÊNCIA:</strong> Transparência a todo momento nas relações entre colaboradores, clientes, fornecedores e parceiros.</Text>
                    <Text><strong>COLABORAÇÃO:</strong> Colaboração e senso de time fazem a diferença.</Text>
                    <Text><strong>ADAPTABILIDADE:</strong> Adaptabilidade para pensar e agir “fora da caixinha”.</Text>
                    <Text><strong>EFICIÊNCIA:</strong> Fazer o que é certo, em tempo hábil e entregar com qualidade.</Text>
                    <Text><strong>RESPEITO:</strong> Cumprir o acordado com o cliente e manter as relações internas sadias e produtivas.</Text>
                </Section>
            </AboutUsContainer>
        </PageContainer>
    )
}

export default AboutUsPage;

const PageContainer = styled.div`
    width: 100%;
    height: 100%;
    min-height: 100vh;
    flex-direction: column;
    align-items: center;
    gap: 20px;
`

const AboutUsContainer = styled.div`
    max-width: 800px;
    margin: 40px auto;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Section = styled.div`
    margin-bottom: 20px;
    gap: 10px;
    flex-direction: column;
`;

const Title = styled.h2`
    color: #067DD1;
    border-bottom: 2px solid #067DD1;
    padding-bottom: 5px;
    margin-bottom: 10px;
    width: 200px;

`;

const Text = styled.p`
    color: #434343;
    font-size: 16px;
    line-height: 1.5;

`;
