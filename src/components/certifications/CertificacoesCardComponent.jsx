import styled from 'styled-components';
import { PiDotsThreeCircleFill } from "react-icons/pi";
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { GoDotFill } from "react-icons/go";
import { useState } from 'react';
import UserPhotoComponent from './PerfilPhotoComponent';


function CertificacoesCardComponent({ certificacao, allowed }) {
    console.log(certificacao);
    const [expanded, setExpanded] = useState(false);
    
    return (
        <HeaderRow>
            <Title  >
                <Status $status={certificacao.ativaPCA === true ? "Ativa" : "Inativa"}>
                    <PiDotsThreeCircleFill size={40} />
                    {certificacao.ativaPCA === true ? "Ativa PCA" : "Inativa PCA"}
                </Status>
                <SubTitle>{certificacao.nome}</SubTitle>
            </Title>
            <HeaderItems>
                <Status $status={(certificacao.bloqueada === true || certificacao?.FuncionarioCerts?.length > Number(certificacao?.limite))  ? "Inativa" : "Ativa"}>
                    <GoDotFill size={24} />
                    {(certificacao.bloqueada === true || certificacao?.FuncionarioCerts?.length > Number(certificacao?.limite)) ? "Bloqueada Para Novas Certificações" : "Disponível Para Novas Certificações"}

                </Status>
                <ProgressContainer>
                    <Progress $status={certificacao.bloqueada === true ? "Inativa" : "Ativa"} $percent={certificacao.limite !== 0 ? (certificacao.FuncionarioCerts?.length / Number(certificacao.limite)).toFixed(1) * 100 : 0} > {certificacao.FuncionarioCerts?.length} </Progress>
                    {(certificacao.FuncionarioCerts?.length / Number(certificacao.limite)) === 0 && (certificacao.FuncionarioCerts?.length / Number(certificacao.limite)).toFixed(1) * 100}
                    <p>{certificacao.limite}</p>
                </ProgressContainer>
                {
                    allowed &&
                    <ToggleButton onClick={() => setExpanded(!expanded)}>
                        {expanded ? <FaChevronUp /> : <FaChevronDown />}
                    </ToggleButton>
                }

            </HeaderItems>
            {expanded && (
                <DetailRow>
                        <DetailCard>
                            <Label>Pessoas Certificadas</Label>
                            <div>
                            {certificacao.FuncionarioCerts.length > 0 &&
                                certificacao.FuncionarioCerts.map((f, index) => (
                                    <Value key={index} >
                                        
                                    <UserPhotoComponent  email={f.Funcionarios.email} nome={f.Funcionarios.nome} url={f.url}/>
                                    <p>{f.Funcionarios?.nome} {f.Funcionarios?.sobrenome}</p>
                                    </Value>
                                ))}
                            </div>
                        </DetailCard>
                    </DetailRow>
            )}

        </HeaderRow>
    )
}
export default CertificacoesCardComponent;


const HeaderRow = styled.div`
    flex-direction: column;
    width: 1200px;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    border-top: 2px solid gray;
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
`;

const Title = styled.div`
    font-size: 22px;
    font-weight: bold;
    align-items: center;
    gap: 15px;
    justify-content: flex-start;
    text-align: center;
    color: #0046ba;
    min-height: 50px;
`;

const SubTitle = styled.div`
    width: calc(100% - 250px);
    justify-content: flex-start;
    align-items: center;
`;

const HeaderItems = styled.div`
    margin: 10px 0;
    gap: 15px;
`;

const Status = styled.div`
    font-size: 16px;
    width: 210px !important;
    gap: 15px;
    margin-left: 15px;
    align-items: center;
    font-weight: bold;
    color: ${({ $status }) => {
    switch ($status) {
      case 'Inativa': return '#dc2626'; // vermelho
      case 'Ativa': return '#16a34a';
      default: return '#6b7280'; // cinza
    }
  }};
`;

const ProgressContainer = styled.div`
    width: 900px; 
    background-color: #e5e7eb;
    border-radius: 5px;
    height: 22px;
    margin: 12px 0;
    border: 1px solid 555;
    font-size: 15px;
    position: relative;
    margin-right: 30px;
    align-items: center;
    font-weight: 700;
    p{
        position: absolute;
        right: -15px;
        font-weight: 700;
    }

`;

const Progress = styled.div`
    border-radius: 5px;
    height: 100%;
    background: ${({ $status, $percent }) =>
        $status === 'Cancelada'
        ? '#dc2626'
        : ($percent < 50 && $percent > 0) ? '#03c149ff' : $percent > 75 ? '#f02906ff' : ($percent >= 50 && $percent < 75) ? '#ee5609ff' : '#E5E7EB'};
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
    font-weight: 700;
`;

const ToggleButton = styled.button`
    margin-right: 15px;
    width: 60px;
    background-color: white;
    border: 2px solid #ccc;
    color: #6b7280;
    &:disabled {
        background-color: #ccc;
        border: 2px solid #ccc;
        cursor: not-allowed;
    }
    &:hover{
        background: none;
    }
`;

const DetailRow = styled.div`
    // background-color: red;
    width: 95%;
    gap: 15px;
    overflow-x: auto;
`

const DetailCard = styled.div`
    gap: 12x;
    flex-direction: column;
    line-height: 20px;
    div{    
        gap: 15px;
        // justify-content: center;
    }
`

const Value = styled.div`
    font-size: 14px;
    line-height: 20px;
    width: 140px;
    color: #555;
    margin-bottom: 10px;
    flex-direction: column;
    align-items: center;
    text-align: center;
    p{
        font-size: 14px;
        line-height: 20px;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        height: 40px;
    }
`;

const Label = styled.div`
    font-size: 15px;
    margin: 15px 0;
    line-height: 15px;
    font-weight: bold;
    text-transform: uppercase;
    color: #555;
`;