import styled from 'styled-components';
import axios from "axios";
import { IoIosArrowDropright } from "react-icons/io";
import { FaInstagram } from "react-icons/fa";
import { useEffect, useState } from 'react';
import apiService from '../services/apiService';

function LinkedinPostsComponent() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true); 
    // console.log(posts);
    useEffect(() => {
        // Função para buscar posts
        const fetchPosts = async () => {
            try {
                const response = await apiService.getPosts();
                setPosts(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Erro ao buscar os posts:", error);
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <PageContainer>
            <InstagramContainer>
                <h2>
                    <FaInstagram size={24} /> Acompanhe nas redes sociais...
                </h2>
                {loading && <div> <br/>Carregando posts... </div>}
                <div className="carousel" >
                    {posts.length > 0 &&
                        posts.map((p, index) => (
                            <div className="card" key={index} >
                                <a href={p.link} target="_blank">
                                    <img src={p.image} alt={"Post do Linkedin"} />
                                </a>
                            </div>
                        ))}
                </div>
                {/* <IoIosArrowDropright size={54}/> */}
            </InstagramContainer>
        </PageContainer>
    )
}

export default LinkedinPostsComponent;

const PageContainer = styled.div`
    width: 100%;
    position: relative;
    justify-content: center;
`


const InstagramContainer = styled.div`
    font-family: 'Conthrax', sans-serif;
    padding: 20px;
    width: 90%;
    flex-direction: column;
    h2 {
        display: flex;
        align-items: center;
        font-size: 24px;
        margin-bottom: 20px;
        svg {
            margin-right: 10px;
        }
    }

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
        background: gray; /* Cor da barra de rolagem */
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
  }
`;