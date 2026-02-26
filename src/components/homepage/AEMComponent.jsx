import styled from 'styled-components';
import { useEffect, useState } from 'react';
import AEMLogo from '../../assets/AEM-logo-compacta.png';
import { useAuth } from '../../contexts/AuthContext';

function AEMComponent() {
    const { dados } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true); 
    useEffect(() => {
        // Função para buscar posts
        const fetchPosts = async () => {
            const images = dados?.aem3?.length > 0 ? dados.aem3 : null;
            if (images) {
                setPosts(images); // Usa os dados salvos
                setLoading(false);
                return;
            }
        };

        fetchPosts();
    }, [dados]);

    return (
        <PageContainer>
            <LinkedinContainer>
                <Title>
                        <img src={AEMLogo} alt="Logo AEM" /> <span>Bem-estar em foco. </span> Fique por dentro.
                </Title>
                {loading && <div> <br />Carregando imagens... </div>}
                {!loading && posts.length === 0 && <div> <br /> Falha ao carregar os posts... </div>}
                {posts.length > 0 &&
                    <PostsContainer>
                        <div className="carousel" >
                            {posts.map((p, index) => (
                                <div className="card" key={index} >
                                    <a href={p.url} target="_blank">
                                        <img src={p.url} alt={p.name} />
                                    </a>
                                </div>
                            ))}
                            {posts.length < 5 &&
                                <div className="card" >
                                    <p> ... </p>
                                </div>
                            }
                        </div>
                        
                    </PostsContainer>
                }
            </LinkedinContainer>
        </PageContainer>
    )
}

export default AEMComponent;

const PageContainer = styled.div`
    width:90%;
    color: #555;
    flex-direction: column;
    justify-content: flex-start;
    margin-bottom: 50px;
`


const LinkedinContainer = styled.div`
    margin-top: 15px;
    flex-direction: column;
`;

const Title = styled.div`
    background: linear-gradient(to right,#1A4CAF, #0B2049);
    background: linear-gradient(to right,#205fdd, #001143);
    border-radius: 8px;
    box-shadow: 0px 4px 4px 0px #00000040;
    height: 60px;
    color: white;
    align-items: center;
    margin: 0 auto;
    color: white;font-family: Poppins;
    
    font-size: 25px;
    line-height: 14px;
    letter-spacing: 0%;
    text-align: center;
    span{
        font-weight: 600;
        padding-right: 10px;
    }
    img {
        height: 50px;;
        object-fit: contain;
        padding: 0 10px;
        margin-right: 10px;
        border-right: 1px solid white;
    }

    svg {
        margin: 0 10px;
        padding-right: 10px;
        border-right: 1px solid white;
    }
`

const FalhaContainer = styled.div`
    height: 100px;
    font-weight: 500;
    font-size: 18px;
    margin-top: 15px;
`

const PostsContainer = styled.div`
    margin-top: 15px;
    .carousel {
        display: flex;
        gap: 25px;
        overflow-x: auto; /* Ativa o scroll horizontal */
        overflow-y: hidden; /* Evita scroll vertical */
        height: 390px;
        align-items: center;
    }
        /* Para navegadores baseados em WebKit (Chrome, Safari, Edge) */
    .carousel::-webkit-scrollbar {
        height: 6px; /* Altura da barra de rolagem */
    }

    .carousel::-webkit-scrollbar-track {
        background: transparent; /* Fundo da barra */
    }

    .carousel::-webkit-scrollbar-thumb {
        background: #082764; /* Cor da barra de rolagem */
        border-radius: 10px; /* Bordas arredondadas */
    }

    .carousel::-webkit-scrollbar-thumb:hover {
        background: darkgray; /* Cor ao passar o mouse */
    }

  .card {
    flex: 0 0 350px;
    background: white;
    border-radius: 35px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease-in-out;
    width: 350px;
    height: 350px;
    position: relative;
    display: inline-block;
    .card .link-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1; /* Garante que o link fique sobre a imagem */
        opacity: 0; /* Torna o link invisível */
        background-color: rgba(0, 0, 0, 0); /* Transparente, mas garante que o link será clicável */
    }
    p{
        font-size: 40px;
        line-height: 350px;
    }

    &:hover {
      transform: scale(1.05);
      border-radius: 35px;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center; 
    }

    .content {
      padding: 15px;
      text-align: center;
      
      h3 {
        font-size: 18px;
        color: #222;
        margin-bottom: 10px;
      }

      p {
        font-size: 14px;
        color: #555;
      }
    }
`