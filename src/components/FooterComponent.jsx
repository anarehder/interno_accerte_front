import styled from 'styled-components';
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import Logo from "../assets/LOGO-INTRANET-BRANCO.png";

function FooterComponent() {

    return (
        <PageContainer>
            <FooterContainer>
                <div className="left">
                    Accerte Tecnologia
                    www.accerte.com.br
                    <div className="icons">
                        <a href="https://www.instagram.com/accertetecnologia/">
                            <FaInstagram size={30} color="#E4405F" />
                        </a>
                        <a href="https://www.linkedin.com/company/accerte-tecnologia/posts/?feedView=all">
                            <FaLinkedin size={30} color="#0077B5" />
                        </a>
                        <a href="https://wa.me/556239459510?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20os%20servi%C3%A7os%20de%20..." target="_blank">
                            <FaWhatsapp size={30} color="#25D366" />
                        </a>
                        <a href="mailto:comercial@accerte.com.br?subject=Gostaria%20de%20saber%20mais%20sobre%20os%20servi%C3%A7os&body=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20os%20servi%C3%A7os%20de%20...">
                            <FcGoogle size={30} />
                        </a>
                    </div>

                </div>
                <div className="middle">
                    <img src={Logo} alt="ACCERTE" />
                </div>
                <div className="right">
                    R. 128-A, Qd Nº 34 Qd 11
                    St. Sul, Goiânia - GO
                    74093-110
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
`

const FooterContainer = styled.div`
    background-color: #a8a8a8;
    gap: 50px;
    justify-content: center;
    align-items: center;
    padding: 15px 0;
    line-height: 20px;
    color: white;
    .left{
        width: 500px;
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
        img{
            width: 40%;
        }
    }

    .right{
        width: 500px;
        text-align: center;
        padding-right: 5%;
    }
`