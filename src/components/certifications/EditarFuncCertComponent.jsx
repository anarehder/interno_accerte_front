import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import apiServiceCertificacoes from '../../services/apiServiceCertificacoes';
import apiService from '../../services/apiService';


function EditarFuncCertComponent({ funcCert, onClose, onSuccess }) {
    const { user } = useAuth();
    
    // Função para formatar data ISO para YYYY-MM-DD
    const formatDateToInput = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const month = String(d.getUTCMonth() + 1).padStart(2, '0');
        const day = String(d.getUTCDate()).padStart(2, '0');
        const year = d.getUTCFullYear();
        return `${year}-${month}-${day}`;
    };
    
    // Formatar as datas ao inicializar
    const initialForm = {
        ...funcCert,
        emissao: formatDateToInput(funcCert.emissao),
        validade: formatDateToInput(funcCert.validade),
        emissorId: funcCert.Certificacoes?.emissorId || funcCert.emissorId || ''
    };
    
    const [form, setForm] = useState(initialForm);
    const [funcionarios, setFuncionarios] = useState([]);
    const [emissores, setEmissores] = useState([]);
    const [certificacoes, setCertificacoes] = useState([]);
    // console.log('form:', form);
    // console.log('funcCert:', funcCert);
    useEffect(() => {
        if (!user) return;
        const fetchData = async () => {
            const body = { email: user.mail };
            try {
                const response = await apiServiceCertificacoes.buscarEmissor(body);
                setEmissores(response.data);
            } catch (error) {
                console.error("Erro ao buscar informacoes de emissores:", error);
            }
            try {
                const response = await apiService.buscarFuncionarioAtivo();
                setFuncionarios(response.data);
            } catch (error) {
                console.error("Erro ao buscar informacoes de funcionarios:", error);
            }
            // Buscar certificações do emissor atual
            if (funcCert.Certificacoes?.emissorId) {
                try {
                    const response = await apiServiceCertificacoes.buscarCertificacaoPorEmissor(funcCert.Certificacoes.emissorId, body);
                    if (response.status === 200) {
                        setCertificacoes(response.data);
                    }
                } catch (error) {
                    console.error("Erro ao buscar certificações do emissor:", error);
                }
            }
        };

        fetchData();

    }, [user, funcCert]);

    const handleForm = (e) => {
        const { id, value } = e.target;

        let newValue;

        if (id === "funcionarioId" || id === "certificacaoId" || id === "emissorId") {
            newValue = Number(value);
        } else if (id === "validaPCA") {
            newValue = value === "true" || value === true;
        } else {
            newValue = value;
        };

        setForm(prevForm => ({
            ...prevForm,
            [id]: newValue
        }));
    };

    const handleEmissorChange = async (e) => {
        const { id, value } = e.target;

        // Atualiza o emissorId e limpa a certificação selecionada
        setForm(prevForm => ({
            ...prevForm,
            emissorId: Number(value),
            certificacaoId: ''
        }));

        const body = { email: user.mail };
        try {
            const response = await apiServiceCertificacoes.buscarCertificacaoPorEmissor(value, body);
            if (response.status === 200) {
                setCertificacoes(response.data);
            }
        } catch (error) {
            console.error("Erro ao enviar requisição:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.funcionarioId || !form.certificacaoId || !form.emissao) {
            alert("Os campos funcionario, certificação e emissão devem ser preenchidos.");
            return;
        }
        const formComDatasFormatadas = {
            ...form,
            validaPCA: Boolean(form.validaPCA),
            emissao: form.emissao ? new Date(form.emissao).toISOString() : null,
            validade: form.validade ? new Date(form.validade).toISOString() : null
        };

        // Remove ID e Certificacoes do body
        const { id, Certificacoes, Funcionarios, emissorId, ...funcCertSemIds } = formComDatasFormatadas;
        
        const body = {
            email: user.mail,
            certificacao: funcCertSemIds,
        };
        console.log(body);
        const confirmado = window.confirm(
            `Solicitante: ${body.email}\n` +
            `Deseja editar a certificação do funcionário?`
        );

        if (confirmado) {
            try {
                const response = await apiServiceCertificacoes.editarCertificacaoFuncionario(body, form.id);
                if (response.status === 200) {
                    alert("Certificação alterada com sucesso!");
                    if (onSuccess) {
                        onSuccess();
                    }
                }
            } catch (error) {
                console.error("Erro ao enviar requisição:", error);
                alert(`Ocorreu um erro. Tente novamente, ${error.response.data.message}.`);
            }
        } else {
            // console.log('Ação cancelada.');
        }
    };
    // console.log(form);
    return (
        <Container>
            <Form>
                <div>
                    <Label>Funcionário:</Label>
                    <Select id="funcionarioId" value={form.funcionarioId} onChange={handleForm}>
                        <option value="">Selecione...</option>
                        {funcionarios.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.nome} {c.sobrenome}
                            </option>
                        ))}
                    </Select>
                </div>
                <div>
                    <Label>Emissor:</Label>
                    <Select id="emissorId" value={form.emissorId} onChange={handleEmissorChange}>
                        <option value="">Selecione...</option>
                        {emissores.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.nome}
                            </option>
                        ))}
                    </Select>
                </div>
                <div>
                    <Label>Certificação:</Label>
                    <Select id="certificacaoId" value={form.certificacaoId} disabled={certificacoes.length===0} onChange={handleForm}>
                        <option value="">Selecione...</option>
                        {certificacoes.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.nome}
                            </option>
                        ))}
                    </Select>
                </div>
                <div>
                    <Label>Certifição Válida no PCA?</Label>
                    <Select id="validaPCA" value={form.validaPCA} onChange={handleForm}>
                        <option value="">Selecione</option>
                        <option value="true">Sim</option>
                        <option value="false">Não</option>
                    </Select>
                </div>
                <div>
                    <Label>URL do PDF:</Label>
                    <Input
                        type="text"
                        value={form.url}
                        id="url"
                        autoComplete="url"
                        onChange={handleForm}
                    />
                </div>
                <div>
                    <Label>Data de Emissão:</Label>
                    <Input
                        type="date"
                        id="emissao"
                        value={form.emissao}
                        onChange={handleForm}
                    />
                </div>
                <div>
                    <Label>Data de Validade:</Label>
                    <Input
                        type="date"
                        id="validade"
                        value={form.validade}
                        onChange={handleForm}
                    />
                </div>
                <Button onClick={handleSubmit}>Editar Certificação</Button>
                <CancelButton onClick={onClose}>Cancelar</CancelButton>
            </Form>
        </Container>
    );
};

export default EditarFuncCertComponent;

const Container = styled.div`
    flex-direction: column;
    align-items: center;
    margin-bottom: 50px;
    gap: 25px;
    padding: 20px;
    div { 
        justify-content: center;
        align-items: center;
        gap: 20px;
        font-size: 18px;
    }
`

const Label = styled.label`
  display: block;
  font-size: 20px;
  display: flex;
  width: 300px;
  justify-content: right;
  height: 40px;
  align-items: center;
`;

const Select = styled.select`
  width: 400px;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 18px;
  background-color: transparent;
`;

const Form = styled.form`
    width: 75%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 15px;
`

const Input = styled.input`
  width: 400px;
  justify-content: left;
  text-align: left;
  border-radius: 6px;
  border: 1px solid #ccc;
  text-indent: 8px;
  height: 40px;
  font-size: 18px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #4caf50;
  width: 250px;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  justify-content: center;
  font-weight: bold;
    margin-top: 40px;
  &:hover {
    background-color: #45a049;
  }
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  background-color: #f44336;
  width: 250px;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  justify-content: center;
  font-weight: bold;
  
  &:hover {
    background-color: #da190b;
  }
`;

