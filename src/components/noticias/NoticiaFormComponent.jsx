import { useEffect, useState } from "react";
import styled from "styled-components";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import { useAuth } from "../../contexts/AuthContext";
import apiService from "../../services/apiService";
import apiServiceBucket from "../../services/apiServiceBucket";
import { gerarSlugPreview } from "../../utils/noticiasUtils";

const STATUS_OPCOES = [
    { value: "RASCUNHO", label: "Rascunho" },
    { value: "PUBLICADO", label: "Publicado" },
    { value: "ARQUIVADO", label: "Arquivado" },
];

function NoticiaFormComponent({ valoresIniciais, slugAtual, onSubmit, textoBotao, onCancelar }) {
    const { user } = useAuth();
    const [form, setForm] = useState({
        titulo: "",
        resumo: "",
        conteudo: "",
        categoriaId: "",
        imagemCapaUrl: "",
        status: "RASCUNHO",
        destaque: false,
        areaId: "",
        publicadoEm: "",
        expiraEm: "",
        tags: "",
        ...valoresIniciais,
    });
    const [imagemFile, setImagemFile] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [areas, setAreas] = useState([]);
    const [novaCategoria, setNovaCategoria] = useState("");
    const [criandoCategoria, setCriandoCategoria] = useState(false);
    const [enviando, setEnviando] = useState(false);

    useEffect(() => {
        let ignorar = false;
        const fetchDados = async () => {
            try {
                const [categoriasRes, areasRes] = await Promise.all([
                    apiService.getNoticiasCategorias(),
                    apiService.buscarAreas(),
                ]);
                if (ignorar) return;
                setCategorias(categoriasRes.data || []);
                setAreas(areasRes.data || []);
            } catch (error) {
                console.error("Erro ao buscar categorias/áreas:", error);
            }
        };
        fetchDados();
        return () => { ignorar = true; };
    }, []);

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleConteudoChange = (valor) => {
        setForm((prev) => ({ ...prev, conteudo: valor || "" }));
    };

    const handleFile = (e) => {
        setImagemFile(e.target.files[0] || null);
    };

    const criarCategoria = async () => {
        const nome = novaCategoria.trim();
        if (!nome) return;
        setCriandoCategoria(true);
        try {
            const response = await apiService.criarCategoriaNoticia({ categoria: { nome } });
            setCategorias((prev) => [...prev, response.data]);
            setForm((prev) => ({ ...prev, categoriaId: response.data.id }));
            setNovaCategoria("");
        } catch (error) {
            alert(error?.response?.data?.message || "Erro ao criar categoria.");
        } finally {
            setCriandoCategoria(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.titulo.trim() || !form.resumo.trim() || !form.conteudo.trim() || !form.categoriaId) {
            alert("Preencha título, resumo, conteúdo e categoria.");
            return;
        }

        setEnviando(true);
        try {
            let imagemCapaUrl = form.imagemCapaUrl || "";

            if (imagemFile) {
                try {
                    await apiServiceBucket.fileExists(imagemFile.name);
                    alert(apiServiceBucket.ERRO_ARQUIVO_DUPLICADO);
                    setEnviando(false);
                    return;
                } catch (error) {
                    if (error.response?.status !== 404) {
                        throw error;
                    }
                }
                imagemCapaUrl = apiServiceBucket.getFileUrl(imagemFile.name);
                await apiServiceBucket.uploadFile(imagemFile, imagemFile.name);
            }

            const noticia = {
                titulo: form.titulo.trim(),
                resumo: form.resumo.trim(),
                conteudo: form.conteudo,
                categoriaId: Number(form.categoriaId),
                imagemCapaUrl: imagemCapaUrl || null,
                status: form.status,
                destaque: form.destaque,
                areaId: form.areaId ? Number(form.areaId) : null,
                publicadoEm: form.publicadoEm ? new Date(form.publicadoEm).toISOString() : null,
                expiraEm: form.expiraEm ? new Date(form.expiraEm).toISOString() : null,
                tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
            };

            await onSubmit(noticia);
        } catch (error) {
            console.error("Erro ao salvar notícia:", error);
            alert(error?.response?.data?.message || "Erro ao salvar a notícia.");
        } finally {
            setEnviando(false);
        }
    };

    const slugPreview = slugAtual || gerarSlugPreview(form.titulo) || "-";

    return (
        <Card>
            <Formulario onSubmit={handleSubmit}>
                <Campo>
                    <Label>Título <Required>*</Required></Label>
                    <Input type="text" name="titulo" maxLength={255} value={form.titulo} onChange={handleChange} />
                </Campo>

                <Campo>
                    <Label>Slug</Label>
                    <SlugBox>{slugPreview}</SlugBox>
                    <Ajuda>Gerado automaticamente a partir do título. {slugAtual && "Não muda ao editar, pra não quebrar links já compartilhados."}</Ajuda>
                </Campo>

                <Campo>
                    <Label>Resumo <Required>*</Required></Label>
                    <TextArea name="resumo" maxLength={500} rows={3} value={form.resumo} onChange={handleChange} />
                    <Ajuda>Exibido nos cards da listagem de notícias. {form.resumo.length}/500</Ajuda>
                </Campo>

                <Campo>
                    <Label>Autor</Label>
                    <SlugBox>{user?.displayName || "Você"}</SlugBox>
                    <Ajuda>A notícia é sempre publicada em nome de quem está logado.</Ajuda>
                </Campo>

                <Campo>
                    <Label>Categoria <Required>*</Required></Label>
                    <Select name="categoriaId" value={form.categoriaId} onChange={handleChange}>
                        <option value="">Selecione...</option>
                        {categorias.map((c) => (
                            <option key={c.id} value={c.id}>{c.nome}</option>
                        ))}
                    </Select>
                    <NovaCategoriaRow>
                        <Input
                            type="text"
                            placeholder="Nova categoria"
                            value={novaCategoria}
                            onChange={(e) => setNovaCategoria(e.target.value)}
                        />
                        <SmallButton type="button" onClick={criarCategoria} disabled={criandoCategoria || !novaCategoria.trim()}>
                            {criandoCategoria ? "Criando..." : "+ Nova categoria"}
                        </SmallButton>
                    </NovaCategoriaRow>
                </Campo>

                <Campo>
                    <Label>Conteúdo <Required>*</Required></Label>
                    <EditorWrapper data-color-mode="light">
                        <MDEditor
                            value={form.conteudo}
                            onChange={handleConteudoChange}
                            height={380}
                            preview="edit"
                        />
                    </EditorWrapper>
                </Campo>

                <Campo>
                    <Label>Imagem de capa</Label>
                    {form.imagemCapaUrl && !imagemFile &&
                        <PreviewImg src={form.imagemCapaUrl} alt="Imagem atual" />
                    }
                    <FileInput type="file" accept="image/*" onChange={handleFile} />
                    <Ajuda>Enviada para o bucket (OCI); só o link é salvo na notícia.</Ajuda>
                </Campo>

                <Campo>
                    <Label>Área (opcional)</Label>
                    <Select name="areaId" value={form.areaId} onChange={handleChange}>
                        <option value="">Nenhuma</option>
                        {areas.map((a) => (
                            <option key={a.id} value={a.id}>{a.area}</option>
                        ))}
                    </Select>
                </Campo>

                <Linha>
                    <Campo>
                        <Label>Status</Label>
                        <Select name="status" value={form.status} onChange={handleChange}>
                            {STATUS_OPCOES.map((s) => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </Select>
                    </Campo>

                    <CampoCheckbox>
                        <label>
                            <input type="checkbox" name="destaque" checked={form.destaque} onChange={handleChange} />
                            &nbsp;Notícia em destaque
                        </label>
                    </CampoCheckbox>
                </Linha>

                <Linha>
                    <Campo>
                        <Label>Data de publicação (opcional)</Label>
                        <Input type="date" name="publicadoEm" value={form.publicadoEm} onChange={handleChange} />
                    </Campo>

                    <Campo>
                        <Label>Data de expiração (opcional)</Label>
                        <Input type="date" name="expiraEm" value={form.expiraEm} onChange={handleChange} />
                    </Campo>
                </Linha>

                <Campo>
                    <Label>Tags (separadas por vírgula)</Label>
                    <Input type="text" name="tags" placeholder="rh, benefícios, eventos" value={form.tags} onChange={handleChange} />
                </Campo>

                <SubmitRow>
                    {onCancelar &&
                        <CancelButton type="button" onClick={onCancelar}>Cancelar</CancelButton>
                    }
                    <SubmitButton type="submit" disabled={enviando}>
                        {enviando ? "Salvando..." : textoBotao}
                    </SubmitButton>
                </SubmitRow>
            </Formulario>
        </Card>
    )
}

export default NoticiaFormComponent;

const Card = styled.div`
    width: 97%;
    max-width: 1600px;
    margin: 0 auto 50px;
    background: white;
    border-radius: 20px;
    box-shadow: 0 2px 16px rgba(20, 30, 60, 0.08);
    padding: 40px;
    box-sizing: border-box;
`

const Formulario = styled.form`
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 26px;
    box-sizing: border-box;
`

const Campo = styled.div`
    flex: 1;
    flex-direction: column;
    gap: 8px;
`

const Linha = styled.div`
    gap: 26px;

    > div {
        flex: 1;
    }
`

const Label = styled.label`
    font-weight: 700;
    font-size: 12px;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    color: #0B2049;
    margin-top: 10px;
`

const Required = styled.span`
    color: #ED1F4C;
`

const Input = styled.input`
    width: 100%;
    border-radius: 10px;
    border: 1px solid #dfe3e8;
    text-indent: 14px;
    height: 46px;
    font-size: 15px;
    background: #fafbfc;
    box-sizing: border-box;
    transition: border-color 0.15s ease, background-color 0.15s ease;

    &:focus {
        outline: none;
        border-color: #205fdd;
        background: white;
    }
`

const FileInput = styled(Input)`
    text-indent: 0;
    padding: 8px;
    height: auto;
`

const TextArea = styled.textarea`
    width: 100%;
    border-radius: 10px;
    border: 1px solid #dfe3e8;
    padding: 14px;
    font-size: 15px;
    font-family: inherit;
    resize: vertical;
    background: #fafbfc;
    box-sizing: border-box;
    transition: border-color 0.15s ease, background-color 0.15s ease;

    &:focus {
        outline: none;
        border-color: #205fdd;
        background: white;
    }
`

const Select = styled.select`
    width: 100%;
    border-radius: 10px;
    border: 1px solid #dfe3e8;
    text-indent: 10px;
    height: 46px;
    font-size: 15px;
    background: #fafbfc;
    cursor: pointer;
    box-sizing: border-box;

    &:focus {
        outline: none;
        border-color: #205fdd;
        background: white;
    }
`

const SlugBox = styled.div`
    width: 100%;
    border-radius: 10px;
    border: 1px dashed #dfe3e8;
    padding: 0 14px;
    height: 46px;
    align-items: center;
    font-size: 15px;
    color: #667;
    background: #f4f6f9;
    box-sizing: border-box;
`

const Ajuda = styled.span`
    font-size: 13px;
    color: #8a8f98;
`

const NovaCategoriaRow = styled.div`
    gap: 10px;
    margin-top: 2px;
`

const SmallButton = styled.button`
    white-space: nowrap;
    padding: 0 14px;
    border-radius: 10px;
    border: 1px solid #003289;
    background: white;
    color: #003289;
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;

    &:hover:not(:disabled) {
        background: #003289;
        color: white;
    }
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`

const CampoCheckbox = styled.div`
    align-items: center;
    font-size: 15px;
    color: #333;

    label {
        align-items: center;
    }
    input {
        width: 18px;
        height: 18px;
        cursor: pointer;
    }
`

const PreviewImg = styled.img`
    width: 180px;
    height: 110px;
    object-fit: cover;
    border-radius: 10px;
    margin-bottom: 8px;
    border: 1px solid #dfe3e8;
`

const EditorWrapper = styled.div`
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid #dfe3e8;

    .w-md-editor {
        box-shadow: none;
    }
    .w-md-editor-toolbar {
        border-bottom: 1px solid #dfe3e8;
        background: #fafbfc;
    }
`

const SubmitRow = styled.div`
    justify-content: center;
    gap: 16px;
    margin-top: 10px;
`

const SubmitButton = styled.button`
    padding: 14px 40px;
    font-size: 16px;
    font-weight: 600;
    border: none;
    border-radius: 999px;
    background: linear-gradient(to right, #205fdd, #001143);
    color: white;
    cursor: pointer;
    box-shadow: 0 6px 16px rgba(32, 95, 221, 0.25);

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`

const CancelButton = styled.button`
    padding: 14px 32px;
    font-size: 16px;
    font-weight: 600;
    border: 1px solid #dfe3e8;
    border-radius: 999px;
    background: white;
    color: #555;
    cursor: pointer;

    &:hover {
        background: #f4f6f9;
    }
`
