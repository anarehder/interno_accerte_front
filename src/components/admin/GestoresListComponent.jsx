import { useMemo, useState } from "react";
import styled from "styled-components";
import { FaTrash, FaPlus } from "react-icons/fa6";
import { FiEdit2, FiCheck, FiX } from "react-icons/fi";
import apiService from "../../services/apiService";

const linhaVazia = { funcionarioId: "", areaId: "", gestorSuperiorId: "" };

function GestoresListComponent({ funcionarios, gestores, areas, getData }) {
    const [busca, setBusca] = useState("");
    const [criando, setCriando] = useState(false);
    const [novo, setNovo] = useState(linhaVazia);
    const [editandoId, setEditandoId] = useState(null);
    const [edicao, setEdicao] = useState(linhaVazia);
    const [salvando, setSalvando] = useState(false);

    const funcionarioMap = useMemo(() => Object.fromEntries(
        (funcionarios ?? []).map((f) => [f.id, f])
    ), [funcionarios]);
    const areaMap = useMemo(() => Object.fromEntries(
        (areas ?? []).map((a) => [a.id, a.area])
    ), [areas]);
    const funcionariosOrdenados = useMemo(() => (
        [...(funcionarios ?? [])].sort((a, b) =>
            `${a.nome} ${a.sobrenome}`.localeCompare(`${b.nome} ${b.sobrenome}`)
        )
    ), [funcionarios]);
    const areasOrdenadas = useMemo(() => (
        [...(areas ?? [])].sort((a, b) => (a.area ?? "").localeCompare(b.area ?? ""))
    ), [areas]);

    const nomeFuncionario = (id) => {
        const f = funcionarioMap[id];
        return f ? `${f.nome} ${f.sobrenome}` : "-";
    };

    const lista = useMemo(() => {
        const termo = busca.trim().toLowerCase();
        const base = [...(gestores ?? [])].sort((a, b) => {
            const porArea = (areaMap[a.areaId] ?? "").localeCompare(areaMap[b.areaId] ?? "");
            if (porArea !== 0) return porArea;
            return nomeFuncionario(a.funcionarioId).localeCompare(nomeFuncionario(b.funcionarioId));
        });
        if (!termo) return base;
        return base.filter((g) => {
            const texto = `${nomeFuncionario(g.funcionarioId)} ${funcionarioMap[g.funcionarioId]?.email ?? ""} ${areaMap[g.areaId] ?? ""}`;
            return texto.toLowerCase().includes(termo);
        });
    }, [gestores, busca, funcionarioMap, areaMap]);

    const iniciarCriacao = () => {
        setEditandoId(null);
        setNovo(linhaVazia);
        setCriando(true);
    };

    const cancelarCriacao = () => {
        setCriando(false);
        setNovo(linhaVazia);
    };

    const iniciarEdicao = (g) => {
        setCriando(false);
        setEditandoId(g.id);
        setEdicao({
            funcionarioId: g.funcionarioId ?? "",
            areaId: g.areaId ?? "",
            gestorSuperiorId: g.gestorSuperiorId ?? "",
        });
    };

    const cancelarEdicao = () => {
        setEditandoId(null);
        setEdicao(linhaVazia);
    };

    const handleCriar = async () => {
        if (!novo.funcionarioId || !novo.areaId) {
            alert("Selecione o funcionário e a área.");
            return;
        }
        const body = {
            gestor: {
                funcionarioId: Number(novo.funcionarioId),
                areaId: Number(novo.areaId),
                gestorSuperiorId: novo.gestorSuperiorId ? Number(novo.gestorSuperiorId) : null,
            },
        };
        setSalvando(true);
        try {
            await apiService.criarGestor(body);
            alert("Gestor cadastrado com sucesso!");
            cancelarCriacao();
            await getData();
        } catch (error) {
            console.error("Erro ao criar gestor:", error);
            alert("Ocorreu um erro ao cadastrar o gestor. Tente novamente.");
        } finally {
            setSalvando(false);
        }
    };

    const handleEditar = async (id) => {
        if (!edicao.funcionarioId || !edicao.areaId) {
            alert("Selecione o funcionário e a área.");
            return;
        }

        const confirmado = window.confirm(
            `Deseja realmente salvar as alterações?\n` +
            `Gestor: ${nomeFuncionario(Number(edicao.funcionarioId))}\n` +
            `Área: ${areaMap[Number(edicao.areaId)] ?? "-"}\n` +
            `Gestor Superior: ${edicao.gestorSuperiorId ? nomeFuncionario(Number(edicao.gestorSuperiorId)) : "-"}`
        );
        if (!confirmado) return;

        const body = {
            gestor: {
                funcionarioId: Number(edicao.funcionarioId),
                areaId: Number(edicao.areaId),
                gestorSuperiorId: edicao.gestorSuperiorId ? Number(edicao.gestorSuperiorId) : null,
            },
        };
        setSalvando(true);
        try {
            await apiService.editarGestor(id, body);
            alert("Gestor atualizado com sucesso!");
            cancelarEdicao();
            await getData();
        } catch (error) {
            console.error("Erro ao editar gestor:", error);
            alert("Ocorreu um erro ao editar o gestor. Tente novamente.");
        } finally {
            setSalvando(false);
        }
    };

    const handleExcluir = async (g) => {
        const confirmado = window.confirm(
            `Deseja realmente remover ${nomeFuncionario(g.funcionarioId)} como gestor de "${areaMap[g.areaId] ?? "área"}"? Essa ação não pode ser desfeita.`
        );
        if (!confirmado) return;

        try {
            await apiService.deletarGestor(g.id);
            await getData();
        } catch (error) {
            console.error("Erro ao excluir gestor:", error);
            alert("Ocorreu um erro ao excluir. Tente novamente.");
        }
    };

    return (
        <Container>
            <TopBar>
                <input
                    type="text"
                    placeholder="Buscar por gestor ou área..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                />
                <Contador>{lista.length} gestor(es)</Contador>
                <NovoButton type="button" onClick={iniciarCriacao} disabled={criando}>
                    <FaPlus size={13} /> Novo gestor
                </NovoButton>
            </TopBar>

            <Tabela>
                <Cabecalho>
                    <span>Gestor</span>
                    <span>Área</span>
                    <span>Gestor Superior</span>
                    <span>Ações</span>
                </Cabecalho>

                {criando && (
                    <Linha $editando>
                        <Select value={novo.funcionarioId} onChange={(e) => setNovo((p) => ({ ...p, funcionarioId: e.target.value }))}>
                            <option value="">Selecione o funcionário...</option>
                            {funcionariosOrdenados.map((f) => (
                                <option key={f.id} value={f.id}>{f.nome} {f.sobrenome}</option>
                            ))}
                        </Select>
                        <Select value={novo.areaId} onChange={(e) => setNovo((p) => ({ ...p, areaId: e.target.value }))}>
                            <option value="">Selecione a área...</option>
                            {areasOrdenadas.map((a) => (
                                <option key={a.id} value={a.id}>{a.area}</option>
                            ))}
                        </Select>
                        <Select value={novo.gestorSuperiorId} onChange={(e) => setNovo((p) => ({ ...p, gestorSuperiorId: e.target.value }))}>
                            <option value="">Nenhum</option>
                            {funcionariosOrdenados.map((f) => (
                                <option key={f.id} value={f.id}>{f.nome} {f.sobrenome}</option>
                            ))}
                        </Select>
                        <Acoes>
                            <IconButton type="button" title="Salvar" $confirmar onClick={handleCriar} disabled={salvando}>
                                <FiCheck size={16} />
                            </IconButton>
                            <IconButton type="button" title="Cancelar" onClick={cancelarCriacao} disabled={salvando}>
                                <FiX size={16} />
                            </IconButton>
                        </Acoes>
                    </Linha>
                )}

                {lista.map((g) => {
                    const emEdicao = editandoId === g.id;
                    return (
                        <Linha key={g.id} $editando={emEdicao}>
                            {emEdicao ? (
                                <Select value={edicao.funcionarioId} onChange={(e) => setEdicao((p) => ({ ...p, funcionarioId: e.target.value }))}>
                                    <option value="">Selecione o funcionário...</option>
                                    {funcionariosOrdenados.map((f) => (
                                        <option key={f.id} value={f.id}>{f.nome} {f.sobrenome}</option>
                                    ))}
                                </Select>
                            ) : (
                                <span title={funcionarioMap[g.funcionarioId]?.email ?? ""}>{nomeFuncionario(g.funcionarioId)}</span>
                            )}

                            {emEdicao ? (
                                <Select value={edicao.areaId} onChange={(e) => setEdicao((p) => ({ ...p, areaId: e.target.value }))}>
                                    <option value="">Selecione a área...</option>
                                    {areasOrdenadas.map((a) => (
                                        <option key={a.id} value={a.id}>{a.area}</option>
                                    ))}
                                </Select>
                            ) : (
                                <span>{areaMap[g.areaId] ?? "-"}</span>
                            )}

                            {emEdicao ? (
                                <Select value={edicao.gestorSuperiorId} onChange={(e) => setEdicao((p) => ({ ...p, gestorSuperiorId: e.target.value }))}>
                                    <option value="">Nenhum</option>
                                    {funcionariosOrdenados.map((f) => (
                                        <option key={f.id} value={f.id}>{f.nome} {f.sobrenome}</option>
                                    ))}
                                </Select>
                            ) : (
                                <span>{g.gestorSuperiorId ? nomeFuncionario(g.gestorSuperiorId) : "-"}</span>
                            )}

                            <Acoes>
                                {emEdicao ? (
                                    <>
                                        <IconButton type="button" title="Salvar" $confirmar onClick={() => handleEditar(g.id)} disabled={salvando}>
                                            <FiCheck size={16} />
                                        </IconButton>
                                        <IconButton type="button" title="Cancelar" onClick={cancelarEdicao} disabled={salvando}>
                                            <FiX size={16} />
                                        </IconButton>
                                    </>
                                ) : (
                                    <>
                                        <IconButton type="button" title="Editar" onClick={() => iniciarEdicao(g)}>
                                            <FiEdit2 size={15} />
                                        </IconButton>
                                        <IconButton type="button" title="Excluir" $perigo onClick={() => handleExcluir(g)}>
                                            <FaTrash size={14} />
                                        </IconButton>
                                    </>
                                )}
                            </Acoes>
                        </Linha>
                    );
                })}

                {lista.length === 0 && !criando && <Vazio>Nenhum gestor encontrado.</Vazio>}
            </Tabela>
        </Container>
    );
}

export default GestoresListComponent;

const Container = styled.div`
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 1300px;
    gap: 20px;
    padding: 10px 0 50px;
`;

const TopBar = styled.div`
    width: 100%;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    padding: 0 10px;
    flex-wrap: wrap;

    input {
        flex: 1;
        min-width: 220px;
        max-width: 420px;
        height: 44px;
        border-radius: 8px;
        border: 1px solid #ccc;
        text-indent: 12px;
        font-size: 16px;
    }
`;

const Contador = styled.span`
    font-weight: 600;
    color: #777;
    white-space: nowrap;
`;

const NovoButton = styled.button`
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    border: none;
    border-radius: 8px;
    background: linear-gradient(94.61deg, #E7185A 3.73%, #aa1041ff 133.27%);
    color: white;
    font-weight: 700;
    font-size: 15px;
    white-space: nowrap;

    &:hover {
        background: linear-gradient(94.61deg, #aa1041ff 3.73%, #E7185A 133.27%);
    }

    &:disabled {
        background: #ccc;
        cursor: not-allowed;
    }
`;

const Tabela = styled.div`
    flex-direction: column;
    width: 100%;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    overflow: hidden;
`;

const Cabecalho = styled.div`
    display: grid;
    grid-template-columns: 1.2fr 1fr 1.2fr 90px;
    gap: 10px;
    padding: 14px 20px;
    background: linear-gradient(94.61deg, #E7185A 3.73%, #aa1041ff 133.27%);
    color: white;
    font-weight: 700;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.03em;
`;

const Linha = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 110px;
    align-items: center;
    gap: 20px;
    padding: 14px 20px;
    border-bottom: 1px solid #eee;
    background: ${(p) => (p.$editando ? "#fff5f8" : "white")};
    &:last-child {
        border-bottom: none;
        
    }

    &:hover {
        background: ${(p) => (p.$editando ? "#f3c2d1" : "#edb1b1")};
    }

    span {
        font-size: 14px;
        color: #444;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
`;

const Select = styled.select`
    width: 100%;
    padding: 6px 8px;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 14px;
    background-color: white;
`;

const Acoes = styled.div`
    align-items: center;
    gap: 8px;
    margin-right: 15px;
`;

const IconButton = styled.button`
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    min-width: 32px;
    padding: 0;
    border: none;
    border-radius: 6px;
    background: #f0f0f0;
    color: ${(p) => (p.$perigo ? "#d32f2f" : p.$confirmar ? "#2e7d32" : "#555")};

    svg {
        flex-shrink: 0;
    }

    &:hover {
        background: ${(p) => (p.$perigo ? "#fbe2e2" : p.$confirmar ? "#e2f3e4" : "#e6e6e6")};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const Vazio = styled.p`
    width: 100%;
    color: #777;
    padding: 20px;
    text-align: center;
`;
