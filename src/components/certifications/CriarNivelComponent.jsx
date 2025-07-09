import styled from 'styled-components';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import apiServiceCertificacoes from '../../services/apiServiceCertificacoes';

function CriarNivelComponent() {
    const { user } = useAuth();
    const [form, setForm] = useState({ nivel: "", valor:"" })

    const handleForm = (e) => {
        const { id, value } = e.target;
        setForm(prevForm => ({ ...prevForm, [id]: Number(value) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.nivel || !form.valor) {
            alert("Todos os campos devem ser preenchidos.");
            return;
        }

        const body = {
            email: user.mail,
            nivel: form.nivel,
            valor: form.valor
        };

        const confirmado = window.confirm(
            `Solicitante: ${body.email}\n` +
            `Deseja criar o emissor de certificados:\n` +
            `Nível: ${body.nivel}\n` + 
            `Valor: ${body.valor}\n`
        );
        if (confirmado) {
            try {
                console.log(body);
                const response = await apiServiceCertificacoes.criarNivel(body);
                if (response.status === 200) {
                    alert("Nível criado com sucesso!");
                    setForm({ nivel: "" , valor: ""});
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
                    <Label>Nível:</Label>
                    <Input
                        type="number"
                        value={form.nivel}
                        id="nivel"
                        autoComplete="nivel"
                        onChange={handleForm}
                        min={1}
                    />
                </div>
                <div>
                    <Label>Valor:</Label>
                    <Input
                        type="number"
                        value={form.valor}
                        id="valor"
                        autoComplete="valor"
                        onChange={handleForm}
                        min={1}
                    />
                </div>
                <Button onClick={handleSubmit}>Criar Nível</Button>
            </Form>
            <>
                {/* <div>
                                <Label>Sobrenome</Label>
                                <Input
                                    type="text"
                                    value={form.sobrenome}
                                    id="sobrenome"
                                    autoComplete="sobrenome"
                                    onChange={handleForm}
                                />
                            </div>
                            <div>
                                <Label>E-mail</Label>
                                <Input
                                    type="text"
                                    value={selectedFunc.mail}
                                    disabled='true'
                                />
                            </div>
                            <div>
                                <Label>Tipo de Contrato</Label>
                                <Select id="tipoContratoId" value={form.tipoContratoId} onChange={handleForm}>
                                    <option value="">Selecione...</option>
                                    {info.listaContratos.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.tipo}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                            <div>
                                <Label>Cargo</Label>
                                <Input
                                    type="text"
                                    id="cargo"
                                    value={form.cargo}
                                    onChange={handleForm}
                                />
                            </div>
                            <div>
                                <Label>Tipo de Jornada</Label>
                                <Select id="jornadaId" value={form.jornadaId} onChange={handleForm}>
                                    <option value="">Selecione...</option>
                                    {info.listaJornadas.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.tipo}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                            <div>
                                <Label>Área</Label>
                                <Select id="areaId" value={form.areaId} onChange={handleForm}>
                                    <option value="">Selecione...</option>
                                    {info.listaAreas.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.area}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                            <div>
                                <Label>Data de Admissão</Label>
                                <Input
                                    type="date"
                                    id="admissao"
                                    value={form.admissao}
                                    onChange={handleForm}
                                />
                            </div>
                            <div>
                                <Label>Aniversário</Label>
                                <Input
                                    type="date"
                                    id="aniversario"
                                    value={form.aniversario}
                                    onChange={handleForm}
                                />
                            </div>
                            <div>
                                <Label>Administrador da Intranet?</Label>
                                <Select id="isAdmin" value={form.isAdmin} onChange={handleForm}>
                                    <option value="">Selecione</option>
                                    <option value={true}>Sim</option>
                                    <option value={false}>Não</option>
                                </Select>
                            </div> */}
            </>
        </Container>
    );
};

export default CriarNivelComponent;

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
  width: 80px;
  height: 40px;
  align-items: center;
`;

const Form = styled.form`
    width: 50%;
    display: flex;
    flex-direction: in-line;
    justify-content: space-between;
    div{
        width: 400px;
        justify-content: flex-start;
    }
`

const Input = styled.input`
  width: 200px;
  justify-content: center;
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
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #45a049;
  }
`;
