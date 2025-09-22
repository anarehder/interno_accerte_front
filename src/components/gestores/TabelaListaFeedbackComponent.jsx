import styled from 'styled-components';

function TabelaListaFeedbackComponent({feedback}) {
    const respostas = JSON.parse(feedback.respostas);
    const planoAcao = JSON.parse(feedback.plano);
    const perguntas = JSON.parse(feedback.competencias); 

    function formatarDataBR(dataIso) {
        const data = new Date(dataIso);
        const [ano, mes, dia] = data.toISOString().slice(0, 10).split("-");
        return `${dia}/${mes}/${ano}`;
    }

    return (
        <PageContainer>
            <Titulo>
                {feedback.Funcionario.tipoContratoId === 1 ? "Avaliação de Experiência" : "Feedback Onboarding"}
            </Titulo>
            <FormLine>
                <div>Nome: {feedback.Funcionario.nome} {feedback.Funcionario.sobrenome}</div>
                <div>Admissão: {formatarDataBR(feedback.Funcionario.admissao)}</div>
            </FormLine>
            <FormLine>
                <div>Empresa: Accerte Tecnologia</div>
                <div>Setor: {feedback.Areas.area}</div>
            </FormLine>
            <FormLine>
                <div>Responsável: {feedback.Responsavel.nome} {feedback.Responsavel.sobrenome}</div>
                <div>Data Avaliação: {formatarDataBR(feedback.dataAvaliacao)}</div>
            </FormLine>
            <FormLine>
                <div>
                    Período:
                    <label> 45 Dias </label>
                    <input
                        type="checkbox"
                        readOnly
                        checked={feedback.periodo === 45}
                        style={{ transform: 'scale(1.8)' }}
                    />
                    <label> 90 Dias </label>
                    <input
                        type="checkbox"
                        readOnly
                        checked={feedback.periodo === 90}
                        style={{ transform: 'scale(1.8)' }}
                    />
                </div>
                <div>Data Referência: {formatarDataBR(feedback.dataReferencia)} </div>
            </FormLine>
            <SubTitulo>
                Avaliação de desempenho do colaborador de acordo com cada competência.
            </SubTitulo>
            <Competencias>
                <Item>Competências</Item>
                <Respostas>{feedback.periodo} dias</Respostas>
            </Competencias>
            {perguntas.map((i, index) => (
                <Competencias key={index}>
                    <Item><div>{i.item}</div> <div> {i.subitem} </div></Item>
                    <Respostas>
                        <label>Abaixo do Esperado
                            <input
                                type="radio"
                                readOnly
                                checked={respostas[`item${index+1}`] === 25}
                            />
                        </label>
                        <label>Processo de Evolução
                            <input
                                type="radio"
                                readOnly
                                checked={respostas[`item${index+1}`] === 50}
                            />
                        </label>
                        <label>Apresenta o Esperado
                            <input
                                type="radio"
                                readOnly
                                checked={respostas[`item${index+1}`] === 75}
                            />
                        </label>
                        <label>Supera o Esperado
                            <input
                                type="radio"
                                readOnly
                                checked={respostas[`item${index+1}`] === 100}
                            />
                        </label>                        
                    </Respostas>
                </Competencias>
            ))}
            <Competencias>
                <Item>Avaliação Final: <span>{feedback.avaliacao} </span></Item>
                <Respostas>
                    Nota Final = {feedback.nota} %
                </Respostas>
            </Competencias>
            <SubTitulo>
                Plano de Ação (Desenvolver/Melhorar):
            </SubTitulo>
            <PlanoAcao>
                <div>
                    <div>
                        O que?
                    </div>
                    <div>
                        Por quê?
                    </div>
                    <div>
                        Como?
                    </div>
                    <div>
                        Quem?
                    </div>
                    <div>
                        Quando?
                    </div>
                </div>
                <div>
                    <div>
                        <textarea
                            readOnly
                            value={planoAcao.que || ""}
                            rows="8"
                        />
                    </div>
                    <div>
                        <textarea
                            value={planoAcao.porque || ""}
                            readOnly
                            rows="8"
                        />
                    </div>
                    <div>
                        <textarea
                            value={planoAcao.como || ""}
                            readOnly
                            rows="8"
                        />
                    </div>
                    <div>
                        <textarea
                            value={planoAcao.quem || ""}
                            readOnly
                            rows="8"
                        />
                    </div>
                    <div>
                        <textarea
                            value={planoAcao.quando || ""}
                            readOnly
                            rows="8"
                        />
                    </div>
                </div>
            </PlanoAcao>
            <SubTitulo>
                Sugestões de Treinamentos:
            </SubTitulo>
            <FormLine>
                <textarea
                      value={feedback.sugestoes.slice(1)}
                      readOnly
                      rows="3"
                  />
                </FormLine>
            <SubTitulo>
                Assinaturas:
            </SubTitulo>
            <FormLine>
                <Assinatura>Gestor:</Assinatura>
                <Assinatura>Colaborador:</Assinatura>
            </FormLine>
            <FormLine>
                <Assinatura>Gente & Gestão:</Assinatura>
                {feedback.Funcionario.tipoContratoId !== 1 ? 
                    <div>
                        <label> Encerrar </label>
                        <input
                            type="checkbox"
                            readOnly
                            checked={feedback.decisao ==="Encerrar"}
                            style={{ transform: 'scale(1.8)' }}
                        />
                        <label> Continuar </label>
                        <input
                            type="checkbox"
                            readOnly
                            checked={feedback.decisao==="Continuar"}
                            style={{ transform: 'scale(1.8)' }}
                        />
                    </div>             
                : feedback.periodo === 45  ? 
                    <div>
                        <label> Prorrogar </label>
                        <input
                            type="checkbox"
                            readOnly
                            checked={feedback.decisao==="Prorrogar"}
                            style={{ transform: 'scale(1.8)' }}
                        />
                        <label> Encerrar </label>
                        <input
                            type="checkbox"
                            readOnly
                            checked={feedback.decisao==="Encerrar"}
                            style={{ transform: 'scale(1.8)' }}
                        />
                    </div> 
                : feedback.periodo === 90 ?
                <div>
                        <label> Efetivar </label>
                        <input
                            type="checkbox"
                            readOnly
                            checked={feedback.decisao==="Efetivar"}
                            style={{ transform: 'scale(1.8)' }}
                        />
                        <label> Encerrar </label>
                        <input
                            type="checkbox"
                            readOnly
                            checked={feedback.decisao==="Encerrar"}
                            style={{ transform: 'scale(1.8)' }}
                        />
                    </div> 
                            : <div>Ação:</div>}
            </FormLine>

        </PageContainer>
    )
}

export default TabelaListaFeedbackComponent;

const PageContainer = styled.div`
    width: 1350px;
    border-radius: 15px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: 4px 4px 8px 4px rgba(0, 0, 0, 0.2);
    background-color: white;
    line-height: 25px;
    padding-bottom: 15px;
    // margin: 30px 0;
    textarea {
        width: 90%;
        color: black;
        font-family: "Poppins", serif;
        font-size: 14px;
        padding: 5px;
        border-radius: 8px;
        text-indent: 10px;
        box-shadow: 2px 2px 3px 2px rgba(0, 0, 0, 0.1);
    }
`

const Titulo = styled.div`
    background-color: #EE2B51;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    color: white;
    font-weight: 500;
    font-size: 20px;
    align-items: center;
    justify-content: center;
    padding: 5px 0;
`

const SubTitulo = styled.div`
    background-color: #EE2B51;
    color: white;
    font-size: 16px;
    align-items: center;
    justify-content: center;
    padding: 5px 0;
    margin-top: 15px;
`

const FormLine = styled.div`
    gap: 15px;
    text-indent: 15px;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #bebbbbff;
    padding: 5px 0;
    label{
        // margin-left: 10px;
    }
    div{
        justify-content: flex-start;
        align-items: center;
        width: 700px;
        gap: 15px;
    }
    div: nth-child(2){
        width: 450px;
    }
    textarea{
        text-indent: 0;
        // padding: 10px;
    }
`

const Assinatura = styled.div`
    line-height: 120px;
`

const Competencias = styled.div`
    gap: 10px;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #bebbbbff;
    padding: 5px 0;
    font-size: 15px;
    // 
    label{
        justify-content: center;
        display: flex;
        font-size: 13px;
        text-align: center;
        width: 100px;
        line-height: 15px;
        flex-direction: column;
        align-items: center;
        
    }
    span{
        font-weight: 600;
        margin-left: 5px;
        padding: 10px 0;
    }
`

const Respostas = styled.div`
    gap: 5px;
    justify-content: center;
    width: 450px;
`

const Item = styled.div`
    justify-content: center;
    align-items: center;
    width: 900px;
    div: nth-child(1){
        width: 175px;
        font-size: 13.5px;
        justify-content: center;
        text-align: center;
    }
    div: nth-child(2){
        width: 700px;
        justify-content: flex-start;
        text-align: center;
        border-right: 1px solid #bebbbbff;
        text-align: justify;
        padding: 0 10px;
    }
`

const PlanoAcao = styled.div`
    flex-direction: column;
    margin-top: 10px;
    div{
        justify-content: center;
        text-align: center;
    }
    textarea{
        text-indent: 0;
    }
`

const Button = styled.button`
    width: 170px;
    font-size: 16px;
    justify-content: center;
    background-color: #EE2B51;
    margin-top: 50px;
`;