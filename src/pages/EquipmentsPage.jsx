import styled from 'styled-components';
import logo from "../assets/LOGO_PNG.png"
import { Link } from 'react-router-dom';
import { SlEarphonesAlt } from "react-icons/sl";
import { SlScreenSmartphone } from "react-icons/sl";
import { PiMouseMiddleClickLight } from "react-icons/pi";
import { FaRegKeyboard } from "react-icons/fa6";
import { PiMonitor } from "react-icons/pi";
import { BsLaptop } from "react-icons/bs";
import { GiLaptop } from "react-icons/gi";
function EquipmentsPage() {

    return (
        <PageContainer>
            <Link to="/portal">
                <Button> Voltar </Button>
            </Link>
            <TitleContainer>
                <img src={logo} alt="Logo"/>
                <div>
                <p>PORTAL ACCERTE</p>
                CONTROLE DE ATIVOS
                </div>
            </TitleContainer>
            <div>José, confira aqui sua lista de ativos:</div>
            <ListContainer>
                <ItemRow>
                    <Icon>
                        <GiLaptop size={50} />
                    </Icon>
                    <ItemDescription>
                        <Type>Notebook</Type>
                        <Serial>Nº de série</Serial>
                    </ItemDescription>
                </ItemRow>
                <ItemRow>
                    <Icon>
                        <PiMonitor size={50} />
                    </Icon>
                    <ItemDescription>
                        <Type>Monitor</Type>
                        <Serial>Nº de série</Serial>
                    </ItemDescription>
                </ItemRow>
                <ItemRow>
                    <Icon>
                        <FaRegKeyboard size={50} />
                    </Icon>
                    <ItemDescription>
                        <Type>Teclado</Type>
                        <Serial>Nº de série</Serial>
                    </ItemDescription>
                </ItemRow>
                <ItemRow>
                    <Icon>
                        <PiMouseMiddleClickLight size={50} />
                    </Icon>
                    <ItemDescription>
                        <Type>Mouse</Type>
                        <Serial>Nº de série</Serial>
                    </ItemDescription>
                </ItemRow>
                <ItemRow>
                    <Icon>
                        <SlEarphonesAlt size={50} />
                    </Icon>
                    <ItemDescription>
                        <Type>Fone de Ouvido</Type>
                        <Serial>Nº de série</Serial>
                    </ItemDescription>
                </ItemRow>
                <ItemRow>
                    <Icon>
                        <SlScreenSmartphone size={50} />
                    </Icon>
                    <ItemDescription>
                        <Type>Celular</Type>
                        <Serial>Nº de série</Serial>
                    </ItemDescription>
                </ItemRow>
            </ListContainer>
        </PageContainer>
    )
}

export default EquipmentsPage;


const PageContainer = styled.div`
    width: 100%;
    height: 100vh;
    flex-direction: column;
    align-items: center;
    gap: 30px;
    font-family: "Lato", serif; 
    a{
        position: absolute;
        left: 2%;
        top: 3%;
    }
    div{
        max-width: 80%;
        font-size: 30px;
    }
`

const TitleContainer = styled.div`
    width: 80%;
    gap: 15px;
    justify-content: center;
    margin: 10px 0;
    align-items: center;
    font-family: "Lato", serif;
    font-weight: 400;
    font-style: normal;
    font-size: 30px;
    div{
        flex-direction: column;
        align-items: center;
        gap: 10px;
    }
    p {
        font-size: 50px;
        font-family: "Dosis", serif;
        word-spacing: 10px;
    }
    img {
        width: 100px;
        position: absolute;
        left: 10%;
    }
}
`

const Button = styled.button`
  width: 100%;
  font-size: 16px;
  justify-content: center;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color:#008AFF;
  color: white;

  &:hover {
    background-color: #345B68;
  }
`;

const ListContainer = styled.div`
    flex-wrap: wrap;
    gap: 2%;
    height: 450px;
    justify-content: center;
    align-items: center;
`

const ItemRow = styled.div`
    width: 40%;
    height: 120px;
    align-items: center;
    border: 0.5px solid #345B68;
    border-radius: 20px;
    padding: 5px 15px;
`
const Icon = styled.div`
    justify-content: center;
    align-items: center;
    border:  2.5mm ridge #345B68;
    border-radius: 50px;
    width: 70px; 
    height: 70px;
    margin-right: 10px;
`

const ItemDescription = styled.div`
    justify-content: center;
    flex-direction: column;
    height: 180px;
    gap: 2px;
`

const Type = styled.div`
    align-items: center;
    align-self: flex-start;
    width: 250%; 
    height: 50px;
    justify-content: space-between;
    border-radius: 0 50px 50px 0;
    border-right: 3px solid #345B68;
    border-bottom: 3px solid #345B68;
    padding: 0 2%; 
`

const Serial = styled.div`
    align-items: center;
    border-radius: 50px 0 0 50px ;
    width: 250%; 
    height: 50px;
    justify-content: flex-end;
    align-self: flex-end;
    padding: 0 2%;
    border-top: 3px solid #345B68;
    border-left: 3px solid #345B68;
`