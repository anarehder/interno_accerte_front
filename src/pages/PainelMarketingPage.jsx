import styled from "styled-components";
import { Link } from "react-router-dom";
import { FaCloudUploadAlt, FaFolderOpen, FaBullhorn, FaListUl } from "react-icons/fa";
import HeaderNewComponent from "../components/basic/HeaderNewComponent";

function PainelMarketingPage() {
    return (
        <PageContainer>
            <HeaderNewComponent pageTitle={"Painel Marketing"} />
            <ButtonContainer>
                <Link to="/criararquivocloud">
                    <NewButton>
                        <FaCloudUploadAlt size={90} />
                        <p>Criar <br /> <span>Arquivo Cloud</span></p>
                    </NewButton>
                </Link>

                <Link to="/arquivoscloud">
                    <NewButton>
                        <FaFolderOpen size={90} />
                        <p>Listar <br /> <span>Arquivos Cloud</span></p>
                    </NewButton>
                </Link>

                <Link to="/criarcomunicado">
                    <NewButton>
                        <FaBullhorn size={90} />
                        <p>Criar <br /> <span>Comunicado</span></p>
                    </NewButton>
                </Link>

                <Link to="/listacomunicados">
                    <NewButton>
                        <FaListUl size={90} />
                        <p>Listar <br /> <span>Comunicados</span></p>
                    </NewButton>
                </Link>
            </ButtonContainer>
        </PageContainer>
    );
}

export default PainelMarketingPage;

const PageContainer = styled.div`
    width: 100%;
    min-height: 100%;
    flex-direction: column;
    align-items: center;
    position: absolute;
    gap: 20px;
    color: rgb(75, 74, 75);
`;

const ButtonContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 220px);
    justify-content: center;
    gap: 30px;
    margin-top: 20px;
`;

const NewButton = styled.button`
    flex-direction: column;
    justify-content: center;
    width: 220px;
    height: 220px;
    gap: 20px;
    border-radius: 28px;
    color: #003289;
    border: 1px solid #acaaaaff;
    box-shadow: 0px 4px 4px 4px #00000040;
    background: linear-gradient(94.61deg, #FFFFFF 3.73%, #E1E1E1 133.27%);
    font-family: Poppins;
    font-weight: 400;
    font-size: 23px;
    text-align: center;

    p{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 80px;
        font-size: 23px;
    }
    span{
        font-weight: 700;
        font-style: Bold;
    }
    svg{
        height: 90px;
    }
    &:hover {
        cursor: pointer;
        background: linear-gradient(94.61deg, #205fdd 3.73%, #001143 133.27%);
        color: white;
    }
`;
