import { useState } from "react";
import styled from 'styled-components';
import apiServiceBucket from "../services/apiServiceBucket";
import HeaderNewComponent from "../components/basic/HeaderNewComponent";

function UploadOciPage() {
    const [arquivoFile, setArquivoFile] = useState(null);
    const [enviando, setEnviando] = useState(false);
    const [urlFinal, setUrlFinal] = useState("");
    const [copiado, setCopiado] = useState(false);

    const handleFile = (e) => {
        setArquivoFile(e.target.files[0] || null);
        setUrlFinal("");
        setCopiado(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!arquivoFile) {
            alert("Selecione um arquivo antes de enviar.");
            return;
        }

        setEnviando(true);
        try {
            await apiServiceBucket.uploadFile(arquivoFile, arquivoFile.name);
            const arquivoUrl = apiServiceBucket.getFileUrl(arquivoFile.name);
            setUrlFinal(arquivoUrl);
        } catch (error) {
            console.error("Erro ao enviar requisição:", error);
            alert("Ocorreu um erro ao enviar o arquivo. Tente novamente.");
        } finally {
            setEnviando(false);
        }
    };

    const handleCopiar = async () => {
        try {
            await navigator.clipboard.writeText(urlFinal);
            setCopiado(true);
            setTimeout(() => setCopiado(false), 2000);
        } catch (error) {
            console.error("Erro ao copiar URL:", error);
        }
    };

    return (
        <PageContainer>
            <HeaderNewComponent pageTitle={"Upload OCI"} returnTo="/homepage" />
            <Container>
                <div>
                    <Label>Arquivo</Label>
                    <FileInput
                        type="file"
                        id="arquivo"
                        onChange={handleFile}
                    />
                </div>

                <ButtonContainer>
                    <Button onClick={handleSubmit} disabled={enviando || !arquivoFile}>
                        {enviando ? "Enviando..." : "Subir Arquivo"}
                    </Button>
                </ButtonContainer>

                {urlFinal && (
                    <ResultContainer>
                        <Label>URL do arquivo</Label>
                        <ResultRow>
                            <Input type="text" value={urlFinal} readOnly onFocus={(e) => e.target.select()} />
                            <CopyButton onClick={handleCopiar} type="button">
                                {copiado ? "Copiado!" : "Copiar"}
                            </CopyButton>
                        </ResultRow>
                    </ResultContainer>
                )}
            </Container>
        </PageContainer>
    );
};

export default UploadOciPage;

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

const ResultContainer = styled.div`
    flex-direction: column;
    align-items: center;
    gap: 10px;
`

const ResultRow = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 10px;
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
  font-size: 16px;
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

  &:disabled {
    background-color: #a5d6a7;
    cursor: not-allowed;
  }
`;

const CopyButton = styled.button`
  padding: 10px 16px;
  background-color: #001143;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  white-space: nowrap;

  &:hover {
    background-color: #002a7a;
  }
`;
