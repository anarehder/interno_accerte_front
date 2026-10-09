import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import HeaderNewComponent from "../../components/basic/HeaderNewComponent";
import NoticiaFormComponent from "../../components/noticias/NoticiaFormComponent";
import apiService from "../../services/apiService";

const paraInputDate = (data) => {
    if (!data) return "";
    // usa os componentes locais da data, não o UTC (toISOString), senão quem
    // está num fuso negativo (ex: Brasil) vê o dia seguinte ao real
    const d = new Date(data);
    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const dia = String(d.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
};

function noticiaParaValoresIniciais(noticia) {
    return {
        titulo: noticia.titulo ?? "",
        resumo: noticia.resumo ?? "",
        conteudo: noticia.conteudo ?? "",
        categoriaId: noticia.categoriaId != null ? String(noticia.categoriaId) : "",
        imagemCapaUrl: noticia.imagemCapaUrl ?? "",
        status: noticia.status ?? "RASCUNHO",
        destaque: !!noticia.destaque,
        areaId: noticia.areaId != null ? String(noticia.areaId) : "",
        publicadoEm: paraInputDate(noticia.publicadoEm),
        expiraEm: paraInputDate(noticia.expiraEm),
        tags: (noticia.tags || []).map((t) => t.nome).join(", "),
        autorId: noticia.autorId != null
            ? String(noticia.autorId)
            : String(noticia.Autor?.id ?? noticia.autor?.id ?? ""),
    };
}

function EditarNoticiaPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const noticiaId = Number(searchParams.get("noticiaId"));

    const [carregando, setCarregando] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [valoresIniciais, setValoresIniciais] = useState(null);
    const [slugAtual, setSlugAtual] = useState("");

    useEffect(() => {
        if (!noticiaId) {
            setErrorMessage("Notícia não informada.");
            setCarregando(false);
            return;
        }
        let ignorar = false;
        const fetchNoticia = async () => {
            try {
                const response = await apiService.getNoticiaGerenciarPorId(noticiaId);
                if (ignorar) return;
                setValoresIniciais(noticiaParaValoresIniciais(response.data));
                setSlugAtual(response.data.slug ?? "");
            } catch (error) {
                if (ignorar) return;
                console.error("Erro ao buscar notícia:", error);
                setErrorMessage("Erro ao carregar os dados da notícia.");
            } finally {
                if (!ignorar) setCarregando(false);
            }
        };
        fetchNoticia();
        return () => { ignorar = true; };
    }, [noticiaId]);

    const handleEditar = async (noticia) => {
        await apiService.editarNoticia(noticiaId, { noticia });
        alert("Notícia atualizada com sucesso!");
        navigate("/gerenciarnoticias");
    };

    return (
        <PageContainer>
            <HeaderNewComponent pageTitle={"Editar Notícia"} returnTo="/gerenciarnoticias" />

            {carregando && <EstadoContainer>Carregando notícia...</EstadoContainer>}
            {!carregando && errorMessage && <EstadoContainer>{errorMessage}</EstadoContainer>}

            {!carregando && !errorMessage && valoresIniciais &&
                <NoticiaFormComponent
                    valoresIniciais={valoresIniciais}
                    slugAtual={slugAtual}
                    onSubmit={handleEditar}
                    textoBotao="Salvar Alterações"
                    onCancelar={() => navigate("/gerenciarnoticias")}
                />
            }
        </PageContainer>
    )
}

export default EditarNoticiaPage;

const PageContainer = styled.div`
    width: 100%;
    min-height: 100%;
    flex-direction: column;
    align-items: center;
    position: absolute;
    gap: 20px;
    padding-bottom: 40px;
    background: #f1efe9;
    color: rgb(75, 74, 75);
`

const EstadoContainer = styled.div`
    width: 90%;
    max-width: 850px;
    min-height: 40vh;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-weight: 500;
    font-size: 18px;
    color: #6b7280;
`
