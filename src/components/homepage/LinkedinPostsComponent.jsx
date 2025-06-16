import styled from 'styled-components';
import axios from "axios";
import { IoIosArrowDropright } from "react-icons/io";
import { FaLinkedin } from "react-icons/fa";
import { useEffect, useState } from 'react';
import apiService from '../../services/apiService';

function LinkedinPostsComponent() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState("");

    // console.log(posts);
    useEffect(() => {
        // Função para buscar posts
        const fetchPosts = async () => {
            const cachedPosts = sessionStorage.getItem("posts");

            if (cachedPosts) {
                setPosts(JSON.parse(cachedPosts)); // Usa os dados salvos
                setLoading(false);
                return;
            }
            try {
                const response = await apiService.getPosts();
                setPosts(response.data);
                setLoading(false);
                sessionStorage.setItem("posts", JSON.stringify(response.data));
            } catch (error) {
                console.error("Erro ao buscar os posts:", error);
                setLoading(false);
                setError("Erro ao buscar os posts");
            }
        };

        fetchPosts();
    }, []);

    return (
        <PageContainer>
            <LinkedinContainer>
                <Title>
                        <FaLinkedin size={27}/> O que está rolando nas redes sociais
                </Title>
                
                {loading && <div> <br />Carregando posts... </div>}
                {error && <div> <br />{error} </div>}
                {!loading && posts.length === 0 && <FalhaContainer> <br />Falha ao carregar os posts... </FalhaContainer>}
                {posts.length > 0 &&
                    <PostsContainer>
                        <div className="carousel" >
                            {posts.map((p, index) => (
                                <div className="card" key={index} >
                                    <a href={p.link} target="_blank">
                                        <img src={p.image} alt={"Post do Linkedin"} />
                                    </a>
                                </div>
                            ))}
                        </div>
                    </PostsContainer>
                }
            </LinkedinContainer>
        </PageContainer>
    )
}

export default LinkedinPostsComponent;

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
    border-radius: 8px;
    box-shadow: 0px 4px 4px 0px #00000040;
    height: 60px;
    color: white;
    align-items: center;
    margin: 0 auto;
    color: white;font-family: Poppins;
    font-weight: 600;
    font-size: 25px;
    line-height: 14px;
    letter-spacing: 0%;
    text-align: center;

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
        height: 350px;
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
    flex: 0 0 260px;
    background: white;
    border-radius: 35px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease-in-out;
    width: 260px;
    height: 320px;
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