import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import apiService from '../services/apiService';

function EditScaleComponent({scale, opcoes, setUpdatedScale, setEditScale, editScale}) {
    // console.log(scale);
    const  {user} = useAuth();
    const diasSemana = ['segunda', 'terca', 'quarta', 'quinta', 'sexta'];
    const [diasSelecionados, setDiasSelecionados] = useState({
        segunda: scale.segunda,
        terca: scale.terca,
        quarta: scale.quarta,
        quinta: scale.quinta,
        sexta: scale.sexta,
      });
    // console.log(user);
    const handleChange = (dia, valor) => {
        setDiasSelecionados(prev => ({
            ...prev,
            [dia]: valor
        }));
    };

    const handleSubmit = async () => {
        try {
            const body = {
                "adminEmail": user.mail,
                "escala": {
                    ...diasSelecionados,
                    "funcionarioId": scale.funcionarioId,
                    "id": scale.id || scale.escalaId
                }
            }
            const response = await apiService.editScale(body);
            if (response.statusText === "OK") {
                setUpdatedScale(true);
                setEditScale(!editScale);
                alert("Escala alterada com sucesso!");
            }

        } catch (error) {
            console.error(error);
            alert('Erro ao alterar escala.');
        }
    };

    return (
        <PageContainer>
            <h2>Editar escala de: {scale.Funcionarios.nome}</h2>
            <FormGrid>
            {diasSemana.map(dia => (
                <DropdownContainer key={dia}>
                    <Label>{dia.charAt(0).toUpperCase() + dia.slice(1)}</Label>
                    <Select
                    onChange={e => handleChange(dia, e.target.value)}
                    disabled={user?.mail !== 'maria.silva@accerte.com.br' && /Pausa|Recesso|Férias/i.test(scale[dia])}>
                        <option value="" hidden>{scale[dia]}</option>
                        {opcoes?.map((opcao, index) => (
                            <option key={index} value={opcao}>
                                {opcao}
                            </option>
                        ))}
                    </Select>

                </DropdownContainer>
      ))}
            </FormGrid>
            <SubmitButton onClick={handleSubmit}>Alterar Escala</SubmitButton>
        </PageContainer>
    )
}

export default EditScaleComponent;

const PageContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    h2 {
        color: #2b2b2b;
        margin: 0 0 24px 0;
        font-size: 22px;
    }
`

const FormGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
    gap: 16px;
    width: 100%;
`;

const DropdownContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const Label = styled.label`
  display: flex;
  font-weight: 600;
  font-size: 13px;
  color: #6b6b6b;
  text-transform: uppercase;
  letter-spacing: 0.02em;
`;

const Select = styled.select`
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 100%;
  font-size: 15px;
  padding: 11px 38px 11px 14px;
  border-radius: 10px;
  border: 1px solid #d8dce3;
  background-color: white;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23F94860' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 14px;
  color: #333;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  transition: border-color .15s ease, box-shadow .15s ease;
  &:hover {
    border-color: #F94860;
  }
  &:focus {
    outline: none;
    border-color: #F94860;
    box-shadow: 0 0 0 3px rgba(249, 72, 96, 0.15);
  }
  &:disabled {
    background-color: #f0f0f0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    color: #999;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button`
    margin-top: 28px;
  width: 250px;
  justify-content: center;
  align-items: center;
  padding: 14px;
  background-color: #e5d0d3;
  border: 1px solid #d8374c;
  color: #d8374c;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: background-color .15s ease, transform .1s ease;
  &:hover {
    background-color: #d8374c;
    color: #e5d0d3;
  }
  &:active {
    transform: scale(0.98);
  }
`;
