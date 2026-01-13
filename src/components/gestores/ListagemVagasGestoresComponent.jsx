import React, { useState } from 'react';
import styled from 'styled-components';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { GoDotFill } from "react-icons/go";
import { FaDotCircle } from "react-icons/fa";
import { IoBowlingBall } from "react-icons/io5";
import { SiPolkadot } from "react-icons/si";
import { PiDotsThreeCircleFill } from "react-icons/pi";
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/apiService';


function ListagemVagasGestoresComponent({vaga, setUpdated, getProgressPercent}) {
    const {user} = useAuth();
    const [expanded, setExpanded] = useState(false);
    const [novoStatus, setNovoStatus] = useState(vaga.status);
    
    const progress = getProgressPercent(vaga.status);
    // console.log(progress);
    const handleStatusChange = (novoStatus) => {
        setNovoStatus(novoStatus);
    };

    const handleSubmit= async ()=>{
        const body = {
            "email": user.mail,
            "id": vaga.id,
            "status": novoStatus
        }
        const confirmado = window.confirm(`Deseja realmente alterar o status da vaga para ${novoStatus}?`);

        if (confirmado) {
            try {
                await apiService.editarVagaStatus(body);
                setUpdated(true);
                setExpanded(false);
                alert("Status alterado")
            } catch (error) {
                console.error("Erro ao editar status", error.data);
            }
        } else {
            // console.log('Ação cancelada.');
        }
    };
    // console.log(vaga);
    return (
        <PageContainer>
            <HeaderRow>
                <Title>
                    <Title>{vaga.cargo} {vaga.confidencial === 1 ? " - Confidencial" : ""}</Title>
                    <SubTitle>Criada em {new Date(vaga.createdAt).toLocaleDateString()}</SubTitle>
                </Title>
                <HeaderItems>
                    <Status $status={vaga.status}>
                        <PiDotsThreeCircleFill size={40} />
                        {vaga.status}
                    </Status>
                    <ProgressContainer>
                        <Progress $status={vaga.status} $percent={progress} />
                    </ProgressContainer>
                    <ToggleButton onClick={() => setExpanded(!expanded)}>
                        {expanded ? <FaChevronUp /> : <FaChevronDown />}
                    </ToggleButton>
                </HeaderItems>
            </HeaderRow>
            {expanded && (
                <Details>
                    <DetailRow>
                        <DetailCard>
                            <Label>Solicitante</Label>
                            <Value>{vaga.Solicitante}</Value>
                        </DetailCard>
                        <DetailCard>
                            <Label>Tipo</Label>
                            <Value>{vaga.tipo}</Value>
                        </DetailCard>
                        <DetailCard>
                            <Label>Contrato</Label>
                            <Value>{vaga.contrato}</Value>
                        </DetailCard>
                        <DetailCard>
                            <Label>Salário</Label>
                            <Value>{Number(vaga.salario).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Value>
                        </DetailCard>
                    </DetailRow>
                    <DetailRow>
                        <DetailCard>
                            <Label>Área</Label>
                            <Value>{vaga.area}</Value>
                        </DetailCard>
                        <DetailCard>
                            <Label>Motivo</Label>
                            <Value>{vaga.motivo}</Value>
                        </DetailCard>
                        <DetailCard>
                            <Label>Substituído</Label>
                            <Value>{vaga.Substituido ? vaga.Substituido : "-"}</Value>
                        </DetailCard>
                        <DetailCard>
                            <Label>Última Atualização</Label>
                            <Value>{new Date(vaga.updatedAt).toLocaleDateString()}</Value>
                        </DetailCard>
                    </DetailRow>
                    <DetailRow>
                        <DetailCard>
                            <Label>Formação Acadêmica</Label>
                            <Value>{vaga.formacaoAcad}</Value>
                        </DetailCard>
                        <DetailCard>
                            <Label>Salário Variável</Label>
                            <Value>{vaga.sal_variavel === 1 ? "Sim" : "Não"}</Value>
                        </DetailCard>
                        <DetailCard>
                            <Label>Início Imediato</Label>
                            <Value>{vaga.imediato === 1 ? "Sim" : "Não"}</Value>
                        </DetailCard>
                        
                        <DetailCard>
                            <Label>Quantidade de Vagas</Label>
                            <Value>{vaga.qtdeDeVagas}</Value>
                        </DetailCard>
                    </DetailRow>

                    <DetailRow>
                        <DetailCard>
                            <Label>Hard Skills</Label>
                            <Value>
                                {vaga.reqHardSkills.split('\n').map((linha, index) => (
                                    <p key={index}>{linha}</p>
                                ))}
                            </Value>
                            {/* <Value>{vaga.reqHardSkills}</Value> */}
                        </DetailCard>
                        <DetailCard>
                            <Label>Soft Skills</Label>
                            <Value>
                                {vaga.reqSoftSkills.split('\n').map((linha, index) => (
                                    <p key={index}>{linha}</p>
                                ))}
                            </Value>
                        </DetailCard>
                        <DetailCard>
                            <Label>Atividades</Label>
                            <Value>
                                {vaga.atividades.split('\n').map((linha, index) => (
                                    <p key={index}>{linha}</p>
                                ))}
                            </Value>
                        </DetailCard>
                        <DetailCard>
                            <Label>Informações adicionais</Label>
                            <Value>
                                {vaga.informacoes.split('\n').map((linha, index) => (
                                    <p key={index}>{linha}</p>
                                ))}
                            </Value>
                        </DetailCard>
                    </DetailRow>

                    {(user.mail === "ana.rehder@accerte.com.br" || user.mail === "maria.silva@accerte.com.br") ? (
                        <EditRow>
                            <div>
                                <h2>Alterar Status: </h2>
                                <select value={novoStatus} onChange={(e) => handleStatusChange(e.target.value)}>
                                    <option value="">{novoStatus}</option>
                                    <option value="Stand By">Stand By</option>
                                    <option value="Divulgação">Divulgação</option>
                                    <option value="Triagem curricular">Triagem curricular</option>
                                    <option value="Validação curricular">Validação curricular</option>
                                    <option value="Seleção em agendamento">Seleção em agendamento</option>
                                    <option value="Entrevista com o Gestor">Entrevista com o Gestor</option>
                                    <option value="Entrega Documentos Admissão">Entrega Documentos Admissão</option>
                                    <option value="Testes e referências">Testes e referências</option>
                                    <option value="Validação do perfil">Validação do perfil</option>
                                    <option value="Concluída">Concluída</option>
                                    <option value="Cancelada">Cancelada</option>
                                </select>
                            </div>
                            <button onClick={handleSubmit}>Alterar Status</button>
                        </EditRow>
                    ):
                    <EditRow>
                            <div>
                                <h2>Alterar Status: </h2>
                                <select value={novoStatus} onChange={(e) => handleStatusChange(e.target.value)}>
                                    <option value="">{novoStatus}</option>
                                    <option value="Cancelada">Cancelada</option>
                                </select>
                            </div>
                            <button onClick={handleSubmit}>Alterar Status</button>
                        </EditRow>
                    }
                </Details>
            )}
        </PageContainer>
    );
};

export default ListagemVagasGestoresComponent;

const PageContainer = styled.div`
    width: 80%;
    border-radius: 30px;
    border: 1px solid gray;
    flex-direction: column;
    margin-bottom: 30px;
    color: #555;
`;

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
    justify-content: flex-start;
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
      case 'Cancelada': return '#dc2626'; // vermelho
      case 'Solicitado': return '#F9933C';
      case 'Stand By': return '#f59e0b'; // amarelo escuro
      case 'Divulgação': return '#f59e0b';
      case 'Triagem curricular': return '#fbbf24';
      case 'Validação curricular': return '#facc15';
      case 'Seleção em agendamento': return '#a3e635';
      case 'Entrevista com o Gestor': return '#4ade80';
      case 'Testes e referências': return '#34d399';
      case 'Validação do perfil': return '#22c55e';
      case 'Concluída': return '#16a34a';
      default: return '#6b7280'; // cinza
    }
  }};
`;

const ProgressContainer = styled.div`
    width: 45%; 
    background-color: #e5e7eb;
    border-radius: 12px;
    height: 22px;
    margin: 12px 0;
    border: 1px solid 555;
`;

const Progress = styled.div`
  border-radius: 12px;
  background: ${({ $status }) =>
    $status === 'Cancelada'
      ? '#dc2626'
      : 'linear-gradient(to right, #fb923c, #22c55e)'};
  width: ${({ $percent }) => $percent}%;
  transition: width 0.3s ease;
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

const Details = styled.div`
    width: 95%;
    margin-top: 16px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16px;
    border-radius: 10px;
    overflow-y: hidden;
    margin: 15px auto;
`;

const DetailRow = styled.div`
    // background-color: red;
    gap: 15px;
`

const DetailCard = styled.div`
    gap: 12x;
    flex-direction: column;
    margin-bottom: 10px;
    line-height: 20px;
    // background-color: red;
`

const Label = styled.div`
    font-size: 12px;
    line-height: 15px;
    font-weight: bold;
    text-transform: uppercase;
    color: #555;
`;

const Value = styled.div`
    font-size: 14px;
    // background-color: red;
    width: 90%;
    color: #555;
    margin-bottom: 10px;
    flex-direction: column;
    p{
        margin-top: 10px;
        font-size: 14px;
        text-align: left;
    }
`;

const EditRow = styled.div`
    div { 
        gap: 20px;
    }
    select {
        height: 40px;
        width: 280px;
        font-size: 14px;
        color: #555;
        border: 1px solid #555;
        &:placeholder{
            border: 1px solid #555;
        }
    }
    button{
        height: 40px;
        font-size: 14px;
        margin-right: 15px;
    }
    h2{
        font-size: 15px;
    }
`