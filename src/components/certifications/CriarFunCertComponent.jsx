import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import apiServiceCertificacoes from '../../services/apiServiceCertificacoes';
import apiService from '../../services/apiService';


function CriarFunCertComponent() {
    const { user } = useAuth();
    const [form, setForm] = useState({ funcionarioId: "", certificacaoId: "", emissao: null, validade: null, url: null, validaPCA: false});
    const [funcionarios, setFuncionarios] = useState([]);
    const [emissores, setEmissores] = useState([]);
    const [certificacoes, setCertificacoes] = useState([]);
    const [versoes, setVersoes] = useState([]);
    console.log(form);
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
        };

        fetchData();

    }, [user]);

    const handleForm = (e) => {
        const { id, value } = e.target;

        let newValue;

        if (id === "funcionarioId" || id === "certificacaoId") {
            newValue = Number(value);
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

    const handleCertChange = async (e) => {
        const { id, value } = e.target;
        const newValue = Number(value);
        setForm(prevForm => ({
            ...prevForm,
            [id]: newValue
        }));

        const body = { email: user.mail };
        try {
            const response = await apiServiceCertificacoes.buscarVersaoPorCertificacao(value, body);
            if (response.status === 200) {
                setVersoes(response.data);
            }
        } catch (error) {
            console.error("Erro ao enviar requisição:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.funcionarioId || !form.certificacaoId || !form.emissao) {
            alert("Os campos funcionario, certificação, versão e emissão devem ser preenchido.");
            return;
        }
        const formComDatasFormatadas = {
            ...form,
            validaPCA: "true" ? true : false,
            emissao: form.emissao ? new Date(form.emissao).toISOString() : null,
            validade: form.validade ? new Date(form.validade).toISOString() : null
        };

        const body = {
            email: user.mail,
            certificacao: formComDatasFormatadas,
        };
        // console.log(body);
        const confirmado = window.confirm(
            `Solicitante: ${body.email}\n` +
            `Deseja criar a certficação?`
        );

        if (confirmado) {
            try {
                const response = await apiServiceCertificacoes.criarCertFunc(body);
                if (response.status === 200) {
                    alert("Certificação inserida com sucesso!");
                    setForm({ funcionarioId: "", certificacaoId: "", emissao: null, validade: null, url: null, validaPCA: false});
                }
            } catch (error) {
                console.error("Erro ao enviar requisição:", error);
                alert(`Ocorreu um erro. Tente novamente, ${error.response.data.message}.`);
            }
        } else {
            console.log('Ação cancelada.');
        }
    };

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
                    <Select id="certificacaoId" value={form.certificacaoId} onChange={handleCertChange} disabled={certificacoes.length===0}>
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
                        <option value={true}>Sim</option>
                        <option value={false}>Não</option>
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
                <Button onClick={handleSubmit}>Inserir Certificação</Button>
            </Form>
        </Container>
    );
};

export default CriarFunCertComponent;

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

