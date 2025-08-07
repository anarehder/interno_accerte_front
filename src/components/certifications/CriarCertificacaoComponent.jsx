import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import apiServiceCertificacoes from '../../services/apiServiceCertificacoes';

function CriarCertificacaoComponent( {handleClick}) {
    const { user } = useAuth();
    const [form, setForm] = useState({ nome: "", emissorId: "", limite: 0, nivelId: null, ativaPCA: true, bloqueada: false, startDate: null, endDate: null});
    const [emissores, setEmissores] = useState([]);
    const [niveis, setNiveis] = useState([]);
    // console.log(form);

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
                const response2 = await apiServiceCertificacoes.buscarNivel(body);
                setNiveis(response2.data);
            } catch (error) {
                console.error("Erro ao buscar informacoes de niveis:", error);
            }
        };

        fetchData();

    }, [user]);

    const handleForm = (e) => {
        const { id, value } = e.target;

        let newValue;

        if (id === "emissorId" || id === "limite" || id === "nivelId") {
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
        if (!form.nome || ! form.emissorId) {
            alert("O campo nome e emissor devem ser preenchido.");
            return;
        }
        const formComDatasFormatadas = {
            ...form,
            ativaPCA: Boolean(form.ativaPCA),
            bloqueada: Boolean(form.bloqueada),
            startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
            endDate: form.endDate ? new Date(form.endDate).toISOString() : null
        };
        // console.log(formComDatasFormatadas);
        const body = {
            email: user.mail,
            certificacao: formComDatasFormatadas,
        };
        // console.log(body);
        const confirmado = window.confirm(
            `Solicitante: ${body.email}\n` +
            `Deseja criar o certificado:\n` +
            `Nome: ${form.nome}\n`
        );
        if (confirmado) {
            try {
                const response = await apiServiceCertificacoes.criarCertificacao(body);
                if (response.status === 200) {
                    alert("Certificação criada com sucesso!");
                    setForm({ nome: "", emissorId: "", limite: null, nivelId: null, ativaPCA: true, bloqueada: false, startDate: null, endDate: null});
                    handleClick("");
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
                    <Label>Nome Certificação:</Label>
                    <Input
                        type="text"
                        value={form.nome}
                        id="nome"
                        autoComplete="nome"
                        onChange={handleForm}
                    />
                </div>
                <div>
                    <Label>Emissores</Label>
                    <Select id="emissorId" value={form.emissorId} onChange={handleForm}>
                        <option value="">Selecione...</option>
                        {emissores.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.nome}
                            </option>
                        ))}
                    </Select>
                </div>
                <div>
                    <Label>Niveis</Label>
                    <Select id="nivelId" value={form.nivelId} onChange={handleForm}>
                        <option value="">Selecione...</option>
                        {niveis.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.nivel}
                            </option>
                        ))}
                    </Select>
                </div>
                <div>
                    <Label>Limite:</Label>
                    <Input
                        type="number"
                        value={form.limite}
                        id="limite"
                        autoComplete="limite"
                        onChange={handleForm}
                    />
                </div>
                <div>
                    <Label>Certificação Ativa PCA?</Label>
                    <Select id="ativaPCA" value={form.ativaPCA} onChange={handleForm}>
                        <option value="">Selecione</option>
                        <option value={true}>Sim</option>
                        <option value={false}>Não</option>
                    </Select>
                </div>
                <div>
                    <Label>Bloqueada Para Novas Certificações?</Label>
                    <Select id="bloqueada" value={form.bloqueada} onChange={handleForm}>
                        <option value="">Selecione</option>
                        <option value={true}>Sim</option>
                        <option value={false}>Não</option>
                    </Select>
                </div>
                <div>
                    <Label>Data de Início no PCA</Label>
                    <Input
                        type="date"
                        id="startDate"
                        value={form.startDate}
                        onChange={handleForm}
                    />
                </div>
                <div>
                    <Label>Data de Fim no PCA</Label>
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

export default CriarCertificacaoComponent;

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
  width: 250px;
  justify-content: right;
  text-align: right;
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

