import styled from 'styled-components';
import { useEffect, useState } from "react";
import apiService from '../../services/apiService';
import { useAuth } from '../../contexts/AuthContext';

function ComunicadoPopUpComponent({setUpdated}) {
    const { user, carregando } = useAuth();
    const [closed, setClosed] = useState(false);
    const [comunicado, setComunicado] = useState(null);
    const [leitura, setLeitura] = useState(false);
    const [buscando, setBuscando] = useState(true);
  // console.log(comunicado)
    useEffect(() => {
        const fetchScale = async () => {
            try {
                const body = {email: user.mail};
                const response = await apiService.buscarComunicadosHoje(body);
                setComunicado(response.data[0]);
                setBuscando(false);
                if(response.data[0].LeituraComunicados[0].confLeitura === true){
                    setLeitura(true);
                }
            } catch (error) {
                console.error("Erro ao buscar informacoes vagas:", error);
                setBuscando(false);
                return;
            }
        };

        fetchScale();

    }, [carregando, user]);

    const fecharPopup = () => {
        setClosed(true);
    };

    const leituraPopup = async () => {
        try {
            const body = { email: user.mail, comunicadoId: comunicado.id };
      const response = await apiService.confirmarLeituraComunicado(body);
      if (response.status = 200) {
        setClosed(true);
        setUpdated(true);
      }
    } catch (error) {
      console.error("Erro ao buscar informacoes vagas:", error);
      return;
    }
  };

  if (closed || leitura) return null;
  if (buscando) return null;

  return (
    <Overlay>
      <CloseButton onClick={fecharPopup}>✖</CloseButton>
      <Modal>
        <h1>{comunicado?.titulo}</h1>
        {comunicado?.legenda || comunicado?.legenda?.length > 2 ?
        <TextoImagem>
            <a href={comunicado?.linkExterno ? comunicado.linkExterno : '-'} target="_blank">
            <Imagem
              src={comunicado?.imagemUrl}
              alt={"Mensagem"}
            />
          </a>
          <Texto>
            {comunicado.legenda.split('\n').map((linha, index) => (
                  <p key={index}>
                    {linha}
                  </p> ))}
          </Texto>
        </TextoImagem>
        :
        <SoImagem>
          <a href={comunicado?.linkExterno ? comunicado.linkExterno : '-'} target="_blank">
            <Imagem
              src={comunicado?.imagemUrl}
              alt={"Mensagem"}
            />
          </a>
        </SoImagem>
        }
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
  height: 89%;
  padding: 20px;
  border-radius: 12px;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  color: #001143;
  button{
    background: linear-gradient(to right, #205fdd, #001143);
  }
`;

const TextoImagem = styled.div`
  height: 85%;
  text-align: center;
  align-items: center;
  justify-content: center;
  a{
    width: 50%;
    // background-color: red;
    display: flex;
    justify-content: flex-start;
  }
`

const SoImagem = styled.div`
  justify-content: center;
  align-items: center;
  a{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50%;
  }
`

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
  width: 80%;
  max-height: 80%;
  border-radius: 10px;
`;


const Texto = styled.div`
  width: 40%;
  border-radius: 10px;
  overflow-y: auto;
  line-height: 25px;
  padding: 15px 10px;
  border: 1px solid gray;
  flex-direction: column;
`;
