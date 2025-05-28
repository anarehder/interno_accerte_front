import{ useState, } from "react";
import styled from "styled-components";
import { useAuth } from "../../contexts/AuthContext";
import apiService from "../../services/apiService";

const CriarEscalaComponent = () => {
        const { dados, user } = useAuth();
        const [inicioSemana, setInicioSemana] = useState('');
        const [fimSemana, setFimSemana] = useState('');

        const handleSubmit = async () => {
            if (!inicioSemana || !fimSemana) {
                alert("Preencha ambas as datas!");
                return;
            }
            const body = {
                "adminEmail": user.mail,
                "inicioSemana": inicioSemana,
                "fimSemana": fimSemana,
                "funcionarios": dados.agenda
            };
            // console.log(body);
            // alert(body.funcionarios[0].mail);
            const confirmed = window.confirm(
                `Solicitante: ${body.adminEmail}\n` +
                `Confirma os dados da requisição?\n` +
                `Início: ${body.inicioSemana}\n` +
                `Fim: ${body.fimSemana}\n`
            );
            if (!confirmed) {
                // Se clicou em "Cancelar", sai da função aqui
                return;
            }
            try {
                const response = await apiService.createEscala(body);
                if (response.statusText === "OK") {
                    alert("Escala criada com sucesso!");
                }
            } catch (error) {
                console.error("Erro ao enviar requisição:", error);
                alert(`Ocorreu um erro. Tente novamente, ${error.response.data.message}.`);
            }
        };

    return (
        <Container>

                <EscalaContainer>
                    <h3>Selecionar Período <br/> da Escala</h3>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Início da Semana:</label><br />
                        <input
                            type="date"
                            value={inicioSemana}
                            onChange={(e) => setInicioSemana(e.target.value)}
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Fim da Semana:</label><br />
                        <input
                            type="date"
                            value={fimSemana}
                            onChange={(e) => setFimSemana(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleSubmit}>
                        Gerar Escala
                    </Button>
                </EscalaContainer>
        </Container>
    );
}

export default CriarEscalaComponent;
  

const Container = styled.div`
    flex-direction: column;
    border-radius: 8px;
    align-items: center;
    
`;

const ButtonsContainer = styled.div`
    justify-content: center;
    flex-wrap: wrap;
    margin: 30px 0 40px 0;
    gap: 50px;
`
  
const Button = styled.button`
    text-align: center;
    width: 150px;
    justify-content: center;
    font-weight: 700;
    background-color: ${({ active }) => (active  === 'show' ? "#ff5843" : "transparent")};
    color: ${({ active }) => (active === 'show' ? "white" : "#ff5843")};
    border: ${({ active }) => (active === 'show' ? "3px solid #ff5843" : "3px solid #ff5843")};
    &:hover {
        background-color: ${({ active }) => (active === 'show' ? "#ff5843" : "white")
    };
`;

const EscalaContainer = styled.div`
    width: 750px;
    margin-top: 20px;
    justify-content: space-between;
    align-items: center;
    justify-content: center;
    gap: 30px;
    height: 100px;
    div{
        width: 40%;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
`