import axios from "axios";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";

// Dados do Jira (dashboard TPA) — quem fala com o Jira agora é o backend
// (interno_accerte_back_node/src/controllers/jira-controller.ts), no mesmo
// BASE_URL que o apiService.js já usa. Aqui só chama /jira/*, igual aos
// outros services.
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function getTickets() {
    return axios.get(`${BASE_URL}/jira/tickets`);
}

function getStatus() {
    return axios.get(`${BASE_URL}/jira/status`);
}

function triggerRefresh() {
    return axios.post(`${BASE_URL}/jira/refresh`);
}

// Exportação em Excel/PDF continua no navegador (não fala com o Jira, só
// formata dados que já vieram em getTickets) — sem motivo pra depender de
// backend aqui.

// Gera a planilha .xlsx no navegador a partir de um dataset
// {title, filename, columns, rows} já pronto — mesmo formato que os botões
// "Exportar Excel" do dashboard montam.
function exportXlsx(dataset) {
    const columns = Array.isArray(dataset.columns) ? dataset.columns : [];
    const rows = Array.isArray(dataset.rows) ? dataset.rows : [];

    const header = columns.map(function (c) { return c.header || ""; });
    const body = rows.map(function (r) {
        return Array.isArray(r) ? r : columns.map(function (c) { return r[c.key]; });
    });

    const sheet = XLSX.utils.aoa_to_sheet([header, ...body]);
    sheet["!cols"] = columns.map(function (c) { return { wch: c.width || 20 }; });

    const sheetName = String(dataset.title || "Dados").replace(/[\\/*?:[\]]/g, " ").slice(0, 31) || "Dados";
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, sheetName);

    const arrayBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([arrayBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    return Promise.resolve({ data: blob });
}

// Gera um PDF no navegador com jsPDF a partir do mesmo payload que o
// endpoint /api/export/pdf do tpa-dashboard original recebia ({title,
// scopeLabel, generatedAt, kpis, ranking, evolution, compliance}). Layout
// mais simples que o pdfkit original (sem as barrinhas desenhadas à mão),
// mas com os mesmos números.
function exportPdf(payload) {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const marginX = 40;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let y = 40;

    function ensureSpace(needed) {
        if (y + needed > pageHeight - 40) {
            doc.addPage();
            y = 40;
        }
    }

    doc.setFillColor(31, 41, 55);
    doc.rect(0, 0, pageWidth, 64, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text(String(payload.title || "Relatório de Desempenho — TPA"), marginX, 26);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.text(String(payload.scopeLabel || ""), marginX, 42);
    doc.setFontSize(8);
    doc.text("Gerado em " + String(payload.generatedAt || ""), marginX, 55);
    y = 84;

    doc.setTextColor(11, 11, 11);

    if (Array.isArray(payload.kpis) && payload.kpis.length) {
        ensureSpace(50);
        const n = payload.kpis.length;
        const gap = 10;
        const boxW = (pageWidth - marginX * 2 - gap * (n - 1)) / n;
        payload.kpis.forEach(function (k, i) {
            const bx = marginX + i * (boxW + gap);
            doc.setDrawColor(229, 231, 235);
            doc.roundedRect(bx, y, boxW, 50, 3, 3);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(7.5);
            doc.setTextColor(107, 114, 128);
            doc.text(String(k.label || "").toUpperCase(), bx + 8, y + 14, { maxWidth: boxW - 16 });
            doc.setFont("helvetica", "bold");
            doc.setFontSize(13);
            doc.setTextColor(11, 11, 11);
            doc.text(String(k.value || ""), bx + 8, y + 30, { maxWidth: boxW - 16 });
            if (k.sub) {
                doc.setFont("helvetica", "normal");
                doc.setFontSize(7);
                doc.setTextColor(107, 114, 128);
                doc.text(String(k.sub), bx + 8, y + 42, { maxWidth: boxW - 16 });
            }
        });
        y += 66;
        doc.setTextColor(11, 11, 11);
    }

    function table(title, columns, rows) {
        if (!columns || !rows || !rows.length) return;
        ensureSpace(30);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text(title, marginX, y);
        y += 16;

        const contentW = pageWidth - marginX * 2;
        const colW = contentW / columns.length;

        ensureSpace(20);
        doc.setFillColor(31, 41, 55);
        doc.rect(marginX, y, contentW, 20, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(255, 255, 255);
        columns.forEach(function (c, i) {
            doc.text(String(c.header || ""), marginX + i * colW + 6, y + 13.5);
        });
        y += 20;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        rows.forEach(function (row, ri) {
            ensureSpace(18);
            if (ri % 2 === 1) {
                doc.setFillColor(249, 250, 251);
                doc.rect(marginX, y, contentW, 18, "F");
            }
            doc.setTextColor(11, 11, 11);
            row.forEach(function (val, ci) {
                doc.text(String(val == null ? "—" : val), marginX + ci * colW + 6, y + 12.5, { maxWidth: colW - 12 });
            });
            doc.setDrawColor(229, 231, 235);
            doc.line(marginX, y + 18, marginX + contentW, y + 18);
            y += 18;
        });
        y += 14;
    }

    if (payload.ranking && Array.isArray(payload.ranking.rows) && payload.ranking.rows.length) {
        table("Ranking por analista", payload.ranking.columns, payload.ranking.rows);
    }

    function summaryBox(text, tone) {
        if (!text) return;
        ensureSpace(30);
        const bg = tone === "good" ? [231, 247, 231] : tone === "bad" ? [251, 234, 234] : [243, 244, 246];
        const fg = tone === "good" ? [12, 163, 12] : tone === "bad" ? [208, 59, 59] : [107, 114, 128];
        doc.setFillColor(bg[0], bg[1], bg[2]);
        const contentW = pageWidth - marginX * 2;
        const lines = doc.splitTextToSize(text, contentW - 20);
        const boxH = lines.length * 12 + 16;
        doc.roundedRect(marginX, y, contentW, boxH, 3, 3, "F");
        doc.setTextColor(fg[0], fg[1], fg[2]);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.text(lines, marginX + 10, y + 14);
        doc.setTextColor(11, 11, 11);
        y += boxH + 16;
    }

    if (payload.evolution && Array.isArray(payload.evolution.points) && payload.evolution.points.length) {
        ensureSpace(20);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text(payload.evolution.title || "Evolução do TPA (últimos 6 meses)", marginX, y);
        y += 16;
        table("", [{ header: "Mês" }, { header: "TPA médio (min)" }],
            payload.evolution.points.map(function (p) { return [p.label, p.value == null ? "—" : Math.round(p.value * 10) / 10]; }));
        summaryBox(payload.evolution.summary, payload.evolution.trend);
    }

    if (payload.compliance && Array.isArray(payload.compliance.points) && payload.compliance.points.length) {
        ensureSpace(20);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text(payload.compliance.title || "Cumprimento da Meta (últimos 6 meses)", marginX, y);
        y += 16;
        table("", [{ header: "Mês" }, { header: "Cumprimento" }],
            payload.compliance.points.map(function (p) { return [p.label, p.value == null ? "—" : (Math.round(p.value * 10) / 10) + "%"]; }));
        summaryBox(payload.compliance.summary, payload.compliance.trend);
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(107, 114, 128);
    doc.text(
        "TPA = tempo até a primeira resposta (SLA do Jira Service Management, projeto " + String(payload.projectKey || "SUPORTE") + ").",
        marginX,
        pageHeight - 24
    );

    const blob = doc.output("blob");
    return Promise.resolve({ data: blob });
}

const apiServiceJira = { getTickets, getStatus, triggerRefresh, exportXlsx, exportPdf };

export default apiServiceJira;
