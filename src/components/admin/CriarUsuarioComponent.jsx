import { useState } from "react";
import styled from 'styled-components';
// import apiService from "../services/apiService";
import { useAuth } from "../../contexts/AuthContext";
import apiService from "../../services/apiService";

function CriarUsuarioComponent({info, setUpdated}){
    const { user, dados } = useAuth();
    const agenda = dados?.agenda;
    const [selectedFunc, setSelectedFunc] = useState(null);
    const [form, setForm] = useState({nome: "", sobrenome: "", email: "", tipoContratoId: "", admissao: "", demissao: null, isAdmin: false, aniversario:"", areaId:"", jornadaId:"", cargo:""});

    const handleSelect = (email) => {
      const funcionario = agenda.find((f) => f.mail === email);
      if (funcionario) {
        setSelectedFunc(funcionario);
        setForm((prevForm) => ({ ...prevForm, email: funcionario.mail, nome: funcionario.givenName, sobrenome: funcionario.surname }));
      }
    };

    const handleForm = (e) => {
        const { id, value } = e.target;

        let newValue;

        if (id === "areaId" || id === "jornadaId" || id === "tipoContratoId") {
            newValue = Number(value);
        } else {
            newValue = value;
        }

        setForm(prevForm => ({
            ...prevForm,
            [id]: newValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.nome || !form.sobrenome || !form.email || !form.tipoContratoId || !form.admissao || !form.aniversario || !form.areaId || !form.jornadaId || !form.cargo) {
            alert("Todos os campos obrigatórios devem ser preenchidos.");
            return;
        }
        const formComDatasFormatadas = {
            ...form,
            admissao: form.admissao ? new Date(form.admissao).toISOString() : "",
            aniversario: form.aniversario ? new Date(form.aniversario).toISOString() : "",
        };

        const body = {
            adminEmail: user.mail,
            funcionario: formComDatasFormatadas,
        };

        confirm(
            `Solicitante: ${body.adminEmail}\n` +
            `Deseja alterar os dados de:\n` +
            `Nome: ${body.funcionario.nome}\n` +
            `Sobrenome: ${body.funcionario.sobrenome}\n` +
            `Email: ${body.funcionario.email}\n`
        );
        try {
            const response = await apiService.createUser(body);
            if (response.status === 200) {
                alert("Usuário editado com sucesso!");
                setForm({nome: "", sobrenome: "", email: "", tipoContratoId: "", admissao: "", demissao: null, isAdmin: false, aniversario:"", areaId:"", jornadaId:"", cargo:""});
                setSelectedFunc(null);
                setUpdated(true);
            }
        } catch (error) {
            console.error("Erro ao enviar requisição:", error);
            // alert(`Ocorreu um erro. Tente novamente, ${error.response.data.message}.`);
        }
    };


    return (
        <>
            {dados &&
                <Container>
                    <Select onChange={(e) => handleSelect(e.target.value)}>
                        <option value="">Escolha um funcionário para criar</option>
                        {agenda
                            ?.filter(itemAgenda => !info?.listaFuncionarios.some(funcionario =>
                                funcionario.email === itemAgenda.mail))
                            .map((item, index) => (
                                <option key={index} value={item.mail}>
                                    {item.name}
                                </option>
                            ))}
                    </Select>
                    {selectedFunc && (
                        <>
                            <div>
                                <Label>Nome</Label>
                                <Input
                                    type="text"
                                    value={form.nome}
                                    id="nome"
                                    autoComplete="nome"
                                    onChange={handleForm}
                                />
                            </div>
                            <div>
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
                            </div>

                            <ButtonContainer>
                                <Button onClick={handleSubmit}>Criar Usuário</Button>
                            </ButtonContainer>
                        </>
                    )}
                </Container>
            }
        </>
    );
};

export default CriarUsuarioComponent;

const Container = styled.div`
    flex-direction: column;
    align-items: center;
    margin-bottom: 50px;
    gap: 25px;
    padding: 20px 0;
    div { 
        justify-content: center;
        align-items: center;
        gap: 20px;
        font-size: 18px;
    }
`

const Label = styled.label`
  display: block;
  font-weight: bold;
  display: flex;
  width: 250px;
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

const Input = styled.input`
  width: 400px;
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