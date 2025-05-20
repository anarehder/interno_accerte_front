// SugestoesComponent.jsx
import React, { useState } from 'react';
import styled from "styled-components";
import apiService from '../services/apiService';
import { FcIdea } from "react-icons/fc";

function SugestoesComponent({email}) {
    const [tipo, setTipo] = useState('Melhoria');
    const [texto, setTexto] = useState('');
    const [mensagem, setMensagem] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const body = { tipo, texto, email, avaliado: false };
            console.log(body);
            const response = await apiService.criarSugestoes(body);
            console.log(response);
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
          <h2><FcIdea size={24} /> Compartilhe suas ideias para a Intranet</h2>
          <form onSubmit={handleSubmit}>
              <ItensContainer>
                  <label>
                      Tipo:

                  </label>
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
                  <label>
                      Texto:

                  </label>
                  <textarea
                      value={texto}
                      onChange={(e) => s(e.target.value)}
                      rows="5"
                      required
                  />
              </ItensContainer>

              <Button type="submit">
                  Enviar
              </Button>
          </form>
          {/* {mensagem && <p className="mt-4 text-green-700">{mensagem}</p>} */}
      </Container>
  );
};

export default SugestoesComponent;

const Container = styled.div`
    width:90%;
    color: #555;
    flex-direction: column;
    justify-content: flex-start;
    margin-bottom: 50px;
    h2{
        color:#067DD1;
        font-size: 26px;
        text-align: left;
        margin: 15px 0;
        margin-bottom: 35px;
    }
    form{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 100px;
        div:first-of-type{
            width: 30%;
        }
    }


`
const ItensContainer = styled.div`
    flex-direction: column;
    justify-content: flex-start;
    font-size: 20px;
    gap: 20px;
    height: 160px;
    max-width: 50%;
    textarea {
        color: #555;
        font-family: "Poppins", serif;
        padding: 5px;
        border-radius: 10px;
    }
`


const Button = styled.button`
    width: 100px;
    height: 50px;
    justify-content: center;
    border: none;
    border-radius: 10px;
    cursor: pointer;
`;