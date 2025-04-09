import { useState } from "react";
import styled from 'styled-components';
import apiService from "../services/apiService";
import { useAuth } from "../contexts/AuthContext";

function UserComponent(){
    const { user, dados } = useAuth();
    const agenda = dados?.agenda;
    const [selected, setSelected] = useState(null);
    const [tipoContratoId, setTipoContratoId] = useState(1);
    const [admissao, setAdmissao] = useState("");
    const [demissao, setDemissao] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const tiposContrato = {
        1: "CLT",
        2: "ESTÁGIO",
        3: "PJ",
    };

    const handleSelect = (email) => {
      const funcionario = agenda.find((f) => f.mail === email);
      if (funcionario) {
        setSelected(funcionario);
      }
    };
  
    const formatDate = (dateStr) => {
      if (!dateStr) return null;
      return new Date(dateStr).toISOString();
    };
  
    const handleSubmit = async (type) => {
      if (!selected) return;
    
      const body = {
        adminEmail: user.mail,
        funcionario: {
          nome: selected.givenName,
          sobrenome: selected.surname,
          email: selected.mail,
          tipoContratoId: parseInt(tipoContratoId),
          admissao: formatDate(admissao),
          demissao: demissao ? formatDate(demissao) : null,
          isAdmin: isAdmin,
        },
      };
      // console.log(body);
      if (
        !body.adminEmail ||
        !body.funcionario.nome ||
        !body.funcionario.sobrenome ||
        !body.funcionario.email ||
        !body.funcionario.tipoContratoId ||
        !body.funcionario.admissao
      ) {
        alert("Todos os campos devem estar preenchidos, com exceção do campo 'demissão'.");
        return;
      }
      confirm(
        `Solicitante: ${body.adminEmail}\n` +
        `Confirma os dados da requisição?\n` +
        `Nome: ${body.funcionario.nome}\n` +
        `Sobrenome: ${body.funcionario.sobrenome}\n` +
        `Email: ${body.funcionario.email}\n` +
        `Tipo Contrato: ${body.funcionario.tipoContratoId} - ${tiposContrato[body.funcionario.tipoContratoId]}\n` +
        `Administrador: ${body.funcionario.isAdmin ? 'Sim' : 'Não'}\n`
      );
      try {
        let response;
      
        if (type === "create") {
          const response = await apiService.createUser(body);
          if (response.statusText === "OK") {
            alert("Usuário criado com sucesso!");
          }
        } else {
          const response = await apiService.editUser(body);
          if (response.statusText === "OK") {
            alert("Usuário editado com sucesso!");
          }
        }
      } catch (error) {
        console.error("Erro ao enviar requisição:", error);
        alert(`Ocorreu um erro. Tente novamente, ${error.response.data.message}.`);
      }
    };
    

    return (
        <>
            {dados &&
                <Container>
                    <Select onChange={(e) => handleSelect(e.target.value)}>
                        <option value="">-- Escolha um funcionário --</option>
                        {agenda?.map((item, index) => (
                            <option key={index} value={item.mail}>
                                {item.name}
                            </option>
                        ))}
                    </Select>
                    {selected && (
                        <>
                            <div>
                                <Label>Tipo de Contrato</Label>
                                <Select
                                    value={tipoContratoId}
                                    onChange={(e) => setTipoContratoId(Number(e.target.value))}
                                >
                                    <option value="">Selecione...</option>
                                    {Object.entries(tiposContrato).map(([id, nome]) => (
                                        <option key={id} value={id}>
                                            {nome}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                            <div>
                                <Label>Data de Admissão</Label>
                                <Input
                                    type="date"
                                    value={admissao}
                                    onChange={(e) => setAdmissao(e.target.value)}
                                />
                            </div>
                            <div>
                                <Label>Data de Demissão (opcional)</Label>
                                <Input
                                    type="date"
                                    value={demissao}
                                    onChange={(e) => setDemissao(e.target.value)}
                                />
                            </div>
                            <div>
                                <Label>
                                    <Checkbox
                                        type="checkbox"
                                        checked={isAdmin}
                                        onChange={(e) => setIsAdmin(e.target.checked)}
                                    />
                                    É administrador?
                                </Label>
                            </div>
                            <ButtonContainer>
                                <Button onClick={() => handleSubmit("create")}>Criar Usuário</Button>
                                <Button onClick={() => handleSubmit("edit")}>Editar Usuário</Button>
                            </ButtonContainer>
                        </>
                    )}
                </Container>
            }
        </>
    );
};

export default UserComponent;

const Container = styled.div`
    width: 60%;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
    gap: 25px;
    div { 
        justify-content: center;
        align-items: center;
        gap: 20px;
        select{
          width: 250px;
        }
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
  width: 550px;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const Input = styled.input`
  width: 250px;
  justify-content: center;
  text-align: center;
  border-radius: 6px;
  border: 1px solid #ccc;
  height: 40px;
`;

const Checkbox = styled.input`
  margin-right: 8px;
  width: 50px;
  padding: 20px;
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