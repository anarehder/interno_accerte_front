import styled from 'styled-components';
import Background from "../../assets/basic/component-background-blue.png"
import Logo from "../../assets/basic/logo-completa-branca.png";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";
import { TfiEmail } from "react-icons/tfi";

function FooterComponent() {

    return (
        <PageContainer>
            <FooterContainer>
                <div className="left">
                    Accerte Tecnologia
                    <a href="https://www.accerte.com.br" target="_blank">
                        www.accerte.com.br
                    </a>
                    <div className="icons">
                        <a href="https://www.instagram.com/accertetecnologia/" target="_blank">
                            <FaInstagram size={30} color="#FFFFFF" />
                        </a>
                        <a href="https://www.linkedin.com/company/accerte-tecnologia/posts/?feedView=all" target="_blank">
                            <FaLinkedin size={30} color="#FFFFFF" />
                        </a>
                        <a href="https://wa.me/556239459510?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20os%20servi%C3%A7os%20de%20..." target="_blank">
                            <FaWhatsapp size={30} color="#FFFFFF" />
                        </a>
                        <a href="mailto:comercial@accerte.com.br?subject=Gostaria%20de%20saber%20mais%20sobre%20os%20servi%C3%A7os&body=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20os%20servi%C3%A7os%20de%20...">
                            <TfiEmail  size={30} color="#FFFFFF" />
                        </a>
                    </div>

                </div>
                <div className="middle">
                    <img src={Logo} alt="ACCERTE" />
                </div>
                <div className="right">
                <h1>R. 128-A, nº 34, Qd. F29 Lt. 11 
                <br/>  St. Sul -  74093-110
                    <br/> <span>Goiânia | GO </span> </h1>
                </div>
            </FooterContainer>
        </PageContainer>
    )
}

export default FooterComponent;

const PageContainer = styled.div`
    width: 100%;
    position: relative;
    justify-content: center;  
    font-family: "Poppins", serif;
`

const FooterContainer = styled.div`
    background: url(${Background}) no-repeat center;
    background-size: cover;
    background-size: 120%;
    gap: 50px;
    height: 140px;
    justify-content: center;
    align-items: center;
    padding: 15px 0;
    line-height: 20px;
    color: white;
    .left{
        width: 35%;
        padding-left: 5%;
        flex-direction: column;
        text-align: center;
        gap: 10px;
        .icons{
            justify-content: center;
            gap: 15px;
        }
    }
    .middle{
        align-items: center;
        justify-content: center;
        border-left: 2px solid white;
        border-right: 2px solid white;
        img{
            width: 30%;
        }
    }

    .right{
        width: 35%;
        text-align: center;
        padding-right: 5%;
        h1{
            line-height: 28px;
            font-size: 17px;
        }
    }
`