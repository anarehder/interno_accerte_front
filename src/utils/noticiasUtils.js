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
