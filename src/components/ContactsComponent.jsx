import React, { useState } from "react";
import styled from "styled-components";
import { FiPhone, FiMapPin, FiUsers, FiCopy, FiCheck, FiFilter, FiX } from "react-icons/fi";

// Paleta fixa de chips por área (fundo claro + texto na mesma matiz, alto
// contraste). Cada área recebe sempre a mesma cor, calculada por hash do id
// (estável mesmo que o nome da área mude).
const AREA_PALETTE = [
    { bg: "#e7f0fc", text: "#1c5cab" }, // azul
    { bg: "#fdece3", text: "#b84a1e" }, // laranja
    { bg: "#e2f7ef", text: "#127a57" }, // água
    { bg: "#fdf1d9", text: "#8a6300" }, // amarelo
    { bg: "#fbe8ef", text: "#b03865" }, // magenta
    { bg: "#e2f2e2", text: "#0a6b0a" }, // verde
    { bg: "#ece9fb", text: "#392f7a" }, // violeta
    { bg: "#fbe6e6", text: "#a53332" }, // vermelho
];

function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
    }
    return hash;
}

const corDaArea = (chave) => AREA_PALETTE[hashString(String(chave ?? "")) % AREA_PALETTE.length];

function ContactsComponent({dados, contatos}){
    // "contatos" é opcional: quando informado, é a lista exibida (ex: resultado da busca
    // na home page). "dados.funcionarios"/"dados.gestores" continuam sendo sempre a base
    // completa, usada para localizar o gestor mesmo quando ele não está nos resultados filtrados.
    const listaContatos = contatos ?? dados?.funcionarios ?? [];
    const listaGestores = dados?.gestores ?? [];
    const listaAreas = dados?.areas ?? [];

    const areaPorId = new Map(listaAreas.map(a => [a.id, a.area]));

    // Opções do filtro: só as áreas que de fato aparecem na lista atual de contatos.
    const areasDisponiveis = [...new Map(
        listaContatos
            .filter(c => c.areaId != null && areaPorId.has(c.areaId))
            .map(c => [c.areaId, areaPorId.get(c.areaId)])
    ).entries()]
        .map(([id, nome]) => ({ id, nome }))
        .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

    const [filtroArea, setFiltroArea] = useState("");
    const listaFiltrada = filtroArea
        ? listaContatos.filter(c => String(c.areaId) === filtroArea)
        : listaContatos;

    const [copiadoId, setCopiadoId] = useState(null);
    const copiarEmail = async (email, id) => {
        if (!email) return;
        try {
            await navigator.clipboard.writeText(email);
            setCopiadoId(id);
            setTimeout(() => setCopiadoId((atual) => (atual === id ? null : atual)), 1500);
        } catch (error) {
            console.error("Erro ao copiar e-mail:", error);
        }
    };

    // Quantas áreas esse funcionário gerencia (ao todo, em listaGestores).
    const areasGeridasPor = (funcionarioId) =>
        listaGestores.filter(g => g.funcionarioId === funcionarioId).length;

    // Quando uma área tem mais de um gestor cadastrado, prioriza o que é gestor
    // exclusivamente dela (ex: Josue, que só gerencia essa área). O gestor que
    // acumula várias áreas (ex: Ronildo) só aparece quando for a única opção.
    function gestorDaArea(areaId){
        const candidatos = listaGestores.filter(g => g.areaId === areaId);
        if (candidatos.length <= 1) return candidatos[0];
        return candidatos.find(g => areasGeridasPor(g.funcionarioId) === 1)
            ?? candidatos[0];
    }

    const iniciais = (contato) =>
        `${contato.nome?.[0] ?? ""}${contato.sobrenome?.[0] ?? ""}`.toUpperCase();

    return (
        <Wrapper>
            <TableCard>
                {listaContatos.length > 0 &&
                    <ToolBar>
                        <Count>{listaFiltrada.length} {listaFiltrada.length === 1 ? "contato" : "contatos"}</Count>
                        {areasDisponiveis.length > 0 &&
                            <FilterField>
                                <FiFilter />
                                <AreaSelect value={filtroArea} onChange={(e) => setFiltroArea(e.target.value)}>
                                    <option value="">Todas as áreas</option>
                                    {areasDisponiveis.map(a => (
                                        <option key={a.id} value={String(a.id)}>{a.nome}</option>
                                    ))}
                                </AreaSelect>
                                {filtroArea &&
                                    <ClearFilterButton type="button" title="Limpar filtro" onClick={() => setFiltroArea("")}>
                                        <FiX />
                                    </ClearFilterButton>
                                }
                            </FilterField>
                        }
                    </ToolBar>
                }
                <Table>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>E-mail</th>
                            <th>Telefone</th>
                            <th>Cargo</th>
                            <th>Gestor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaFiltrada.map((contato, index) => {
                            // Se a pessoa é gestor, exibe o gestor superior dela (registrado no
                            // próprio cadastro de gestor). Caso contrário, exibe o gestor da área.
                            const gestorProprio = listaGestores.find(g => g.funcionarioId === contato.id);
                            const gestorSuperior = gestorProprio
                                ? { funcionarioId: gestorProprio.gestorSuperiorId }
                                : gestorDaArea(contato.areaId);
                            const gestorFuncionario = dados?.funcionarios?.find(f => f.id === gestorSuperior?.funcionarioId);
                            const areaNome = areaPorId.get(contato.areaId);
                            const areaCor = corDaArea(contato.areaId ?? areaNome);

                            return (
                                <tr key={contato.id ?? index}>
                                    <td data-label="Nome">
                                        <Person>
                                            <Avatar>{iniciais(contato) || <FiUsers />}</Avatar>
                                            <IdentityStack>
                                                <Name>{contato.nome} {contato.sobrenome}</Name>
                                                {areaNome &&
                                                    <AreaBadge $bg={areaCor.bg} $text={areaCor.text}>
                                                        <AreaDot />
                                                        {areaNome}
                                                    </AreaBadge>
                                                }
                                                {contato.localizacao &&
                                                    <Tag><FiMapPin /> {contato.localizacao}</Tag>
                                                }
                                            </IdentityStack>
                                        </Person>
                                    </td>
                                    <td data-label="E-mail">
                                        {contato.email
                                            ? <EmailRow>
                                                <EmailValue title={contato.email}>{contato.email}</EmailValue>
                                                <CopyButton
                                                    type="button"
                                                    title="Copiar e-mail"
                                                    onClick={() => copiarEmail(contato.email, contato.id ?? contato.email)}
                                                >
                                                    {copiadoId === (contato.id ?? contato.email) ? <FiCheck /> : <FiCopy />}
                                                </CopyButton>
                                            </EmailRow>
                                            : <Muted>—</Muted>}
                                    </td>
                                    <td data-label="Telefone">
                                        {contato.telefone
                                            ? <ContactLink href={`tel:${contato.telefone}`}><FiPhone /> {contato.telefone}</ContactLink>
                                            : <Muted>—</Muted>}
                                    </td>
                                    <td data-label="Cargo">{contato.cargo || <Muted>—</Muted>}</td>
                                    <td data-label="Gestor">
                                        {gestorFuncionario
                                            ? <GestorBadge>{gestorFuncionario.nome} {gestorFuncionario.sobrenome}</GestorBadge>
                                            : <Muted>—</Muted>}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
                {listaFiltrada.length === 0 &&
                    <Empty>
                        <FiUsers size={28} />
                        <span>Nenhum contato encontrado</span>
                    </Empty>
                }
            </TableCard>
        </Wrapper>
    );
}

export default ContactsComponent;

const Wrapper = styled.div`
    width: 98%;
    max-width: 1550px;
    margin: 30px auto;
    font-family: "Poppins", sans-serif;
`;

const TableCard = styled.div`
    background: white;
    border-radius: 14px;
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    display: flex;
    flex-direction: column;
`;

const ToolBar = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px 12px;
    padding: 14px 16px;
    border-bottom: 1px solid #eef1f6;
`;

const Count = styled.span`
    flex-shrink: 0;
    color: #555;
    font-size: 14px;
    width: 400px;
    margin-left: 10px;
`;

const FilterField = styled.label`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    width: 480px;
    color: #6b7280;
    font-size: 13px;
`;

const AreaSelect = styled.select`
    width: 400px;
    border: 1px solid #d7deee;
    border-radius: 8px;
    padding: 7px 10px;
    font-size: 13px;
    color: #1a1a1a;
    background: #f8faff;
    cursor: pointer;

    &:focus {
        outline: none;
        border-color: #205fdd;
    }
`;

const ClearFilterButton = styled.button`
    flex-shrink: 0;
    max-width: 26px;
    height: 26px;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 6px;
    background: #eef2ff;
    color: #6b7280;
    font-size: 13px;
    cursor: pointer;
    transition: color 0.15s ease, background 0.15s ease;

    &:hover {
        color: #a53332;
        background: #fbe6e6;
    }
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;

    thead tr {
        background: linear-gradient(to right, #003591, #205fdd);
    }

    th {
        color: white;
        font-size: 13px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        text-align: left;
        padding: 16px 18px;
        white-space: nowrap;
    }

    td {
        padding: 14px 18px;
        color: #444;
        font-size: 14px;
        vertical-align: middle;
        border-bottom: 1px solid #eef1f6;
    }

    tbody tr {
        transition: background-color 0.15s ease;
    }

    tbody tr:nth-of-type(even) {
        background-color: #f8faff;
    }

    tbody tr:hover {
        background-color: #eef4ff;
    }

    tbody tr:last-of-type td {
        border-bottom: none;
    }

    @media (min-width: 861px) {
        table-layout: fixed;

        th:nth-child(1),
        td:nth-child(1) {
            width: 24%;
        }

        th:nth-child(2),
        td:nth-child(2) {
            width: 22%;
        }

        th:nth-child(3),
        td:nth-child(3) {
            width: 12%;
            text-align: center;
        }

        th:nth-child(4),
        td:nth-child(4) {
            width: 20%;
        }

        th:nth-child(5),
        td:nth-child(5) {
            width: 22%;
        }
    }

    @media (max-width: 860px) {
        thead {
            display: none;
        }

        tbody, tr, td {
            display: block;
            width: 100%;
        }

        tbody tr {
            padding: 14px 16px;
            border-bottom: 8px solid #f3f5fa;
        }

        td {
            border-bottom: none;
            padding: 8px 4px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            text-align: right;
        }

        td::before {
            content: attr(data-label);
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.03em;
            color: #003591;
            text-align: left;
        }

        td[data-label="Nome"] {
            justify-content: flex-start;
        }

        td[data-label="Nome"]::before {
            display: none;
        }
    }
`;

const Person = styled.div`
    display: flex;
    align-items: center !important;
    gap: 12px !important;
`;

const IdentityStack = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start !important;
    gap: 5px !important;
`;

const Name = styled.span`
    font-weight: 600;
    font-size: 14px;
    color: #1a1a1a;
`;

const Avatar = styled.div`
    flex-shrink: 0;
    max-width: 38px;
    height: 38px;
    border-radius: 50%;
    background: linear-gradient(135deg, #205fdd, #003591);
    color: white;
    font-size: 13px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center !important;
`;

const EmailRow = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    max-width: 100%;

    button {
        opacity: 0;
    }

    &:hover button,
    button:focus-visible {
        opacity: 1;
    }
`;

const EmailValue = styled.span`
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
    color: #1a4cae;

    @media (max-width: 860px) {
        max-width: 160px;
    }
`;

const CopyButton = styled.button`
    flex-shrink: 0;
    max-width: 26px;
    height: 26px;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 6px;
    background: #eef2ff;
    color: #6b7280;
    font-size: 13px;
    cursor: pointer;
    transition: opacity 0.15s ease, color 0.15s ease, background 0.15s ease;

    &:hover {
        color: #1a4cae;
        background: #dbe6fb;
    }
`;

const ContactLink = styled.a`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #1a4cae;
    text-decoration: none;
    word-break: break-word;

    &:hover {
        text-decoration: underline;
    }

    svg {
        flex-shrink: 0;
        opacity: 0.8;
    }
`;

const Tag = styled.span`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #eef2ff;
    color: #1a4cae;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 12px;
`;

const AreaBadge = styled.span`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: ${p => p.$bg};
    color: ${p => p.$text};
    font-weight: 600;
    padding: 3px 10px 3px 8px;
    border-radius: 20px;
    font-size: 12px;
    white-space: nowrap;
`;

const AreaDot = styled.span`
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    flex-shrink: 0;
`;

const GestorBadge = styled.span`
    display: inline-flex;
    align-items: center;
    background: #e8f0fe;
    border: 1px solid #cfe0fb;
    color: #003591;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 13px;
`;

const Muted = styled.span`
    color: #b3b8c2;
`;

const Empty = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 60px 20px;
    color: #9aa2b1;
    font-size: 14px;
`;
