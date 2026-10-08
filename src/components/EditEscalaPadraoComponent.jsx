import styled from 'styled-components';
import { useEffect, useState } from 'react';
import apiService from '../services/apiService';

const OPCOES_ESCALA_PADRAO = [
    "Home",
    "Home - Manhã ",
    "Home - Tarde",
    "Presencial - GYN",
    "Presencial - BSB",
    "Trabalho Remoto",
    "Plantão",
    "Outros",
];

function EditEscalaPadraoComponent({ onClose }) {
    const diasSemana = ['segunda', 'terca', 'quarta', 'quinta', 'sexta'];
    const [diasSelecionados, setDiasSelecionados] = useState({
        segunda: '',
        terca: '',
        quarta: '',
        quinta: '',
        sexta: '',
    });
    const [escalaPadrao, setEscalaPadrao] = useState(null);
    const [loading, setLoading] = useState(true);
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        const fetchEscalaPadrao = async () => {
            try {
                const response = await apiService.getEscalaPadrao();
                if (response.data) {
                    setEscalaPadrao(response.data);
                    setDiasSelecionados({
                        segunda: response.data.segunda,
                        terca: response.data.terca,
                        quarta: response.data.quarta,
                        quinta: response.data.quinta,
                        sexta: response.data.sexta,
                    });
                }
            } catch (error) {
                console.error(error);
                alert('Erro ao buscar escala padrão.');
            } finally {
                setLoading(false);
            }
        };

        fetchEscalaPadrao();
    }, []);

    const handleChange = (dia, valor) => {
        setDiasSelecionados(prev => ({
            ...prev,
            [dia]: valor
        }));
    };

    const handleSubmit = async () => {
        const incompleto = diasSemana.some(dia => !diasSelecionados[dia]);
        if (incompleto) {
            alert('Selecione uma opção para todos os dias.');
            return;
        }

        setSalvando(true);
        try {
            const response = await apiService.salvarEscalaPadrao(diasSelecionados);
            if (response.status === 200) {
                setEscalaPadrao(response.data);
                alert('Escala padrão salva com sucesso!');
                onClose?.();
            }
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar escala padrão.');
        } finally {
            setSalvando(false);
        }
    };

    return (
        <PageContainer>
            <h2>{escalaPadrao ? 'Editar' : 'Criar'} escala padrão</h2>
            <Subtitle>Defina os dias que se repetem toda semana.</Subtitle>
            {loading ? <p>Carregando escala padrão...</p> : (
                <>
                    <FormGrid>
                        {diasSemana.map(dia => (
                            <DropdownContainer key={dia}>
                                <Label>{dia.charAt(0).toUpperCase() + dia.slice(1)}</Label>
                                <Select
                                    value={diasSelecionados[dia] || ''}
                                    onChange={e => handleChange(dia, e.target.value)}
                                >
                                    <option value="" hidden>Selecione</option>
                                    {OPCOES_ESCALA_PADRAO.map((opcao, index) => (
                                        <option key={index} value={opcao}>
                                            {opcao}
                                        </option>
                                    ))}
                                </Select>
                            </DropdownContainer>
                        ))}
                    </FormGrid>
                    <SubmitButton onClick={handleSubmit} disabled={salvando}>
                        {salvando ? 'Salvando...' : (escalaPadrao ? 'Salvar Alterações' : 'Criar Escala Padrão')}
                    </SubmitButton>
                </>
            )}
        </PageContainer>
    )
}

export default EditEscalaPadraoComponent;

const PageContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    h2 {
        color: #2b2b2b;
        margin: 0 0 4px 0;
        font-size: 22px;
    }
`

const Subtitle = styled.p`
    color: #8a8a8a;
    margin: 0 0 28px 0;
    font-size: 14px;
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
  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;
