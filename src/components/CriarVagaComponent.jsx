import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';

function CriarVagaComponent({setSelectedItem}) {
    const { user } = useAuth();
    const [allowed, setAllowed] = useState(false);
    const [formularioInfo, setFormularioInfo] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [funcionarioSolicitante, setFuncionarioSolicitante] = useState(0);
    const [areaIdDoSolicitante, setAreaIdDoSolicitante] = useState([]);  

    const reqDefault = {  
    solicitanteId: 0,
    areaId: 0,
    cargo: '',
    salario: '',
    sal_variavel: false,
    motivo: '',
    substituidoId: null,
    formacaoAcad: '',
    tipoContratoId: 0,
    jornadaId: 0,
    atividades: '',
    reqHardSkills: '',
    reqSoftSkills: '',
    informacoes: '',
    status: 'Solicitado', // ou algum valor default 
    confidencial: false,
    imediato: false,
    qtdeDeVagas: 1
    };

    const [newReq, setNewReq] = useState(reqDefault);
    // console.log(newReq);
    const handleChange = (e) => {
    const { name, type, value, checked } = e.target;

    setNewReq((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
    }));
    };

    const handleSelectId = (e) => {
        const { name, value } = e.target;
        setNewReq((prev) => ({
            ...prev,
            [name]: Number(value)
        }));
    };

    useEffect(() => {
        if (!user) return;

        const fetchScale = async () => {
            try {
                const response = await apiService.getVagasInfo();
                setFormularioInfo(response.data);
                const func = response.data.funcionarios.find((func) => func.email === user.mail);
                if (!func){
                    setCarregando(false);
                    return;
                }
                const area = response.data.gestores.filter(
                    (gestor) => gestor.funcionarioId === func.id
                );
                setAllowed(true);
                setFuncionarioSolicitante(func);
                setAreaIdDoSolicitante(area);
                setNewReq((prev) => ({
                    ...prev,
                    solicitanteId: func.id,
                    areaId: area.areaId
                }));
                setCarregando(false);
            } catch (error) {
                console.error("Erro ao buscar informacoes vagas:", error);
                setCarregando(false);
            }
        };

        fetchScale();

    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault(); // para não recarregar a página
    
        try {
            const body = {
                adminEmail: user.mail,
                vaga: newReq
            }
            await apiService.createVagas(body);
            alert('Vaga criada com sucesso!');
            setNewReq(reqDefault);
            setSelectedItem("");
        } catch (error) {
            console.error('Erro ao criar vaga:', error);
            alert('Possível erro ao criar vaga no servidor. Verifique se a vaga está na sua lista de vagas antes de tentar novamente.');
        }
    };

    return (
        <PageContainer>
            <h2>Requisição de Vaga</h2>
            {carregando && <Formulario><div> Carregando dados...</div> </Formulario>}
            {(!carregando && !allowed)&&<Formulario><h1> Área destinada aos gestores</h1></Formulario> }
            {(!carregando && allowed) &&
            // && funcionarioSolicitante !== 0
                <Formulario onSubmit={handleSubmit}>
                    <div>
                        <label>1. Solicitante da vaga: {funcionarioSolicitante.length}</label>
                        <input
                            type="text"
                            value={`${funcionarioSolicitante?.nome} ${funcionarioSolicitante?.sobrenome}`}
                            disabled
                        />
                    </div>

                    <div>
                        <label>2. Área:</label>
                        {
                            areaIdDoSolicitante.length > 1 &&
                            <select name="areaId" onChange={handleSelectId}>
                            <option value="">Selecione</option>
                            {areaIdDoSolicitante.map((item) => (
                                <option key={item.areaId} value={item.areaId}>
                                    {formularioInfo? formularioInfo?.areas.find((area) => area.id === item.areaId)?.area : "Carregando..."}
                                </option>
                            ))}
                        </select>
                        }
                        {
                            areaIdDoSolicitante.length === 1 &&
                            <input
                                type="text"
                                value={formularioInfo ? formularioInfo?.areas.find((area) => area.id === areaIdDoSolicitante[0]?.areaId)?.area : "Carregando..."}
                                disabled
                            />
                        }

                    </div>

                    <div>
                        <label>3. Título do cargo:</label>
                        <input type="text" name="cargo" onChange={handleChange} maxLength={250}/>
                    </div>

                    <div>
                        <div>
                            <label> 3.1. Confidencial</label>
                            <input
                                type="checkbox"
                                name="confidencial"
                                checked={newReq.confidencial}
                                // onChange={(e) => setConfidencial(e.target.checked)}
                                onChange={handleChange}
                                style={{ transform: 'scale(1.8)'}}
                            />
                        </div>
                    </div>

                    <div>
                        <label>3.2. Quantidade de Vagas:</label>
                        <input
                            type="number"
                            value={newReq.qtdeDeVagas}
                            min={1}
                            name="qtdeDeVagas" onChange={handleSelectId}
                        />
                    </div>

                    <div>
                        <label>3.3. Início Imediato?</label>
                        <select name="imediato" onChange={(e) => {
                            setNewReq((prev) => ({
                                ...prev,
                                imediato: e.target.value === 'true'
                            }));
                        }}>
                            <option value="">Selecione</option>
                            <option value="true">Sim</option>
                            <option value="false">Não</option>
                        </select>
                    </div>
                    
                    <div>
                        <label>4. Qual o salário/remuneração?</label>
                        <input type="number" name="salario" onChange={handleChange} />
                    </div>

                    <div>
                        <label>5. Possui remuneração variável?</label>
                        <select name="sal_variavel" onChange={(e) => {
                            setNewReq((prev) => ({
                                ...prev,
                                sal_variavel: e.target.value === 'true'
                            }));
                        }}>
                            <option value="">Selecione</option>
                            <option value="true">Sim</option>
                            <option value="false">Não</option>
                        </select>
                    </div>

                    <div>
                        <label>6. Qual o regime de contrato?</label>
                        <select name="tipoContratoId" onChange={handleSelectId}>
                            <option value="">Selecione</option>
                            {formularioInfo.contratos.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.tipo}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>7. Formação Acadêmica:</label>
                        <select name="formacaoAcad" onChange={handleChange}>
                            <option value="">Selecione</option>
                            <option value="Ensino Médio Completo (2º grau)">Ensino Médio Completo (2º grau)</option>
                            <option value="Superior Incompleto">Superior Incompleto</option>
                            <option value="Superior Completo">Superior Completo</option>
                            <option value="Pós-graduação Incompleta">Pós-graduação Incompleta</option>
                            <option value="Pós-graduação Completa">Pós-graduação Completa</option>
                        </select>
                    </div>

                    <div>
                        <label>8. Qual a jornada de trabalho?</label>
                        <select name="jornadaId" onChange={handleSelectId}>
                            <option value="">Selecione</option>
                            {formularioInfo.jornadas.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.tipo}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>9. Motivo abertura de vaga:</label>
                        <select name="motivo" onChange={handleChange}>
                            <option value="">Selecione</option>
                            <option value="Substituição">Substituição</option>
                            <option value="Aumento de Quadro">Aumento de Quadro</option>
                        </select>
                    </div>

                    {newReq.motivo === "Substituição" &&
                        <div>
                            <label>9.1. Em caso de substituição, qual o nome do ocupante anterior?</label>
                            <select name="substituidoId" onChange={handleSelectId}>
                                <option value="">Selecione</option>
                                {formularioInfo.funcionarios.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.nome} {item.sobrenome}
                                    </option>
                                ))}
                            </select>
                        </div>
                    }

                    <div>
                        <label>10. Responsabilidades e atribuições desse cargo:</label>
                        <textarea name="atividades" onChange={handleChange} maxLength={990}/>
                    </div>

                    <div>
                        <label>11. Pré-requisitos técnicos e qualificações para este cargo:</label>
                        <textarea name="reqHardSkills" onChange={handleChange} maxLength={990} />
                    </div>

                    <div>
                        <label>12. Comportamentos e habilidades esperados e/ou valorizados para este cargo:</label>
                        <textarea name="reqSoftSkills" onChange={handleChange} maxLength={990}/>
                    </div>

                    <div>
                        <label>13. Informações relevantes:</label>
                        <textarea name="informacoes" onChange={handleChange} maxLength={990}/>
                    </div>

                    <button type="submit" onClick={handleSubmit}>Enviar Solicitação</button>
                </Formulario>
                
            }
            
        </PageContainer>
    )
}

export default CriarVagaComponent;

const PageContainer = styled.div`
    margin: 0 10px 0 350px;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    gap: 10px;
    height: 60vh;
    color: #555;
    border: none;
    position: relative;
    overflow-y: scroll;
    h2 {
        margin: 10px 0;
    }
`

const Formulario = styled.form`
    width: 85%;
    div {
        margin-bottom: 35px;
        flex-direction: column;
        div{
            flex-direction: row;
            align-items: flex-start;
            gap: 20px;
            margin-bottom: 5px;
        }
    }
    label {
        margin-bottom: 8px;
        font-weight: bold;
    }
    input, select, textarea {
        padding: 10px;
        font-size: 1rem;
        border: 1px solid #555;
        border-radius: 30px;
        color: #555;
    }
    textarea {
        resize: vertical;
        min-height: 80px;
        padding-left: 20px;
    }
    button {
        display: flex;
        font-size: 16px;
    }
`
