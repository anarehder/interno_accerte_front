import { useState, useContext } from "react";
import styled from 'styled-components';
import logo from '../assets/logo.svg';
import { GoArrowRight } from "react-icons/go";
import { PiUserCircleBold } from "react-icons/pi";
import { RiLockPasswordLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
// import { UserContext } from "../contexts/UserContext";
// import apiService from "../services/apiService";

function LoginPage(){
    const [form, setForm] = useState({ username: "", password: "" });
    // const [user, setUser] = useContext(UserContext);
    const navigate = useNavigate();
    
    const handleForm = (e) => {
        e.preventDefault();
        setForm((prevForm) => ({ ...prevForm, [e.target.id]: e.target.value }));
    };

    async function handleSubmit(e) {
        e.preventDefault();
        if (!form.username || !form.password) return alert("Todos os campos devem ser preenchidos");
        setForm({ username: '', password: '' });
        navigate("/portal");
        // try {
        //     const response = await apiService.login(form);
        //     if (response.status === 200) {
        //         const { userId, username, isAdmin, client, token } = response.data;
        //         const userData = {
        //             userId,
        //             username,
        //             isAdmin,
        //             client,
        //             token: `Bearer ${token}`
        //         };
        //         localStorage.setItem("user", JSON.stringify({userId, username, isAdmin, client, token: `Bearer ${token}`}));
        //         // setUser(userData);
        //         navigate("/portal");
        //     }
        // } catch (error) {
        //     if (error.response.status === 401 || error.response.status === 400 ) alert("Dados incorretos, tente novamente");
        // } finally {
        //     setForm({ username: '', password: '' });
        // }
    };

    return (
        <PageContainer onSubmit={handleSubmit}>
            <Header>
                <h1>LOGIN</h1>
                <img src={logo} alt={"logo"} />
            </Header>
            <FormContainer>
                <SearchBarForm>
                    <PiUserCircleBold size={30} />
                    <input
                        placeholder='Usuário'
                        type="text"
                        id="username"
                        autoComplete="username"
                        value={form.username}
                        onChange={handleForm}
                    />
                </SearchBarForm>
                <SearchBarForm>
                    <RiLockPasswordLine size={30} />
                    <input
                        placeholder='Senha'
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={form.password}
                        onChange={handleForm}
                    />
                </SearchBarForm>
                <button type="submit">
                    <p>Entrar</p>
                    <GoArrowRight size={24} />
                </button>
            </FormContainer>
        </PageContainer>
    )
}

export default LoginPage;

const PageContainer = styled.div`
    width: 100%;
    height: 100vh;
    flex-direction: column;
    align-items: center;
    gap: 25px;
`

const Header = styled.div`
    margin-top: 3%;
    height: 180px;
    width: 70%;
    border-bottom: 2px solid #E6E6E6;
    padding: 10px 25px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    text-align: center;
    h1{
        font-size: 50px;
        font-weigth: 400;
    }
    img {
        width: 100px;
    }
    @media (max-width: 500px) {
        flex-wrap: wrap;
        justify-content: center;
        img {
            width: 0;
        }
    }
`

const FormContainer = styled.form`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 25px;
    margin: 3% 15%;
    input {
        width: 100%;
    }
    button {
        padding: 10px 15px;
        justify-content: space-between;
        width: 270px;
    }
`

const SearchBarForm = styled.div`
    justify-content: flex-start;    
    background-color: #F0F5F9;
    color:#021121;
    border: 0.5px solid #E6E6E6;
    border-radius: 16px;
    display: flex;
    align-items: center;
    padding: 10px;
    width: 725px;
    gap: 15px;
`