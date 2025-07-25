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
            <h2>Editar escala de: {scale.name}</h2>
            <div>
            {diasSemana.map(dia => (
                <DropdownContainer key={dia}>
                    <Label>{dia.charAt(0).toUpperCase() + dia.slice(1)}:</Label>
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
            <SubmitButton onClick={handleSubmit}>Alterar Escala</SubmitButton>
            </div>
        </PageContainer>
    )
}

export default EditScaleComponent;

const PageContainer = styled.div`
    width: 80%;
    position: relative;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    z-index: 2;
    h2{
        color: gray;
    }
    div{
        align-items: flex-end;
    }
`

const DropdownContainer = styled.div`
    margin-top: 60px;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    gap: 5px;
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
  display: flex;
  width: 200px;
  height: 40px;
  align-items: center;
  text-align: center;
`;

const Select = styled.select`
  width: 200px;
  font-size: 18px;
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
  font-size: 17px;
  margin-left: 10px;
  height: 60px;
  &:hover {
    background-color:rgb(192, 57, 75);
  }
`;
