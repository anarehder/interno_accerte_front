import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import apiService from '../services/apiService';

function EditScaleComponent({scale, opcoes, setUpdatedScale, setEditScale, editScale}) {
    console.log(scale);
    const  {user} = useAuth();
    const diasSemana = ['segunda', 'terca', 'quarta', 'quinta', 'sexta'];
    const [diasSelecionados, setDiasSelecionados] = useState({
        segunda: scale.segunda,
        terca: scale.terca,
        quarta: scale.quarta,
        quinta: scale.quinta,
        sexta: scale.sexta,
      });

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
            {diasSemana.map(dia => (
                <DropdownContainer key={dia}>
                    <Label>{dia.charAt(0).toUpperCase() + dia.slice(1)}:</Label>
                    <Select onChange={e => handleChange(dia, e.target.value)}>
                        <option value={scale[dia]}>{scale[dia]}</option>
                        {opcoes?.map((opcao, index) => (
                            <option key={index} value={opcao}>
                                {opcao}
                            </option>
                        ))}
                    </Select>

                </DropdownContainer>
      ))}
            <SubmitButton onClick={handleSubmit}>Alterar Escala</SubmitButton>
        </PageContainer>
    )
}

export default EditScaleComponent;

const PageContainer = styled.div`
    width: 80%;
    position: relative;
    justify-content: center;
    align-items: flex-end;
`

const DropdownContainer = styled.div`
    margin-top: 100px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
  display: flex;
  width: 250px;
  height: 40px;
  align-items: center;
  text-align: center;
`;

const Select = styled.select`
  width: 230px;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const SubmitButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #F94860;
  border: 2px solid #F94860;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  height: 60px;
  &:hover {
    background-color:rgb(192, 57, 75);
  }
`;
