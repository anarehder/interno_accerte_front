import styled from 'styled-components';
import { useEffect, useState } from "react";
import apiService from '../../services/apiService';
import { useAuth } from '../../contexts/AuthContext';
import Comunicado from '../../assets/teste-comunicado.jpeg';

function ComunicadoPopUpComponent({setUpdated}) {
    const { user, carregando } = useAuth();
    const [closed, setClosed] = useState(false);
    const [comunicado, setComunicado] = useState({texto: "teste"});
    // const texto = `🧑🏻‍🌾Ô trem bão, sô! Vem aí o Arraiá da Accerte!👩🏻‍🌾 Eita que esse ano o nosso Arraiá vai sê danado de bão! Vai tê muita alegria, quitute gostoso, música pra arrastá o pé e aquele clima bão de festa junina que só a turma da Accerte sabe fazer! Agora escuta bem: capricha no traje, uai! Os homi: pega aquele chapéu de palha, pinta o dente, ajeita a camisa xadrez e as muié: tira a saia do armário, separa as bota e a maria chiquinha e vamo mode ficar bem caipirado mermo! Vai tê premiação pros cabra e as muié mais caracterizado da festa! Num vai moscá, não! Vem proseá, dançá, cumê e se divertê com a gente! Vem pro Arraiá da Accerte, sô! Vai sê bão demais da conta!`;
    const texto = null;
    useEffect(() => {
        setComunicado({texto: "teste"});
        // const fetchScale = async () => {
        //     try {
        //         const body = {email: user.email};
        //         const response = await apiService.buscarComunicadosHoje(body);
        //         setComunicado(response.data);
        //     } catch (error) {
        //         console.error("Erro ao buscar informacoes vagas:", error);
        //         return;
        //     }
        // };

        // fetchScale();

    }, [carregando, user]);

    const fecharPopup = () => {
        setClosed(true);
    };

    const leituraPopup = async () => {
        try {
            const body = { email: user.email, comunicadoId: comunicado.id };
            const response = await apiService.confirmarLeituraComunicado(body);
            setUpdated(true);
            setClosed(true);
        } catch (error) {
            console.error("Erro ao buscar informacoes vagas:", error);
            return;
        }
    };

    if (closed) return null;

    return (
        <Overlay>
            <CloseButton onClick={fecharPopup}>✖</CloseButton>
            <Modal>
                <h1>Arraiá da Accerte</h1>
                <div>
                    <Imagem
                        src={Comunicado}
                        alt={"Mensagem"}
                    />
                    {comunicado?.texto && <Texto>{comunicado.texto}</Texto>}
                </div>

                <button onClick={leituraPopup}>Confirmar Leitura</button>
            </Modal>
        </Overlay>
    )
}

export default ComunicadoPopUpComponent;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9;
`;

const Modal = styled.div`
  background-color: white;
  position: relative;
  width: 60%;
  height: 85%;
  padding: 20px;
  border-radius: 12px;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  color: #001143;
  div{
    height: 85%;
    text-align: center;
    align-items: center;
    gap: 7%;
    justify-content: center;
  }
  button{
    background: linear-gradient(to right,#205fdd, #001143);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 8%;
  right: 21%;
  background: transparent;
  font-size: 20px;
  padding: 10px;
  cursor: pointer;
  color: #001143;
  border: 2px solid #001143;;
  z-index: 10;
  &:hover {
    cursor: pointer;
    background:  #001143;
    color: white;
    }
`;

const Imagem = styled.img`
  width: 40%;
  border-radius: 10px;
`;


const Texto = styled.div`
  width: 40%;
  border-radius: 10px;
  overflow-y: auto;
  line-height: 25px;
  padding: 10px;
  border: 1px solid gray;
`;
