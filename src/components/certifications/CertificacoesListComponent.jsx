import styled from 'styled-components';
import AppleLogo from "../../assets/logos-parceiros/apple_branco.png";
import AndroidLogo from "../../assets/logos-parceiros/google_play.png";
import CajuLogo from "../../assets/logos-parceiros/caju.png";  // Substitua pelos caminhos corretos
import { PiDotsThreeCircleFill } from "react-icons/pi";
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useState } from 'react';

function CertificacoesListComponent() {
    const [expanded, setExpanded] = useState(false);
    
    const imageMap = {
            Apple: AppleLogo,
            Android: AndroidLogo,
            Caju: CajuLogo,
            // Adicione outros rótulos e imagens conforme necessário
          };

    return (
        <PageContainer>
            <div>TOP 3</div>
            <div><strong>EMISSORES</strong></div>
            <div>
                <EmissorButton>
                    {/* {options.map((opt, i) => ( */}
                    {/* <img src={imageMap[opt.label]} alt={opt.label} /> */}
                    {/* ))} */}
                    <img src={imageMap['Apple']} alt={'Apple'} />

                </EmissorButton>
                <EmissorButton>
                    <img src={imageMap['Apple']} alt={'Apple'} />
                </EmissorButton>
            </div>
            <div>
                <NivelButton color={"selected"}>Nível I </NivelButton>
                <NivelButton color={"t"}>Nível II </NivelButton>
                <NivelButton color={"t"}>Nível III </NivelButton>
                <NivelButton color={"t"}>Nível IV </NivelButton>
                <NivelButton color={"t"}>Nível V </NivelButton>
                <NivelButton color={"t"}>Extras </NivelButton>
            </div>
            <div>
                <ValorButton>VALOR DE BONIFICAÇÃO | RS 100,00</ValorButton>
                TOP 3
            </div>
            <div>
                <HeaderRow>
                    <Title>
                        <Title>Azure Fundamentals - 2025</Title>
                        <SubTitle> Inativa desde: 01/08/2025 </SubTitle>
                    </Title>
                    <HeaderItems>
                        <Status $status={"Ativa"}>
                            <PiDotsThreeCircleFill size={40} />
                            Ativa
                        </Status>
                        <ProgressContainer>
                            <Progress $status={"Ativa"} $percent={75} > 3 </Progress>
                            <p>4</p>
                        </ProgressContainer>
                        <ToggleButton onClick={() => setExpanded(!expanded)}>
                            {expanded ? <FaChevronUp /> : <FaChevronDown />}
                        </ToggleButton>
                    </HeaderItems>
                </HeaderRow>
            </div>
            {/* {list?.certificacoes?.map((c) => (
                <LevelContainer key={c.nome}>
                    <LevelRows>
                        <div>{c.nome}</div>
                        <div>{c.nivel}</div>
                        <div>{prices[c.nivel].price}</div>
                    </LevelRows>
                </LevelContainer>
            ))
            } */}

        </PageContainer>
    )
}

export default CertificacoesListComponent;

const PageContainer = styled.div`
    width: 80%;
    // min-height: 110vh;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    font-size: 25px;
    margin-bottom: 20px;
    gap: 30px;
`

const EmissorButton = styled.div`
    width: 175px;
    height: 65px;
    border-radius: 25px;
    justify-content: center;
    align-items: center;
    margin: 0 15px;
    img{
        height: 70%;
    }
    background-color: gray;
`

const NivelButton = styled.div`
    width: 95px;
    height: 40px;
    color: ${({ $color }) => ($color  === 'selected' ? "#0046ba" : "white")};
    background-color: ${({ $color }) => ($color  === 'selected' ? "white" : "#0046ba")};
    font-weight: 700;
    border-radius: 15px;
    font-size: 20px;
    justify-content: center;
    align-items: center;
    margin: 0 10px;
    box-shadow: 0px 4px 4px 0px #00000040;
`

const ValorButton = styled.div`
    width: 400px;
    height: 40px;
    background-color: white;
    color: #0046ba;
    font-weight: 500;
    border-radius: 15px;
    font-size: 20px;
    justify-content: center;
    align-items: center;
    margin: 0 10px;
    box-shadow: 0px 4px 4px 0px #00000040;
`


const HeaderRow = styled.div`
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
`;

const Title = styled.div`
    font-size: 22px;
    font-weight: bold;
    align-items: center;
    justify-content: space-between;
    text-align: center;
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
    background-color: #007BFF;
    color: white;
    min-height: 50px;
    text-indent: 15px;
    p {
        font-size: 15px;
        line-height: 18px;
        width: 150px;
        margin-right: 15px;
        text-align: right;
    }
`;

const SubTitle = styled.div`
    width: 40%;
    font-size: 15px;
    font-weight: 500;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    margin-right: 10px;
`;

const HeaderItems = styled.div`
    justify-content: space-around;
    margin: 10px 0;
`;

const Status = styled.div`
    font-size: 16px;
    width: 45%;
    margin-left: 15px;
    align-items: center;
    font-weight: bold;
    color: ${({ $status }) => {
    switch ($status) {
      case 'Inativa': return '#dc2626'; // vermelho
      case 'Bloquada': return '#F9933C';;
      case 'Ativa': return '#16a34a';
      default: return '#6b7280'; // cinza
    }
  }};
`;

const ProgressContainer = styled.div`
    width: 400px; 
    background-color: #e5e7eb;
    border-radius: 12px;
    height: 22px;
    margin: 12px 0;
    border: 1px solid 555;
    font-size: 18px;
    position: relative;
    margin-right: 30px;
    align-items: center;
    p{
        position: absolute;
        right: -15px;
    }

`;

const Progress = styled.div`
    border-radius: 5px;
    height: 100%;
    background: ${({ $status }) =>
        $status === 'Cancelada'
        ? '#dc2626'
        : 'linear-gradient(to left, #f74600, #22c55e)'};
    width: ${({ $percent }) => $percent}%;
    justify-content: flex-end;
    transition: width 0.3s ease;
    font-size: 18px;
    position: relative;
    padding-right: 10px;
    color: white;
    align-items: center;
    text-indent: 10px;
    text-align: right;
`;

const ToggleButton = styled.button`
    background: none;
    margin-right: 15px;
    width: 60px;
    border: none;
    color: #6b7280;
    &:hover{
        background: none;
    }
`;
