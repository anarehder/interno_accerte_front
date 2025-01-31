import { Link } from "react-router-dom";
import ImagemInicial from '../assets/imagem-pag1.jpg';
import { GoArrowRight } from "react-icons/go";
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";
// import { useContext, useEffect } from "react";
// import { UserContext } from "../contexts/UserContext";

function HomePage() {
    const navigate = useNavigate();
    // const [,setUser] = useContext(UserContext);
    
    // useEffect(() => {
    //     const storedUser = JSON.parse(localStorage.getItem('user'));
    //     if (storedUser) {
    //         setUser(storedUser);
    //         navigate("/contracts")
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [navigate]);

    return (
        <PageContainer>
            <Link to={'/login'} >
                <button>
                    <p>Acessar</p>
                    <GoArrowRight size={24} />
                </button>
            </Link>
        </PageContainer>
    )
}

export default HomePage;

const PageContainer = styled.div`
    width: 100%;
    height: 100vh;
    position: relative;
    background: url(${ImagemInicial}) center/cover no-repeat;
    button {
        position: absolute;
        width: 12%; 
        top: 82%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 16px;
        display: flex;
        padding: 10px 15px;
        justify-content: space-between;
    }
`