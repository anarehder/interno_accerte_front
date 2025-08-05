import styled from 'styled-components';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import apiServiceCertificacoes from '../../services/apiServiceCertificacoes';

function CriarNivelComponent() {
    const { user } = useAuth();
    const [form, setForm] = useState({ nivel: "", valor:"" })

    const handleForm = (e) => {
        const { id, value } = e.target;
        if (id === "valor") {
            setForm(prevForm => ({ ...prevForm, [id]: Number(value) }));
        } else {
            setForm(prevForm => ({ ...prevForm, [id]: value }));
        };
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
                // console.log(body);
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
                        type="text"
                        value={form.nivel}
                        id="nivel"
                        autoComplete="nivel"
                        onChange={handleForm}
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
