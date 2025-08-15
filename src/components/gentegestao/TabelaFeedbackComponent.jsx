import { useState } from 'react';
import styled from 'styled-components';

function TabelaFeedbackComponent({funcionarioInfo}) {
    const [dias, setDias] = useState(0);
    const [acao, setAcao] = useState(null);
    const [sugestoes, setSugestoes] = useState('');
    const [planoAcao, setPlanoAcao] = useState({ que: null, porque: null, como: null, quem: null, quando: null });

    const [notas, setNotas] = useState({item1: 0, item2: 0, item3: 0, item4: 0, item5: 0, item6: 0, item7:0, item8: 0, item9: 0, item10: 0, item11: 0, item12: 0, item13: 0});

    const itens = [{ id: 'item1', peso: 4 }, { id: 'item2', peso: 5 }, { id: 'item3', peso: 4 }, { id: 'item4', peso: 5 }, { id: 'item5', peso: 5 }, { id: 'item6', peso: 4 }, { id: 'item7', peso: 4 }, { id: 'item8', peso: 5 }, { id: 'item9', peso: 4 }, { id: 'item10', peso: 5 }, { id: 'item11', peso: 5 }, { id: 'item12', peso: 5 }, { id: 'item13', peso: 5 }];
    
    const total = ((itens.reduce((acc, { id, peso }) => {
        const nota = notas[id] || 0;
        return acc + (nota * peso);
    }, 0) / 6000) * 100);

    const perguntas = [
        {item: 'Senso de Urgência', subitem:"Capacidade de reconhecer situações que demandam uma ação imediata e agir rapidamente para resolver o problema."},
        {item: 'Trabalho em Equipe', subitem:"Mostra comportamento cooperativo para atingir resultados em grupo. Desenvolve trabalhos em equipe, com postura participativa e colaborativa."},
        {item: 'Comunicação', subitem:"Transmite de forma clara e objetiva as informações escritas e orais, assegurando-se de sua compreensão."},
        {item: 'Planejamento, organização e disciplina', subitem:"Capacidade de se preparar para as atividades cotidianas, cumprindo regularmente com a carga horária de trabalho, regras, processos e instruções definidas para suas atividades."},
        {item: 'Ética', subitem:"Capacidade para agir de acordo com princípios morais e valores éticos em diferentes situações. Mantém a honestidade e a transparência nas ações e decisões."},
        {item: 'Proatividade', subitem:"Tomar a iniciativa de se adaptar a novos cenários e antecipar necessidades ou mudanças no ambiente de trabalho."},
        {item: 'Solução de problemas', subitem:"Habilidade para trabalhar de forma construtiva na resolução de desafios, respeitando as contribuições dos outros."},
        {item: 'Relacionamento Interpessoal', subitem:"Capacidade de se relacionar com colegas, líderes e clientes com respeito, cordialidade e empatia."},
        {item: 'Comprometimento', subitem:"Demonstra compromentimento com os objetivos, metas e prazos estabelecidos pela empresa."},
        {item: 'Escuta Ativa', subitem:"Capacidade de ouvir e considerar as opiniões dos outros, demonstrando empatia."},
        {item: 'Capacidade de Aprendizagem', subitem:"Facilidade de absorver novas informações e colocá-la na prática em suas novas atribuições."},
        {item: 'Resiliência', subitem:"Capacidade em lidar com os desafios ou contratempos de forma eficaz, sem perder o foco nas soluções"},
        {item: 'Conhecimento Técnico', subitem:"Demonstra domínio e ou segurança para aplicação de habilidades e conhecimentos específicos necessários para realizar as tarefas e resolver problemas da área ou função específica."}
    ];

    function formatarDataBR(dataIso) {
        const data = new Date(dataIso);
        const [ano, mes, dia] = data.toISOString().slice(0, 10).split("-");
        return `${dia}/${mes}/${ano}`;
    }

    function somarData(dias) {
        const admissao = new Date(funcionarioInfo.admissao);
        admissao.setDate(admissao.getDate() + Number(dias));
        const formatada = formatarDataBR(admissao);
        return formatada;
    }

    return (
        <PageContainer>
            <Titulo>
                {funcionarioInfo.Contratos?.tipo === "CLT" ? "Avaliação de Experiência" : "Feedback Onboarding"}
            </Titulo>
            <FormLine>
                <div>Nome: {funcionarioInfo.nome} {funcionarioInfo.sobrenome}</div>
                <div>Admissão: {formatarDataBR(funcionarioInfo.admissao)}</div>
            </FormLine>
            <FormLine>
                <div>Empresa: Accerte Tecnologia</div>
                <div>Setor: {funcionarioInfo.Areas?.area}</div>
            </FormLine>
            <FormLine>
                <div>Data Avaliação: {formatarDataBR(new Date())}</div>
                <div></div>
            </FormLine>
            <FormLine>
                <div>
                    Período:
                    <label> 45 Dias </label>
                    <input
                        type="checkbox"
                        checked={dias === 45}
                        onChange={dias === 45 ? () => setDias(0) : () => setDias(45)}
                        style={{ transform: 'scale(1.8)' }}
                    />
                    <label> 90 Dias </label>
                    <input
                        type="checkbox"
                        checked={dias === 90}
                        onChange={dias === 90 ? () => setDias(0) : () => setDias(90)}
                        style={{ transform: 'scale(1.8)' }}
                    />
                </div>
                <div>Data Referência: {dias === 0 ? "-" : somarData(dias)} </div>
            </FormLine>
            <SubTitulo>
                Marque o que corresponde ao desempenho do colaborador de acordo com cada competência.
            </SubTitulo>
            <Competencias>
                <Item>Competências</Item>
                <div>{dias !== 0 && `${dias} dias`}</div>
            </Competencias>
            {perguntas.map((i, index) => (
                <Competencias key={index}>
                    <Item><div>{i.item}</div> <div> {i.subitem} </div></Item>
                    <div>
                        <label>Supera o Esperado
                            <input
                                type="radio"
                                name={`item${index+1}`}
                                value={100}
                                checked={notas[`item${index+1}`] === 100}
                                onChange={(e) =>
                                    setNotas(prev => ({ ...prev, [`item${index+1}`]: Number(e.target.value) }))
                                }
                            />
                        </label>
                        <label>Apresenta o Esperado
                            <input
                                type="radio"
                                name={`item${index+1}`}
                                value={75}
                                checked={notas[`item${index+1}`] === 75}
                                onChange={(e) =>
                                    setNotas(prev => ({ ...prev, [`item${index+1}`]: Number(e.target.value) }))
                                }
                            />
                        </label>
                        <label>Processo de Evolução
                            <input
                                type="radio"
                                name={`item${index+1}`}
                                value={50}
                                checked={notas[`item${index+1}`] === 50}
                                onChange={(e) =>
                                    setNotas(prev => ({ ...prev, [`item${index+1}`]: Number(e.target.value) }))
                                }
                            />
                        </label>
                        <label>Abaixo do Esperado
                            <input
                                type="radio"
                                name={`item${index+1}`}
                                value={25}
                                checked={notas[`item${index+1}`] === 25}
                                onChange={(e) =>
                                    setNotas(prev => ({ ...prev, [`item${index+1}`]: Number(e.target.value) }))
                                }
                            />
                        </label>
                        
                    </div>
                </Competencias>
            ))}
            <Competencias>
                <Item>Avaliação Final: <span>{total<40 ? " Insatisfatório" : total < 58 ? " Abaixo do esperado" : total < 70 ? " Em desenvolvimento" : total<89 ? " Apresenta o esperado": " Supera o esperado"} </span></Item>
                <div>
                    Nota Final = {total.toFixed(1)} %
                </div>
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
                            placeholder='o que...'
                            name="que"
                            value={planoAcao.que || ""}
                            onChange={(e) =>
                                setPlanoAcao(prev => ({
                                ...prev,
                                [e.target.name]: e.target.value
                                }))
                            }
                            rows="5"
                            required
                        />
                    </div>
                    <div>
                        <textarea
                            placeholder='porque...'
                            name="porque"
                            value={planoAcao.porque || ""}
                            onChange={(e) =>
                                setPlanoAcao(prev => ({
                                ...prev,
                                [e.target.name]: e.target.value
                                }))
                            }
                            rows="5"
                            required
                        />
                    </div>
                    <div>
                        <textarea
                            placeholder='como...'
                            name="como"
                            value={planoAcao.como || ""}
                            onChange={(e) =>
                                setPlanoAcao(prev => ({
                                ...prev,
                                [e.target.name]: e.target.value
                                }))
                            }
                            rows="5"
                            required
                        />
                    </div>
                    <div>
                        <textarea
                            placeholder='quem...'
                            name="quem"
                            value={planoAcao.quem || ""}
                            onChange={(e) =>
                                setPlanoAcao(prev => ({
                                ...prev,
                                [e.target.name]: e.target.value
                                }))
                            }
                            rows="5"
                            required
                        />
                    </div>
                    <div>
                        <textarea
                            placeholder='quando...'
                            name="quando"
                            value={planoAcao.quando || ""}
                            onChange={(e) =>
                                setPlanoAcao(prev => ({
                                ...prev,
                                [e.target.name]: e.target.value
                                }))
                            }
                            rows="5"
                            required
                        />
                    </div>
                </div>
            </PlanoAcao>
            <SubTitulo>
                Sugestões de Treinamentos:
            </SubTitulo>
            <FormLine>
                <textarea
                      placeholder='Descreva aqui sua sugestão.'
                      value={sugestoes}
                      onChange={(e) => setSugestoes(e.target.value)}
                      rows="5"
                      required
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
                {funcionarioInfo.Contratos?.tipo !== "CLT" ? 
                    <div>
                        <label> Encerrar </label>
                        <input
                            type="checkbox"
                            checked={acao==="Encerrar"}
                            onChange={acao === "Encerrar" ? () => setAcao(null) : () => setAcao("Encerrar")}
                            style={{ transform: 'scale(1.8)' }}
                        />
                    </div>                
                : dias === 45  ? 
                    <div>
                        <label> Prorrogar </label>
                        <input
                            type="checkbox"
                            checked={acao==="Prorrogar"}
                            onChange={acao === "Prorrogar" ? () => setAcao(null) : () => setAcao("Prorrogar")}
                            style={{ transform: 'scale(1.8)' }}
                        />
                        <label> Encerrar </label>
                        <input
                            type="checkbox"
                            checked={acao==="Encerrar"}
                            onChange={acao === "Encerrar" ? () => setAcao(null) : () => setAcao("Encerrar")}
                            style={{ transform: 'scale(1.8)' }}
                        />
                    </div> 
                : dias === 90 ?
                <div>
                        <label> Efetivar </label>
                        <input
                            type="checkbox"
                            checked={acao==="Efetivar"}
                            onChange={acao === "Efetivar" ? () => setAcao(null) : () => setAcao("Efetivar")}
                            style={{ transform: 'scale(1.8)' }}
                        />
                        <label> Encerrar </label>
                        <input
                            type="checkbox"
                            checked={acao==="Encerrar"}
                            onChange={acao === "Encerrar" ? () => setAcao(null) : () => setAcao("Encerrar")}
                            style={{ transform: 'scale(1.8)' }}
                        />
                    </div> 
                : <div>Ação:</div>}
            </FormLine>
        </PageContainer>
    )
}

export default TabelaFeedbackComponent;

const PageContainer = styled.div`
    width: 1100px;
    border-radius: 15px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: 4px 4px 8px 4px rgba(0, 0, 0, 0.2);
    background-color: white;
    line-height: 25px;
    padding-bottom: 15px;
    margin: 30px 0;
    textarea {
        width: 90%;
        color: #555;
        font-family: "Poppins", serif;
        font-size: 15px;
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
        width: 600px;
        gap: 15px;
    }
    div: nth-child(2){
        width: 450px;
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
    div: nth-child(2){
        width: 420px;
        gap: 5px;
        justify-content: center;
    }
`

const Item = styled.div`
    justify-content: center;
    align-items: center;
    width: 650px;
    div: nth-child(1){
        width: 160px;
        justify-content: center;
        text-align: center;
    }
    div: nth-child(2){
        width: 470px;
        justify-content: center;
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
`