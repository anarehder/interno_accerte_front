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

// o editor rico sempre deixa pelo menos um <p></p> vazio, então strip de tags
// é necessário pra saber se o usuário realmente digitou algo
export const conteudoHtmlVazio = (html) => {
    return !(html || "").replace(/<[^>]*>/g, "").trim();
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
