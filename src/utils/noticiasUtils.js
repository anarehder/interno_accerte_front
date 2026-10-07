export const formatarDataNoticia = (data, mesLongo = false) => {
    if (!data) return "";
    return new Date(data).toLocaleDateString("pt-BR", {
        day: "numeric",
        month: mesLongo ? "long" : "short",
        year: "numeric",
    });
};

export const formatarAutorNoticia = (autor) => {
    if (!autor) return "Accerte";
    return [autor.nome, autor.sobrenome].filter(Boolean).join(" ");
};

// markdown padrão ignora quebra de linha simples (só vira parágrafo novo com linha em branco);
// isso força cada Enter do editor a virar uma quebra visual também
export const preservarQuebrasDeLinha = (texto) => {
    return (texto || "").replace(/([^\n])\n(?!\n)/g, "$1  \n");
};

// espelha o slugify do backend (noticias-service.ts), só pra pré-visualizar no formulário
export const gerarSlugPreview = (texto) => {
    return (texto || "")
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 200)
        .replace(/-+$/g, "");
};
