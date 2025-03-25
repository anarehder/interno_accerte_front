import styled from 'styled-components';
import backgroundImage from "../assets/FUNDO_1.jpg"; // Importação da imagem
import backgroundCard from "../assets/FUNDO_ESCADA.jpg"
import { TbCertificate } from "react-icons/tb";
import { PiAirplaneTiltBold, PiSignature } from "react-icons/pi";
import { FaComputer } from "react-icons/fa6";
import { Link } from 'react-router-dom';

function UserPortalPage() {

    return (
        <PageContainer>
            <TitleContainer>
                BEM-VINDO AO SEU 
                <div>
                PORTAL ACCERTE
                </div>
            </TitleContainer>
            <CardsContainer>
                <Card>
                    <TbCertificate size={60} />
                    <div>CERTIFICAÇÕES</div>
                    <Link to="/certificacoes"><button>SABER MAIS</button></Link>
                </Card>
                {/* <Card>
                    <PiAirplaneTiltBold size={60} />
                    <div>FÉRIAS</div>
                    <Link to="/ferias"><button> SABER MAIS</button></Link>
                </Card> */}
                <Card>
                    <FaComputer size={60} />
                    <div>EQUIPAMENTOS</div>
                    <Link to="/equipamentos"><button> SABER MAIS</button></Link>
                </Card>
                <Card>
                    <PiSignature size={60} />
                    <div>
                        <div>
                            ASSINATURA
                        </div>
                        <div>
                            DE E-MAIL
                        </div>
                    </div>
                    <Link to="/assinatura"><button>SABER MAIS</button></Link>
                </Card>
            </CardsContainer>
        </PageContainer>
    )
}

export default UserPortalPage;


const PageContainer = styled.div`
    width: 100%;
    height: 100vh;
    position: relative;
    flex-direction: column;
    background-image: url(${backgroundImage});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    align-items: center;
    gap: 50px;
    background-color: rgba(0, 0, 0, 0.2);
`

const TitleContainer = styled.div`
    width: 100%;
    gap: 15px;
    background-color: rgba(0, 0, 0, 0.4);
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 25vh;
    color: white;
    font-family: "Lato", serif;
    font-weight: 400;
    font-style: normal;
    font-size: 50px;
    div {
        font-size: 80px;
        justify-content: center;
        font-family: "Dosis", serif;
        word-spacing: 20px;
    }
}
`

const CardsContainer = styled.div`
    display: flex;
    width: 80vw;
    justify-content: center;
    gap: 4%;
    padding: 40px;
`;

const Card = styled.div`
    width: 15%;
    height: 300px;
    color: white;
    border-radius: 15px;
    box-shadow: 
        10px 10px 20px rgba(0, 0, 0, 0.6),
        -10px -10px 20px rgba(50, 47, 47, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease-in-out;
    background-image: 
        linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 15%, rgba(0, 0, 0, 0.5) 40%), 
        url(${backgroundCard});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    align-items: center;

    &:hover {
        box-shadow: 
            15px 15px 25px rgba(0, 0, 0, 0.2),
            -15px -15px 25px rgba(255, 255, 255, 0.2);
        transform: translateY(-5px);
    }

    div{
        font-family: "Marcellus", serif;
        font-size: 24px;
        word-break: break-word;
        font-weight: 600;
        height: 50px;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        text-align: center;
        border-radius: 15px;
        gap: 10px;
    }

    button {
        font-family: "Lato", serif;
        fof-size:15px;
        background-color: #000002;
    }
`;