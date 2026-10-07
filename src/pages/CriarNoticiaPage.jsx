import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import HeaderNewComponent from "../components/basic/HeaderNewComponent";
import NoticiaFormComponent from "../components/noticias/NoticiaFormComponent";
import apiService from "../services/apiService";

function CriarNoticiaPage() {
    const navigate = useNavigate();

    const handleCriar = async (noticia) => {
        await apiService.criarNoticia({ noticia });
        alert("Notícia criada com sucesso!");
        navigate("/gerenciarnoticias");
    };

    return (
        <PageContainer>
            <HeaderNewComponent pageTitle={"Criar Notícia"} returnTo="/painelmarketing" />
            <NoticiaFormComponent
                onSubmit={handleCriar}
                textoBotao="Criar Notícia"
                onCancelar={() => navigate("/painelmarketing")}
            />
        </PageContainer>
    )
}

export default CriarNoticiaPage;

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
