import styled from 'styled-components';
import PapelTimbrado from "../../assets/PAPEL_TIMBRADO_ACCERTE.png";

function TabelaListaFeedbackComponent({feedback, imageRef1, imageRef2 }) {
    const respostas = JSON.parse(feedback.respostas);
    const planoAcao = JSON.parse(feedback.plano);
    const perguntas = JSON.parse(feedback.competencias); 

    function formatarDataBR(dataIso) {
        const data = new Date(dataIso);
        const [ano, mes, dia] = data.toISOString().slice(0, 10).split("-");
        return `${dia}/${mes}/${ano}`;
    }

    return (
        <Container>
        
        <PageContainer ref={imageRef1}>
            <Titulo>
                {feedback.Funcionario.tipoContratoId === 1 ? "Avaliação de Experiência" : "Feedback Onboarding"}
            </Titulo>
            <FormLine>
                <div><span>Nome:</span> {feedback.Funcionario.nome} {feedback.Funcionario.sobrenome}</div>
                <div><span>Admissão:</span>{formatarDataBR(feedback.Funcionario.admissao)}</div>
                
            </FormLine>
            <FormLine>
                <div><span>Empresa:</span> Accerte Tecnologia</div>
                <div><span>Setor:</span> {feedback.Areas.area}</div>
            </FormLine>
            <FormLine>
                <div><span>Responsável:</span>{feedback.Responsavel.nome} {feedback.Responsavel.sobrenome}</div>
                <div><span>Data Avaliação:</span> {formatarDataBR(feedback.dataAvaliacao)}</div>
            </FormLine>
            <FormLine>
                <div>
                    <span>Período:</span>
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
                <div><span>Data Referência:</span> {formatarDataBR(feedback.dataReferencia)} </div>
                
            </FormLine>
            <SubTitulo>
                Avaliação de desempenho do colaborador de acordo com cada competência.
            </SubTitulo>
            <Competencias>
               <div>AB - Abaixo do Esperado</div> |  
               <div>PE - Processo de Evolução</div>|  
               <div>AE - Apresenta o Esperado</div>| 
               <div>SE - Supera o Esperado</div>
            </Competencias>
            <Competencias>
                <Item><span>Competências</span></Item>
                <Respostas><span>{feedback.periodo} dias</span></Respostas>
            </Competencias>
            
            {perguntas.map((i, index) => (
                <Competencias key={index}>
                    <Item><div>{i.item}</div> <div> {i.subitem} </div></Item>
                    <Respostas>
                        <label>AB
                            <input
                                type="radio"
                                readOnly
                                checked={respostas[`item${index+1}`] === 25}
                            />
                        </label>
                        <label>PE
                            <input
                                type="radio"
                                readOnly
                                checked={respostas[`item${index+1}`] === 50}
                            />
                        </label>
                        <label>AE
                            <input
                                type="radio"
                                readOnly
                                checked={respostas[`item${index+1}`] === 75}
                            />
                        </label>
                        <label>SE
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
                    <span>Nota Final = {feedback.nota} %</span>
                </Respostas>
            </Competencias>
           
        </PageContainer>
        <PageContainer ref={imageRef2}>
            <Titulo>
                {feedback.Funcionario.tipoContratoId === 1 ? "Avaliação de Experiência" : "Feedback Onboarding"}
            </Titulo>
            <br/>
            <br/>
            <SubTitulo>
                Plano de Ação (Desenvolver/Melhorar):
            </SubTitulo>
            <PlanoAcao>
                    <div>O que?</div>
                    <textarea
                        readOnly
                        value={planoAcao.que || ""}
                        rows="4"
                    />
                    <div>Por quê?</div>
                    <textarea
                        readOnly
                        value={planoAcao.porque || ""}
                        rows="4"
                    />
                    <div>Como?</div>
                    <textarea
                        readOnly
                        value={planoAcao.como || ""}
                        rows="4"
                    />
                    <div>Quem?</div>
                    <textarea
                        readOnly
                        value={planoAcao.quem || ""}
                        rows="4"
                    />
                    <div>Quando?</div>
                    <textarea
                        readOnly
                        value={planoAcao.quando || ""}
                        rows="4"
                    />
            </PlanoAcao>          
            <SubTitulo>
                Sugestões de Treinamentos:
            </SubTitulo>
            <PlanoAcao>
                <textarea
                      value={feedback.sugestoes.slice(1)}
                      readOnly
                      rows="4"
                  />
            </PlanoAcao>
            <SubTitulo>
                Decisão do Gestor:
                {feedback.Funcionario.tipoContratoId !== 1 ?
                    <div>
                        <label> Encerrar </label>
                        <input
                            type="checkbox"
                            readOnly
                            checked={feedback.decisao === "Encerrar"}
                            style={{ transform: 'scale(1.8)' }}
                        />
                        <label> Continuar </label>
                        <input
                            type="checkbox"
                            readOnly
                            checked={feedback.decisao === "Continuar"}
                            style={{ transform: 'scale(1.8)' }}
                        />
                    </div>
                    : feedback.periodo === 45 ?
                        <div>
                            <label> Prorrogar </label>
                            <input
                                type="checkbox"
                                readOnly
                                checked={feedback.decisao === "Prorrogar"}
                                style={{ transform: 'scale(1.8)' }}
                            />
                            <label> Encerrar </label>
                            <input
                                type="checkbox"
                                readOnly
                                checked={feedback.decisao === "Encerrar"}
                                style={{ transform: 'scale(1.8)' }}
                            />
                        </div>
                        : feedback.periodo === 90 ?
                            <div>
                                <label> Efetivar </label>
                                <input
                                    type="checkbox"
                                    readOnly
                                    checked={feedback.decisao === "Efetivar"}
                                    style={{ transform: 'scale(1.8)' }}
                                />
                                <label> Encerrar </label>
                                <input
                                    type="checkbox"
                                    readOnly
                                    checked={feedback.decisao === "Encerrar"}
                                    style={{ transform: 'scale(1.8)' }}
                                />
                            </div>
                            : <div>Ação:</div>}
            </SubTitulo>
            <SubTitulo>
                Assinaturas:
            </SubTitulo>
            <Assinatura>
                <div>Gestor: </div>
                <div>Colaborador:</div>
                <div>Gente & Gestão:</div>
            </Assinatura>

        </PageContainer>
        </Container>
    )
}

export default TabelaListaFeedbackComponent;

const Container = styled.div`
    flex-direction: column;
    gap: 10px;
`

const PageContainer = styled.div`
    width: 1350px;
    height: 1909px;
    background: url(${PapelTimbrado}) no-repeat top center;
    background-size: 100% 100%;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    box-shadow: 4px 4px 8px 4px rgba(0, 0, 0, 0.2);
    background-color: white;
    line-height: 22px;
    textarea {
        width: 95%;
        color: black;
        font-family: "Poppins", serif;
        font-size: 16px;
        padding: 5px;
        border-radius: 8px;
        box-shadow: 2px 2px 3px 2px rgba(215, 213, 213, 0.4);
    }
`

const Titulo = styled.div`
    margin-top: 170px;
    margin-bottom: 50px;
    color: #002266;
    font-weight: 600;
    font-size: 22px;
    align-items: center;
    justify-content: center;
    padding: 5px 0;
`

const SubTitulo = styled.div`
    background-color: #002266;
    color: white;
    font-size: 20px;
    align-items: center;
    justify-content: center;
    padding: 5px 0;
    margin: 15px 0;
    div{
        width: 280px;
        // background-color: red;
        justify-content: flex-end;
        label{
            // background-color: red;
            margin-left: 35px;
            margin-right: 5px;
        }
    }
`

const FormLine = styled.div`
    gap: 40px;
    width: 80%;
    font-size: 18px;
    justify-content: center;
    align-items: center;
    padding: 5px 10px;
    div{
        border-bottom: 1px solid #bebbbbff;
        justify-content: flex-start;
        align-items: center;
        width: 380px;
        gap: 10px;
    }
    div: nth-child(1){
        width: 580px;
    }
    span{
        font-weight: 500;
    }
    textarea{
        text-indent: 0;
        // padding: 10px;
    }
`

const Assinatura = styled.div`
    flex-direction: column;
    align-items: center;
    line-height: 40px;
    font-size: 18px;
    margin: 0 auto;
    gap: 10px;
    width: 70%;
    div{
        justify-content: flex-start;
        border: 1px solid #b6b2b2ff;
        padding: 10px;
        border-radius: 5px;
    }
`

const Competencias = styled.div`
    margin: 8px 0;
    width: 1300px;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #bebbbbff;
    padding: 5px 0 10px 0;
    font-size: 18px;
    // background-color: red;
    label{
        justify-content: center;
        display: flex;
        text-align: center;
        width: 100px;
        line-height: 15px;
        flex-direction: column;
        align-items: center;
    }
    span{
        font-weight: 600;
        margin-left: 5px;
        padding: 4px 0;
        color: #002266;
    }
    div{
        justify-content: center;
    }

`

const Respostas = styled.div`
    gap: 5px;
    justify-content: center;
    width: 300px;
`

const Item = styled.div`
    justify-content: center;
    align-items: center;
    width: 980px;
    gap: 10px;
    div: nth-child(1){
        width: 200px;
        justify-content: center;
        text-align: center;
        padding: 0 5px;
    }
    div: nth-child(2){
        width: 750px;
        justify-content: flex-start;
        text-align: center;
        border-right: 1px solid #bebbbbff;
        border-left: 1px solid #bebbbbff;
        text-align: justify;
        padding: 0 25px;
    }
`

const PlanoAcao = styled.div`
    flex-direction: column;
    margin-top: 10px;
    align-items: center;
    div{
        width: 95%;
        justify-content: flex-start;
        text-align: center;
        padding: 0 2px;
    }
    textarea{
        margin: 10px 0;
    }
`
