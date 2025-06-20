// SugestoesComponent.jsx
import { useState } from 'react';
import styled from "styled-components";
import apiService from '../../services/apiService';

import IdeaIcon from "../../assets/basic/idea-icon.png"

function SugestoesComponent({email}) {
    const [tipo, setTipo] = useState('Melhoria');
    const [texto, setTexto] = useState('');
    const [mensagem, setMensagem] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const body = { tipo, texto, email, avaliado: false };
            const response = await apiService.criarSugestoes(body);
            alert("Sugestão enviada com sucesso!");
            setMensagem('');
            setTexto('');
            setTipo('Melhoria');
        } catch (error) {
            setMensagem('Erro ao enviar sugestão.');
            console.error(error);
        }
  };

  return (
      <Container>
          <Title><img src={IdeaIcon} alt={"Ideia"} /> COMPARTILHE <span> SUAS IDEIAS </span> PARA A INTRANET</Title>
          <form onSubmit={handleSubmit}>
              <ItensContainer>
                  <select
                      value={tipo}
                      onChange={(e) => setTipo(e.target.value)}
                      className="w-full p-2 border rounded mt-1"
                  >
                      <option value="Melhoria">Melhoria</option>
                      <option value="Sugestão">Sugestão</option>
                  </select>
              </ItensContainer>
              <ItensContainer>
                  <textarea
                      placeholder='Descreva aqui sua ideia/sugestão'
                      value={texto}
                      onChange={(e) => setTexto(e.target.value)}
                      rows="5"
                      required
                  />
              </ItensContainer>

              <Button type="submit">
                  ENVIAR
              </Button>
          </form>
          {/* {mensagem && <p className="mt-4 text-green-700">{mensagem}</p>} */}
      </Container>
  );
};

export default SugestoesComponent;

const Container = styled.div`
    width:90%;
    color: #002972;
    border-radius: 8px;
    box-shadow: 2px 2px 3px 2px rgba(0, 0, 0, 0.2);
    flex-direction: column;
    justify-content: flex-start;
    margin-bottom: 50px;
    padding: 15px 0;    
    form{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

`

const Title = styled.div`
    height: 60px;   
    font-size: 30px;
    align-items: flex-end;
    justify-content: center;
    gap: 10px;
    line-height: 45px;
    margin-bottom: 20px;
    img{
        height: 60px;
    }
`

const ItensContainer = styled.div`
    flex-direction: column;
    justify-content: flex-start;
    font-size: 20px;
    gap: 20px;
    margin: 15px 0;
    // height: 160px;
    width: 80%;
    textarea {
        color: #555;
        font-family: "Poppins", serif;
        font-size: 15px;
        padding: 5px;
        border-radius: 8px;
        text-indent: 10px;
        box-shadow: 2px 2px 3px 2px rgba(0, 0, 0, 0.3);
    }
    label{
    }
    select{
        color: #002972;
        // background-color: red;
        border-radius: 8px;
        box-shadow: 2px 2px 3px 2px rgba(0, 0, 0, 0.3);
    }
`


const Button = styled.button`
    height: 50px;
    justify-content: center;
    border: none;
    margin: 10px 0;
    border-radius: 10px;
    cursor: pointer;
    color: #002972;
    box-shadow: 0px 4px 4px 0px #00000040;
    font-weight: 600;
    font-size: 25px;
    line-height: 14px;
    background: linear-gradient(111.16deg, #FFFFFF 36.05%, #BDBCBC 109.97%);
`;