import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import apiServiceCertificacoes from '../../services/apiServiceCertificacoes';

function CriarVersaoCertComponent() {
    const { user } = useAuth();
    const [form, setForm] = useState({ certificacaoId: "", versao: "", atual: true, startDate: null, endDate: null});
    const [certificacoes, setCertificacoes] = useState([]);

    useEffect(() => {
        if (!user) return;
        const fetchData = async () => {
            const body = { email: user.mail };
            try {
                const response = await apiServiceCertificacoes.buscarCertificacao(body);
                setCertificacoes(response.data);
            } catch (error) {
                console.error("Erro ao buscar informacoes de certificacoes:", error);
            }
        };

        fetchData();

    }, [user]);

    const handleForm = (e) => {
        const { id, value } = e.target;

        let newValue;

        if (id === "certificacaoId") {
            newValue = Number(value);
        } else {
            newValue = value;
        };

        setForm(prevForm => ({
            ...prevForm,
            [id]: newValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.certificacaoId || ! form.versao) {
            alert("O campo certificado e versão devem ser preenchido.");
            return;
        }
        const formComDatasFormatadas = {
            ...form,
            atual: "true" ? true : false,
            startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
            endDate: form.endDate ? new Date(form.endDate).toISOString() : null
        };

        const body = {
            email: user.mail,
            versao: formComDatasFormatadas,
        };

        const confirmado = window.confirm(
            `Solicitante: ${body.email}\n` +
            `Deseja criar a versão:\n` +
            `Versao: ${form.versao}\n`
        );
        if (confirmado) {
            try {
                const response = await apiServiceCertificacoes.criarVersao(body);
                if (response.status === 200) {
                    alert("Versão criada com sucesso!");
                    setForm({ certificacaoId: "", versao: "", atual: true, startDate: null, endDate: null});
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
                    <Label>Nome da Versão:</Label>
                    <Input
                        type="text"
                        value={form.versao}
                        id="versao"
                        autoComplete="versao"
                        onChange={handleForm}
                    />
                </div>
                <div>
                    <Label>Certificação:</Label>
                    <Select id="certificacaoId" value={form.certificacaoId} onChange={handleForm}>
                        <option value="">Selecione...</option>
                        {certificacoes.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.nome}
                            </option>
                        ))}
                    </Select>
                </div>
                <div>
                    <Label>Certifição Atual no PCA?</Label>
                    <Select id="atual" value={form.atual} onChange={handleForm}>
                        <option value="">Selecione</option>
                        <option value={true}>Sim</option>
                        <option value={false}>Não</option>
                    </Select>
                </div>
                <div>
                    <Label>Data de Inclusão da Versão:</Label>
                    <Input
                        type="date"
                        id="startDate"
                        value={form.startDate}
                        onChange={handleForm}
                    />
                </div>
                <div>
                    <Label>Data de Expiração da Versão:</Label>
                    <Input
                        type="date"
                        id="endDate"
                        value={form.endDate}
                        onChange={handleForm}
                    />
                </div>
                <Button onClick={handleSubmit}>Criar Certificação</Button>
            </Form>
        </Container>
    );
};

export default CriarVersaoCertComponent;

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

