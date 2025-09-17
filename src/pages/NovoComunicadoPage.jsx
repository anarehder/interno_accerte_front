import { useState } from "react";
import styled from 'styled-components';
import { useAuth } from "../contexts/AuthContext";
import apiService from "../services/apiService";
import HeaderNewComponent from "../components/basic/HeaderNewComponent";

function NovoComunicadoPage() {
    const { user } = useAuth();
    const [form, setForm] = useState({ titulo: "", imagemUrl: "", linkExterno: "-", legenda: "", areaId: 7, dataDivulgacao: null });
    const baseUrl = "https://accerte.sharepoint.com/sites/AccerteTecnologiadaInformaoLtda/Documentos%20Compartilhados/Extras/COMUNICADOS/";

    const handleForm = (e) => {
        const { id, value } = e.target;

        let newValue;

        if (id === "areaId") {
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
        if (!form.titulo || !form.imagemUrl || !form.linkExterno || !form.areaId || !form.dataDivulgacao) {
            alert("Todos os campos obrigatórios devem ser preenchidos.");
            return;
        }
        const formComDatasFormatadas = {
            ...form,
            dataDivulgacao: form.dataDivulgacao,
            imagemUrl: form.imagemUrl &&  `${baseUrl}${encodeURIComponent(form.imagemUrl)}`
        };

        const body = {
            email: user.mail,
            comunicado: formComDatasFormatadas,
        };

        const confirmado = confirm(
            `Solicitante: ${body.email}\n` +
            `Deseja criar o comunicado:\n` +
            `Nome: ${body.comunicado.titulo}\n` +
            `Imagem: ${body.comunicado.imagemUrl}\n`+
            `Data: ${body.comunicado.dataDivulgacao}\n`
        );
        if (!confirmado) {
            // se cancelou, para tudo
            alert("Operação cancelada pelo usuário.");
            return;
        }

        try {
            const response = await apiService.criarComunicados(body);
            if (response.status === 200) {
                alert("Comunicado criado com sucesso!");
                setForm({ titulo: "", imagemUrl: "", linkExterno: "-", legenda: "", areaId: "", dataDivulgacao: null });
            }
        } catch (error) {
            console.error("Erro ao enviar requisição:", error);
            // alert(`Ocorreu um erro. Tente novamente, ${error.response.data.message}.`);
        }
    };


    return (
        <PageContainer>
        <HeaderNewComponent pageTitle={"Criar Comunicado"} />
        <Container>
            
            <div>
                <Label>Título</Label>
                <Input
                    type="text"
                    id="titulo"
                    value={form.titulo}
                    onChange={handleForm}
                />
            </div>
            <div>
                <Label>Legenda</Label>
                <Input
                    type="text"
                    id="legenda"
                    value={form.legenda}
                    onChange={handleForm}
                />
            </div>
            <div>
                <Label>Titulo Imagem Intranet</Label>
                <Input
                    type="text"
                    id="imagemUrl"
                    value={form.imagemUrl}
                    onChange={handleForm}
                />
            </div>
            <div>
                <Label>URL Imagem Sharepoint</Label>
                <p>
                {baseUrl}{encodeURIComponent(form.imagemUrl)}
                </p>
            </div>
            <div>
                <Label>Link Externo</Label>
                <Input
                    type="text"
                    id="linkExterno"
                    value={form.linkExterno}
                    onChange={handleForm}
                />
            </div>
            {/* <div>
                                <Label>Área</Label>
                                <Select id="areaId" value={form.areaId} onChange={handleForm}>
                                    <option value="">Selecione...</option>
                                    {info.listaAreas.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.area}
                                        </option>
                                    ))}
                                </Select>
                            </div> */}
            <div>
                <Label>Data de Divulgação</Label>
                <Input
                    type="date"
                    id="dataDivulgacao"
                    value={form.dataDivulgacao}
                    onChange={handleForm}
                />
            </div>

            <ButtonContainer>
                <Button onClick={handleSubmit}>Criar Comunicado</Button>
            </ButtonContainer>
        </Container>
        </PageContainer>
    );
};

export default NovoComunicadoPage;

const PageContainer = styled.div`
    width: 100%;
    min-height: 100%;
    flex-direction: column;
    align-items: center;
    position: absolute;
    gap: 20px;
    color:rgb(75, 74, 75);
`

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
    p{
        font-size: 12px;
        width:400px;
        word-break: break-all;
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