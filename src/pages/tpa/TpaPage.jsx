import { useEffect } from "react";
import styled from "styled-components";
import "./TpaPage.css";
import { initTpaDashboard } from "./tpaDashboardScript";
import HeaderNewComponent from "../../components/basic/HeaderNewComponent";

// Página TPA (Tempo de Primeiro Atendimento) — mesmo layout do dashboard de
// referência (tpa-dashboard/index.html): o HTML/CSS aqui é o mesmo, só
// convertido pra JSX, e a lógica (filtros, gráficos, exportação) roda como
// no original, com as chamadas de API passando pelo apiServiceJira, seguindo
// o padrão de services já usado no resto do projeto.
function TpaPage() {
    useEffect(() => {
        const cleanup = initTpaDashboard();
        return () => {
            if (cleanup) cleanup();
        };
    }, []);

    return (
        <PageContainer>

        <HeaderNewComponent pageTitle="TPA - Tempo de Primeiro Atendimento" />
        <div className="tpa-page-root">

            

            <div id="boot-overlay" className="boot-overlay">
                <div className="boot-card">
                    <div id="boot-spinner" className="boot-spinner"></div>
                    <p id="boot-msg">Carregando dados do Jira…</p>
                    <p id="boot-detail" className="boot-detail" hidden></p>
                    <button id="boot-retry" className="boot-retry" type="button" hidden>Tentar novamente</button>
                </div>
            </div>

            <div className="wrap" id="main-wrap" hidden>

                <header className="top">
                    <div>
                        <p className="eyebrow">Projeto SUPORTE · Jira Service Management</p>
                        <h1>TPA — Tempo de Primeiro Atendimento</h1>
                        <p className="subtitle" id="subtitle">Comparativo dos analistas a partir do SLA “Tempo para primeiro atendimento” de cada chamado.</p>
                    </div>
                    <div className="meta-block">
                        <div>Dados coletados até <span className="mono" id="generated-at">—</span></div>
                        <div>Total na base: <span className="mono" id="dataset-total">—</span> chamados</div>
                        <div className="meta-actions">
                            <button className="alert-toggle-btn" id="alert-toggle-btn" type="button" title="Tocar som e mostrar notificação quando um chamado entrar em estado crítico de SLA, mesmo com a aba em segundo plano">
                                <svg viewBox="0 0 16 16" fill="none"><path d="M8 1.6c-.5 0-.9.4-.9.9v.5C4.8 3.4 3.1 5.3 3.1 7.7v2.5c0 .5-.2.9-.5 1.3l-.8.9c-.5.5-.1 1.4.6 1.4h11.2c.7 0 1.1-.9.6-1.4l-.8-.9c-.3-.4-.5-.8-.5-1.3V7.7c0-2.4-1.7-4.3-4-4.7v-.5c0-.5-.4-.9-.9-.9z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" /><path d="M6.3 14.1a1.7 1.7 0 0 0 3.4 0" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /></svg>
                                <span id="alert-toggle-label">Ativar alertas</span>
                            </button>
                            <button className="export-btn" id="pdf-export-btn" type="button" title="Gera um PDF com o resumo do período/analista/prioridade selecionados">
                                <svg viewBox="0 0 16 16" fill="none"><path d="M8 1.5v8.5m0 0L4.8 6.8M8 10l3.2-3.2M2.5 12v1.5a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                Exportar PDF
                            </button>
                            <button className="refresh-btn" id="refresh-btn" type="button" title="Busca os dados mais recentes direto no Jira">
                                <svg viewBox="0 0 16 16" fill="none"><path d="M13.5 8a5.5 5.5 0 1 1-1.6-3.89M13.5 2.5v3.5H10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                Atualizar
                            </button>
                        </div>
                        <span id="refresh-status" className="refresh-status"></span>
                    </div>
                </header>

                <div className="controls-bar">
                    <div className="tabs" id="analyst-tabs" role="tablist" aria-label="Analista"></div>

                    <div className="period-group" id="period-group">
                        <div className="pill-group" id="period-pills" role="group" aria-label="Período"></div>
                        <div className="date-range" id="custom-range" hidden>
                            <input type="date" id="custom-from" />
                            <span>–</span>
                            <input type="date" id="custom-to" />
                        </div>
                    </div>
                </div>

                <div className="controls-bar" id="priority-bar">
                    <span className="filter-label">Prioridade</span>
                    <div className="pill-group" id="priority-pills" role="group" aria-label="Prioridade"></div>
                </div>

                <section className="kpi-grid" id="kpi-grid" aria-label="Indicadores"></section>

                <div className="panel" id="breach-drilldown-wrap" hidden>
                    <div className="panel-head">
                        <div>
                            <p className="panel-title" id="breach-drilldown-title">Chamados com estouro de SLA</p>
                            <p className="panel-desc" id="breach-drilldown-desc"></p>
                        </div>
                        <div className="panel-head-actions">
                            <button className="export-btn" id="breach-drilldown-export" type="button">
                                <svg viewBox="0 0 16 16" fill="none"><path d="M8 1.5v8.5m0 0L4.8 6.8M8 10l3.2-3.2M2.5 12v1.5a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                Exportar Excel
                            </button>
                            <button className="toggle-btn" id="breach-drilldown-close" type="button">Fechar ✕</button>
                        </div>
                    </div>
                    <div className="table-scroll" id="breach-drilldown-table"></div>
                </div>

                <div id="empty-state-wrap" hidden>
                    <div className="panel"><div className="empty-state">
                        <svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" /><path d="M16 16l4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                        <p id="empty-state-msg">Nenhum chamado nesse período.</p>
                        <p id="empty-state-detail" className="mono" style={{ fontSize: "11.5px" }} hidden></p>
                    </div></div>
                </div>

                <div id="content-wrap">

                    <section className="grid-2" id="overview-charts">
                        <div className="panel">
                            <div className="panel-head">
                                <div>
                                    <p className="panel-title">TPA médio por analista</p>
                                    <p className="panel-desc">Tempo médio até a primeira resposta, no período selecionado</p>
                                </div>
                            </div>
                            <div id="bar-chart"></div>
                        </div>

                        <div className="panel">
                            <div className="panel-head">
                                <div>
                                    <p className="panel-title">Estouro de SLA por analista</p>
                                    <p className="panel-desc">% de chamados que ultrapassaram a meta de primeira resposta</p>
                                </div>
                            </div>
                            <p className="status-chart-hint">Clique em um analista para ver os chamados que estouraram o SLA.</p>
                            <div id="status-chart"></div>
                        </div>
                    </section>

                    <div className="panel" id="tpa-distribution-panel">
                        <div className="panel-head">
                            <div>
                                <p className="panel-title">Distribuição do TPA</p>
                                <p className="panel-desc">Chamados respondidos, agrupados por faixa de tempo até a primeira resposta</p>
                            </div>
                        </div>
                        <div id="tpa-distribution-chart"></div>
                    </div>

                    <div className="panel" id="tpa-evolution-panel">
                        <div className="panel-head">
                            <div>
                                <p className="panel-title">Evolução do TPA</p>
                                <p className="panel-desc" id="tpa-evolution-desc">TPA médio da equipe mês a mês — mostra se o atendimento está melhorando</p>
                            </div>
                        </div>
                        <div className="pill-group" id="evolution-months-pills" role="group" aria-label="Janela da Evolução do TPA"></div>
                        <div id="tpa-evolution-summary"></div>
                        <div id="tpa-evolution-chart"></div>
                    </div>

                    <div className="panel" id="tpa-compliance-panel">
                        <div className="panel-head">
                            <div>
                                <p className="panel-title">Cumprimento da Meta</p>
                                <p className="panel-desc" id="tpa-compliance-desc">% de chamados respondidos dentro da meta de SLA, mês a mês</p>
                            </div>
                        </div>
                        <div className="pill-group" id="compliance-months-pills" role="group" aria-label="Janela do Cumprimento da Meta"></div>
                        <div id="tpa-compliance-summary"></div>
                        <div id="tpa-compliance-chart"></div>
                    </div>

                    <div className="panel" id="heatmap-panel">
                        <div className="panel-head">
                            <div>
                                <p className="panel-title">Volume por dia e horário</p>
                                <p className="panel-desc">Quando os chamados chegam — quanto mais escuro, mais chamados; passe o mouse para ver o TPA médio. Período independente do filtro principal, escolha abaixo</p>
                            </div>
                        </div>
                        <div className="pill-group" id="heatmap-period-pills" role="group" aria-label="Período do mapa de calor"></div>
                        <div className="date-range" id="heatmap-custom-range" hidden>
                            <input type="date" id="heatmap-custom-from" />
                            <span>–</span>
                            <input type="date" id="heatmap-custom-to" />
                        </div>
                        <div className="heatmap-wrap"><div className="heatmap-grid" id="heatmap-grid"></div></div>
                        <div className="legend heatmap-legend">
                            <span className="heatmap-legend-label">Menos chamados</span>
                            <span className="heatmap-legend-scale" aria-hidden="true"></span>
                            <span className="heatmap-legend-label">Mais chamados</span>
                        </div>
                    </div>

                    <div className="panel">
                        <div className="panel-head">
                            <div>
                                <p className="panel-title" id="trend-title">Tendência do TPA</p>
                                <p className="panel-desc" id="trend-desc">Média de tempo de primeira resposta (minutos)</p>
                            </div>
                            <button className="toggle-btn" id="trend-table-toggle" type="button" aria-pressed="false">Ver como tabela</button>
                        </div>
                        <div className="legend" id="trend-legend" role="group" aria-label="Filtrar séries"></div>
                        <div className="chart-wrap" id="trend-chart-wrap">
                            <div className="chart-scroll"><div id="trend-chart"></div></div>
                            <div className="tooltip" id="trend-tooltip"></div>
                        </div>
                        <div className="table-scroll" id="trend-table-wrap" hidden></div>
                    </div>

                    <div className="panel" id="summary-panel">
                        <div className="panel-head">
                            <div>
                                <p className="panel-title" id="summary-title">Resumo por analista</p>
                                <p className="panel-desc" id="summary-desc">Detalhamento do período selecionado</p>
                            </div>
                            <div className="panel-head-actions">
                                <button className="export-btn" id="summary-export-btn" type="button">
                                    <svg viewBox="0 0 16 16" fill="none"><path d="M8 1.5v8.5m0 0L4.8 6.8M8 10l3.2-3.2M2.5 12v1.5a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    Exportar Excel
                                </button>
                                <div className="export-popover" id="summary-export-popover" hidden>
                                    <p className="export-popover-title">Período da planilha</p>
                                    <select id="summary-export-period">
                                        <option value="today">Hoje</option>
                                        <option value="yesterday">Ontem</option>
                                        <option value="week">Esta semana</option>
                                        <option value="lastweek">Última semana</option>
                                        <option value="month">Este mês</option>
                                        <option value="90d">Últimos 3 meses</option>
                                        <option value="180d">Últimos 6 meses</option>
                                        <option value="custom">Personalizado…</option>
                                    </select>
                                    <div id="summary-export-custom" className="export-popover-dates" hidden>
                                        <label>De<input type="date" id="summary-export-from" /></label>
                                        <label>Até<input type="date" id="summary-export-to" /></label>
                                    </div>
                                    <button className="export-btn" id="summary-export-confirm" type="button" style={{ width: "100%", justifyContent: "center" }}>Baixar planilha</button>
                                </div>
                            </div>
                        </div>
                        <div className="table-scroll" id="summary-table-wrap"></div>
                    </div>

                </div>

                <div id="sla-wrap" hidden>
                    <section className="kpi-grid" id="sla-kpi-grid" aria-label="Indicadores de risco de SLA"></section>
                    <div className="panel">
                        <div className="panel-head">
                            <div>
                                <p className="panel-title">Chamados em risco de estouro (SLA de 30 min)</p>
                                <p className="panel-desc" id="sla-desc">Chamados sem primeira resposta com meta de 30 minutos, ordenados do mais urgente para o menos urgente</p>
                            </div>
                            <div className="panel-head-actions">
                                <button className="export-btn" id="sla-export-btn" type="button">
                                    <svg viewBox="0 0 16 16" fill="none"><path d="M8 1.5v8.5m0 0L4.8 6.8M8 10l3.2-3.2M2.5 12v1.5a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    Exportar Excel
                                </button>
                            </div>
                        </div>
                        <div className="table-scroll" id="sla-table-wrap"></div>
                    </div>
                </div>

                <footer className="notes">
                    <strong>Metodologia:</strong> cada valor de TPA vem do ciclo concluído do SLA “Tempo para primeiro atendimento” do Jira Service Management (campo customfield_10121) no projeto SUPORTE. Chamados sem primeira resposta registrada até a coleta entram como “pendentes” e não contam na média nem na taxa de estouro. A aba “SLA” monitora, em tempo real, os chamados pendentes cuja meta é de 30 minutos. Os dados vêm direto do Jira a cada atualização — clique em “Atualizar” a qualquer momento para buscar os chamados mais recentes.
                </footer>
            </div>

        </div>
        </PageContainer>
    );
}

export default TpaPage;

const PageContainer = styled.div`
    width: 100%;
    min-height: 100%;
    flex-direction: column;
    align-items: center;
    position: absolute;
    // gap: 15px;
    color: rgb(75, 74, 75);
`;
