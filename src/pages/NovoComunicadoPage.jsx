import { useState } from "react";
import styled from 'styled-components';
import { useAuth } from "../contexts/AuthContext";
import apiService from "../services/apiService";
import apiServiceBucket from "../services/apiServiceBucket";
import HeaderNewComponent from "../components/basic/HeaderNewComponent";

const getHoje = () => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
};

function NovoComunicadoPage() {
    const { user } = useAuth();
    const [form, setForm] = useState({ titulo: "", linkExterno: "-", legenda: "", areaId: 7, dataDivulgacao: null, tipo: "" });
    const [imagemFile, setImagemFile] = useState(null);
    const [enviando, setEnviando] = useState(false);

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

    const handleFile = (e) => {
        setImagemFile(e.target.files[0] || null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.titulo || !imagemFile || !form.linkExterno || !form.areaId || !form.dataDivulgacao || !form.tipo) {
            alert("Todos os campos obrigatórios devem ser preenchidos.");
            return;
        }

        setEnviando(true);
        try {
            try {
                await apiServiceBucket.fileExists(imagemFile.name);
                // se não deu erro, o arquivo já existe no bucket
                alert(apiServiceBucket.ERRO_ARQUIVO_DUPLICADO);
                return;
            } catch (error) {
                if (error.response?.status !== 404) {
                    throw error;
                }
                // 404: arquivo não existe, pode seguir
            }

            const imagemUrl = apiServiceBucket.getFileUrl(imagemFile.name);

            const body = {
                email: user.mail,
                comunicado: {
                    ...form,
                    imagemUrl,
                },
            };

            const confirmado = confirm(
                `Solicitante: ${body.email}\n` +
                `Deseja criar o comunicado:\n` +
                `Nome: ${body.comunicado.titulo}\n` +
                `Tipo: ${body.comunicado.tipo}\n` +
                `Imagem: ${body.comunicado.imagemUrl}\n`+
                `Data: ${body.comunicado.dataDivulgacao}\n`
            );
            if (!confirmado) {
                // se cancelou, para tudo
                alert("Operação cancelada pelo usuário.");
                return;
            }

            await apiServiceBucket.uploadFile(imagemFile, imagemFile.name);

            const response = await apiService.criarComunicados(body);
            if (response.status === 200) {
                const arquivoCloudBody = {
                    email: user.mail,
                    arquivo: {
                        grupo: "Comunicado",
                        descricao: form.titulo,
                        arquivo: imagemUrl,
                        linkExterno: (form.linkExterno && form.linkExterno !== "-") ? form.linkExterno : "",
                        inicio: getHoje(),
                        fim: null,
                    },
                };
                await apiServiceBucket.criarArquivoCloud(arquivoCloudBody);

                alert("Comunicado criado com sucesso!");
                setForm({ titulo: "", linkExterno: "-", legenda: "", areaId: 7, dataDivulgacao: null, tipo: "" });
                setImagemFile(null);
            }
        } catch (error) {
            console.error("Erro ao enviar requisição:", error);
            alert("Ocorreu um erro ao enviar o arquivo. Tente novamente.");
        } finally {
            setEnviando(false);
        }
    };


    return (
        <PageContainer>
        <HeaderNewComponent pageTitle={"Criar Comunicado"} returnTo="/painelmarketing" />
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
                <Label>Tipo</Label>
                <Select id="tipo" value={form.tipo} onChange={handleForm}>
                    <option value="">Selecione...</option>
                    <option value="Geral">Geral</option>
                    <option value="Accerte em Movimento 4">Accerte em Movimento 4</option>
                </Select>
            </div>
            <div>
                <Label>Imagem</Label>
                <FileInput
                    type="file"
                    id="imagem"
                    onChange={handleFile}
                />
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
                <Button onClick={handleSubmit} disabled={enviando}>
                    {enviando ? "Enviando..." : "Criar Comunicado"}
                </Button>
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

const FileInput = styled(Input)`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  text-indent: 0;

  &::file-selector-button {
    margin: 7px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Select = styled.select`
  width: 400px;
  justify-content: center;
  text-align: left;
  border-radius: 6px;
  border: 1px solid #ccc;
  text-indent: 8px;
  height: 40px;
  font-size: 18px;
  cursor: pointer;
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