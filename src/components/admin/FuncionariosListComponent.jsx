import { useMemo, useState } from "react";
import styled from "styled-components";
import { FiCopy, FiCheck } from "react-icons/fi";

function formatDate(dateStr) {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("pt-BR");
}

function FuncionariosListComponent({ funcionarios, gestores, info }) {
    const [busca, setBusca] = useState("");
    const [copiadoId, setCopiadoId] = useState(null);

    const handleCopy = async (texto, id) => {
        if (!texto) return;
        try {
            await navigator.clipboard.writeText(texto);
            setCopiadoId(id);
            setTimeout(() => setCopiadoId((atual) => (atual === id ? null : atual)), 1500);
        } catch (error) {
            console.error("Erro ao copiar:", error);
        }
    };

    const contratoMap = useMemo(() => Object.fromEntries(
        (info?.listaContratos ?? []).map((c) => [c.id, c.tipo])
    ), [info]);
    const jornadaMap = useMemo(() => Object.fromEntries(
        (info?.listaJornadas ?? []).map((c) => [c.id, c.tipo])
    ), [info]);
    const areaMap = useMemo(() => Object.fromEntries(
        (info?.listaAreas ?? []).map((c) => [c.id, c.area])
    ), [info]);
    // O campo "isManager" do próprio funcionário pode estar desatualizado.
    // A lista "gestores" (quem gerencia cada área) é a fonte confiável usada
    // no restante do sistema, então é ela que decide o badge "Gestor".
    const gestorIds = useMemo(() => new Set(
        (gestores ?? []).map((g) => g.funcionarioId)
    ), [gestores]);

    const lista = useMemo(() => {
        const termo = busca.trim().toLowerCase();
        const base = funcionarios ?? [];
        if (!termo) return base;
        return base.filter((f) =>
            `${f.nome ?? ""} ${f.sobrenome ?? ""} ${f.email ?? ""} ${f.cargo ?? ""}`
                .toLowerCase()
                .includes(termo)
        );
    }, [funcionarios, busca]);

    return (
        <Container>
            <SearchBar>
                <input
                    type="text"
                    placeholder="Buscar por nome, e-mail ou cargo..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                />
                <Contador>{lista.length} funcionário(s)</Contador>
            </SearchBar>

            <Grid>
                {lista.map((f) => (
                    <Card key={f.id ?? f.email}>
                        <CardHeader>
                            <Avatar>{(f.nome?.[0] ?? "?").toUpperCase()}</Avatar>
                            <HeaderInfo>
                                <Nome>{f.nome} {f.sobrenome}</Nome>
                                <Cargo>{f.cargo || "-"}</Cargo>
                                {gestorIds.has(f.id) && <Badge>Gestor</Badge>}
                            </HeaderInfo>
                        </CardHeader>

                        <Details>
                            <DetailItem>
                                <span>E-mail</span>
                                <EmailRow>
                                    <EmailValue title={f.email || "-"}>{f.email || "-"}</EmailValue>
                                    {f.email && (
                                        <CopyButton
                                            type="button"
                                            title="Copiar e-mail"
                                            onClick={() => handleCopy(f.email, f.id ?? f.email)}
                                        >
                                            {copiadoId === (f.id ?? f.email) ? <FiCheck /> : <FiCopy />}
                                        </CopyButton>
                                    )}
                                </EmailRow>
                            </DetailItem>
                            <DetailItem>
                                <span>Telefone</span>
                                <p>{f.telefone || "-"}</p>
                            </DetailItem>
                            <DetailItem>
                                <span>Nível</span>
                                <p>{f.nivel || "-"}</p>
                            </DetailItem>
                            <DetailItem>
                                <span>Localização</span>
                                <p>{f.localizacao || "-"}</p>
                            </DetailItem>
                            <DetailItem>
                                <span>Área</span>
                                <p>{areaMap[f.areaId] ?? f.areaId ?? "-"}</p>
                            </DetailItem>
                            <DetailItem>
                                <span>Tipo de Contrato</span>
                                <p>{contratoMap[f.tipoContratoId] ?? f.tipoContratoId ?? "-"}</p>
                            </DetailItem>
                            <DetailItem>
                                <span>Tipo de Jornada</span>
                                <p>{jornadaMap[f.jornadaId] ?? f.jornadaId ?? "-"}</p>
                            </DetailItem>
                            <DetailItem>
                                <span>Data de Admissão</span>
                                <p>{formatDate(f.admissao)}</p>
                            </DetailItem>
                            <DetailItem>
                                <span>Entrada</span>
                                <p>{formatDate(f.entrada)}</p>
                            </DetailItem>
                            <DetailItem>
                                <span>Aniversário</span>
                                <p>{formatDate(f.aniversario)}</p>
                            </DetailItem>
                            {f.demissao && (
                                <DetailItem>
                                    <span>Data de Demissão</span>
                                    <p>{formatDate(f.demissao)}</p>
                                </DetailItem>
                            )}
                        </Details>
                    </Card>
                ))}
                {lista.length === 0 && <Vazio>Nenhum funcionário encontrado.</Vazio>}
            </Grid>
        </Container>
    );
}

export default FuncionariosListComponent;

const Container = styled.div`
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 1400px;
    gap: 20px;
    padding: 10px 0 50px;
`;

const SearchBar = styled.div`
    width: 100%;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    padding: 0 10px;

    input {
        flex: 1;
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

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    align-items: stretch;
    gap: 24px;
    width: 100%;
    padding: 0 10px;
`;

const Card = styled.div`
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    overflow: hidden;
`;

const CardHeader = styled.div`
    align-items: center;
    width: 100%;
    gap: 10px;
    padding: 16px 20px;
    background: linear-gradient(94.61deg, #E7185A 3.73%, #aa1041ff 133.27%);
    color: white;
`;

const Avatar = styled.div`
    width: 40px;
    height: 40px;
    min-width: 40px;
    flex-shrink: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.25);
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 16px;
`;

const HeaderInfo = styled.div`
    flex: 1 1 auto;
    width: auto;
    height: 60px;
    min-width: 0;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    text-align: left;
`;

const Nome = styled.p`
    width: 100%;
    text-align: left;
    font-weight: 700;
    font-size: 17px;
    line-height: 21px;
`;

const Cargo = styled.p`
    width: 100%;
    text-align: left;
    font-size: 13px;
    opacity: 0.9;
`;

const Badge = styled.span`
    font-size: 11px;
    font-weight: 700;
    padding: 3px 8px 3px 0;
    border-radius: 10px;
    white-space: nowrap;
    background: rgba(255, 255, 255, 0.25);
    color: white;
`;

const EmailRow = styled.div`
    align-items: center;
    width: 100%;
    min-width: 0;
    gap: 4px;

    button {
        opacity: 0;
    }

    &:hover button {
        opacity: 1;
    }
`;

const EmailValue = styled.p`
    flex: 1 1 auto;
    min-width: 0;
    text-align: left;
    font-size: 14px;
    color: #444;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const CopyButton = styled.button`
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    min-width: 24px;
    padding: 0;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 6px;
    background: #f0f0f0;
    color: #777;
    font-size: 13px;
    transition: opacity 0.15s ease, color 0.15s ease, background 0.15s ease;

    &:hover {
        color: #E7185A;
        background: #f7dbe4;
    }
`;

const Details = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px 20px;
    width: 100%;
    padding: 20px;
`;

const DetailItem = styled.div`
    flex-direction: column;
    align-items: flex-start;
    gap: 3px;
    min-width: 0;

    span {
        width: 100%;
        text-align: left;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        color: #aaa;
    }

    p {
        width: 100%;
        text-align: left;
        font-size: 14px;
        color: #444;
        word-break: break-word;
    }
`;

const Vazio = styled.p`
    width: 100%;
    color: #777;
    padding: 20px;
`;
