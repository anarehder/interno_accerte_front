import { useState } from "react";
import styled from 'styled-components';
import { useAuth } from "../contexts/AuthContext";
import apiServiceBucket from "../services/apiServiceBucket";
import HeaderNewComponent from "../components/basic/HeaderNewComponent";

const GRUPOS = ["Banner", "Comunicado", "AEM4"];

const getHoje = () => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
};

function NovoArquivoBucketPage() {
    const { user } = useAuth();
    const [form, setForm] = useState({ grupo: "", descricao: "", linkExterno: "", inicio: getHoje(), fim: "" });
    const [arquivoFile, setArquivoFile] = useState(null);
    const [enviando, setEnviando] = useState(false);

    const handleForm = (e) => {
        const { id, value } = e.target;

        setForm(prevForm => ({
            ...prevForm,
            [id]: value
        }));
    };

    const handleFile = (e) => {
        setArquivoFile(e.target.files[0] || null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.grupo || !form.descricao || !arquivoFile || !form.inicio) {
            alert("Todos os campos obrigatórios devem ser preenchidos.");
            return;
        }


        const arquivoUrl = apiServiceBucket.getFileUrl(arquivoFile.name);
        console.log(arquivoUrl);
        const body = {
            email: user.mail,
            arquivo: {
                grupo: form.grupo,
                descricao: form.descricao,
                arquivo: arquivoUrl,
                linkExterno: form.linkExterno,
                inicio: form.inicio,
                fim: form.fim || null,
            },
        };

        const confirmado = confirm(
            `Solicitante: ${body.email}\n` +
            `Deseja criar o arquivo:\n` +
            `Grupo: ${body.arquivo.grupo}\n` +
            `Descrição: ${body.arquivo.descricao}\n` +
            `Arquivo: ${body.arquivo.arquivo}\n` +
            `Início: ${body.arquivo.inicio}\n` +
            `Fim: ${body.arquivo.fim ?? "-"}\n`
        );
        if (!confirmado) {
            // se cancelou, para tudo
            alert("Operação cancelada pelo usuário.");
            return;
        }

        setEnviando(true);
        try {
            await apiServiceBucket.uploadFile(arquivoFile, arquivoFile.name);

            const response = await apiServiceBucket.criarArquivoCloud(body);
            if (response.status === 200) {
                alert("Arquivo criado com sucesso!");
                setForm({ grupo: "", descricao: "", linkExterno: "", inicio: getHoje(), fim: "" });
                setArquivoFile(null);
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
        <HeaderNewComponent pageTitle={"Criar Arquivo Cloud"} returnTo="/painelmarketing" />
        <Container>

            <div>
                <Label>Grupo</Label>
                <Select id="grupo" value={form.grupo} onChange={handleForm}>
                    <option value="">Selecione...</option>
                    {GRUPOS.map((g) => (
                        <option key={g} value={g}>
                            {g}
                        </option>
                    ))}
                </Select>
            </div>
            <div>
                <Label>Descrição</Label>
                <Input
                    type="text"
                    id="descricao"
                    value={form.descricao}
                    onChange={handleForm}
                />
            </div>
            <div>
                <Label>Arquivo</Label>
                <FileInput
                    type="file"
                    id="arquivo"
                    onChange={handleFile}
                />
            </div>
            <div>
                <Label>
                    Link Externo
                    <InfoIcon title="Redirecionamento a ser exibido quando a imagem aparecer - ao clicar na imagem será aberta a página destino deste link">i</InfoIcon>
                </Label>
                <Input
                    type="text"
                    id="linkExterno"
                    value={form.linkExterno}
                    onChange={handleForm}
                />
            </div>
            <div>
                <Label>Início</Label>
                <Input
                    type="date"
                    id="inicio"
                    value={form.inicio}
                    onChange={handleForm}
                />
            </div>
            <div>
                <Label>Fim</Label>
                <Input
                    type="date"
                    id="fim"
                    value={form.fim}
                    onChange={handleForm}
                />
            </div>

            <ButtonContainer>
                <Button onClick={handleSubmit} disabled={enviando}>
                    {enviando ? "Enviando..." : "Criar Arquivo"}
                </Button>
            </ButtonContainer>
        </Container>
        </PageContainer>
    );
};

export default NovoArquivoBucketPage;

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

const InfoIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-left: 8px;
  border-radius: 50%;
  background-color:rgb(75, 74, 75);
  color: #fff;
  font-size: 11px;
  font-weight: bold;
  font-style: italic;
  cursor: help;
  flex-shrink: 0;
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
