import { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import MDEditor, { getCommands, selectWord, executeCommand } from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import { HiOutlineEye } from "react-icons/hi";
import { useAuth } from "../../contexts/AuthContext";
import apiService from "../../services/apiService";
import apiServiceBucket from "../../services/apiServiceBucket";
import { gerarSlugPreview, formatarDataNoticia } from "../../utils/noticiasUtils";
import NoticiaPreviewModalComponent from "./NoticiaPreviewModalComponent";

// markdown não tem sintaxe nativa de sublinhado; usa <u> (a preview já roda rehype-raw)
const underlineCommand = {
    name: "underline",
    keyCommand: "underline",
    shortcuts: "ctrlcmd+u",
    prefix: "<u>",
    suffix: "</u>",
    buttonProps: { "aria-label": "Sublinhar texto (ctrl + u)", title: "Sublinhar (ctrl + u)" },
    icon: (
        <svg width="12" height="12" viewBox="0 0 24 24">
            <path
                fill="currentColor"
                d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zM5 19v2h14v-2H5z"
            />
        </svg>
    ),
    execute: (state, api) => {
        const newSelectionRange = selectWord({
            text: state.text,
            selection: state.selection,
            prefix: state.command.prefix,
            suffix: state.command.suffix,
        });
        const state1 = api.setSelectionRange(newSelectionRange);
        executeCommand({
            api,
            selectedText: state1.selectedText,
            selection: state.selection,
            prefix: state.command.prefix,
            suffix: state.command.suffix,
        });
    },
};

const editorCommands = (() => {
    const cmds = getCommands();
    const indice = cmds.findIndex((c) => c.name === "strikethrough");
    cmds.splice(indice + 1, 0, underlineCommand);
    return cmds;
})();

const getHoje = () => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
};

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
    const [tagsDisponiveis, setTagsDisponiveis] = useState([]);
    const [novaTag, setNovaTag] = useState("");
    const [novaCategoria, setNovaCategoria] = useState("");
    const [criandoCategoria, setCriandoCategoria] = useState(false);
    const [enviando, setEnviando] = useState(false);
    const [mostrarPreview, setMostrarPreview] = useState(false);

    const tagsSelecionadas = useMemo(
        () => form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        [form.tags]
    );

    const imagemPreviewUrl = useMemo(() => {
        if (imagemFile) return URL.createObjectURL(imagemFile);
        return form.imagemCapaUrl || "";
    }, [imagemFile, form.imagemCapaUrl]);

    useEffect(() => {
        return () => {
            if (imagemFile) URL.revokeObjectURL(imagemPreviewUrl);
        };
    }, [imagemFile, imagemPreviewUrl]);

    useEffect(() => {
        let ignorar = false;
        const fetchDados = async () => {
            try {
                const [categoriasRes, areasRes, tagsRes] = await Promise.all([
                    apiService.getNoticiasCategorias(),
                    apiService.buscarAreas(),
                    apiService.getNoticiasTags(),
                ]);
                if (ignorar) return;
                setCategorias(categoriasRes.data || []);
                setAreas(areasRes.data || []);
                setTagsDisponiveis(tagsRes.data || []);
            } catch (error) {
                console.error("Erro ao buscar categorias/áreas/tags:", error);
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

    const handleConteudoChange = useCallback((valor) => {
        setForm((prev) => ({ ...prev, conteudo: valor || "" }));
    }, []);

    const handleFile = (e) => {
        setImagemFile(e.target.files[0] || null);
    };

    const alternarTag = (nome) => {
        setForm((prev) => {
            const atuais = prev.tags.split(",").map((t) => t.trim()).filter(Boolean);
            const novas = atuais.includes(nome)
                ? atuais.filter((t) => t !== nome)
                : [...atuais, nome];
            return { ...prev, tags: novas.join(", ") };
        });
    };

    const adicionarNovaTag = () => {
        const nome = novaTag.trim();
        if (!nome || tagsSelecionadas.includes(nome)) {
            setNovaTag("");
            return;
        }
        setForm((prev) => ({
            ...prev,
            tags: [...tagsSelecionadas, nome].join(", "),
        }));
        if (!tagsDisponiveis.some((t) => t.nome === nome)) {
            setTagsDisponiveis((prev) => [...prev, { id: nome, nome }]);
        }
        setNovaTag("");
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
                await apiServiceBucket.criarArquivoCloud({
                    email: user?.mail,
                    arquivo: {
                        grupo: "Notícias",
                        descricao: form.titulo.trim(),
                        arquivo: imagemCapaUrl,
                        linkExterno: "",
                        inicio: getHoje(),
                        fim: null,
                    },
                });
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
                            commands={editorCommands}
                            height={550}
                            minHeight={300}
                            maxHeight={1200}
                            preview="edit"
                            highlightEnable={false}
                        />
                    </EditorWrapper>
                    <Ajuda>Sem limite de tamanho. Arraste o canto inferior direito do editor pra redimensionar, ou use o ícone de tela cheia na barra de ferramentas.</Ajuda>
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
                        <DateInput type="date" name="publicadoEm" value={form.publicadoEm} onChange={handleChange} />
                    </Campo>

                    <Campo>
                        <Label>Data de expiração (opcional)</Label>
                        <DateInput type="date" name="expiraEm" value={form.expiraEm} onChange={handleChange} />
                    </Campo>
                </Linha>

                <Campo>
                    <Label>Tags</Label>
                    {tagsDisponiveis.length > 0 &&
                        <TagsLista>
                            {tagsDisponiveis.map((tag) => (
                                <TagPill
                                    key={tag.id}
                                    type="button"
                                    $ativa={tagsSelecionadas.includes(tag.nome)}
                                    onClick={() => alternarTag(tag.nome)}
                                >
                                    {tag.nome}
                                </TagPill>
                            ))}
                        </TagsLista>
                    }
                    <NovaCategoriaRow>
                        <Input
                            type="text"
                            placeholder="Nova tag"
                            value={novaTag}
                            onChange={(e) => setNovaTag(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    adicionarNovaTag();
                                }
                            }}
                        />
                        <SmallButton type="button" onClick={adicionarNovaTag} disabled={!novaTag.trim()}>
                            + Nova tag
                        </SmallButton>
                    </NovaCategoriaRow>
                    <Ajuda>Clique numa tag existente pra selecionar/remover, ou digite uma nova e adicione.</Ajuda>
                </Campo>

                <SubmitRow>
                    {onCancelar &&
                        <CancelButton type="button" onClick={onCancelar}>Cancelar</CancelButton>
                    }
                    <PreviewButton type="button" onClick={() => setMostrarPreview(true)}>
                        <HiOutlineEye size={18} />
                        Visualizar
                    </PreviewButton>
                    <SubmitButton type="submit" disabled={enviando}>
                        {enviando ? "Salvando..." : textoBotao}
                    </SubmitButton>
                </SubmitRow>
            </Formulario>

            {mostrarPreview &&
                <NoticiaPreviewModalComponent
                    onFechar={() => setMostrarPreview(false)}
                    titulo={form.titulo}
                    autorTexto={`Por ${user?.displayName || "Você"}`}
                    autorNome={user?.displayName || "Você"}
                    autorEmail={user?.mail}
                    dataTexto={formatarDataNoticia(form.publicadoEm, true) || formatarDataNoticia(new Date(), true)}
                    imagemCapaUrl={imagemPreviewUrl}
                    conteudo={form.conteudo}
                />
            }
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

const DateInput = styled(Input)`
    text-indent: 0;
    padding: 0 14px;
    justify-content: flex-start;

    &::-webkit-calendar-picker-indicator {
        margin-left: 8px;
        padding: 0;
        cursor: pointer;
    }
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

const TagsLista = styled.div`
    gap: 8px;
    flex-wrap: wrap;
`

const TagPill = styled.button`
    background: ${(props) => props.$ativa ? "#003289" : "white"};
    color: ${(props) => props.$ativa ? "white" : "#003289"};
    border: 1px solid #003289;
    border-radius: 999px;
    padding: 6px 14px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;

    &:hover {
        background: ${(props) => props.$ativa ? "#003289" : "#eef2fb"};
    }
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

const PreviewButton = styled.button`
    align-items: center;
    gap: 8px;
    padding: 14px 28px;
    font-size: 16px;
    font-weight: 600;
    border: 1px solid #205fdd;
    border-radius: 999px;
    background: white;
    color: #205fdd;
    cursor: pointer;

    &:hover {
        background: #e8eefc;
    }
`

