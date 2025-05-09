import React, { useState } from 'react';
import styled from 'styled-components';
import { CiCircleMinus } from "react-icons/ci";
import { CiCirclePlus } from "react-icons/ci";
import FAQS from "../constants/FAQS";
import Afastamentos from "../assets/AFASTAMENTOS.png";

function FAQComponent({item}) {
    const [openIndex, setOpenIndex] = useState(null);

    const toggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <PageContainer>
            <h2> {FAQS[item].intro} </h2>
                {FAQS[item].info.map((item, index) => (
                    <Descricoes key={index}>
                        {openIndex === index ?
                            <Perguntas onClick={() => toggle(index)}>{index+1}. {item.pergunta}<CiCircleMinus size={24}  /></Perguntas>
                            :
                            <Perguntas onClick={() => toggle(index)}>{index+1}. {item.pergunta}<CiCirclePlus size={24} /></Perguntas >
                        }
                        {openIndex === index && (
                            item.pergunta === "Justificativas aceitas para abono de faltas" ?
                                <Respostas><img src={Afastamentos} alt={Afastamentos} /></Respostas>
                                :
                                <Respostas>
                                    {item.resposta.split('\n').map((linha, index) => (
                                        <React.Fragment key={index}>
                                            {linha.trim().startsWith("•") ? (
                                                <span style={{ marginLeft: '1em' }}>{linha}</span>
                                            ) :
                                            linha.trim().startsWith("o") ? (
                                                <span style={{ marginLeft: '2em' }}>{linha}</span>
                                            ) :
                                            (
                                                linha
                                            )}
                                            <br />
                                        </React.Fragment>

                                    ))}
                                </Respostas>
                        )}
                    </Descricoes>
                ))}
        </PageContainer>
    )
}

export default FAQComponent;

const PageContainer = styled.div`
    width: 100%;
    justify-content: center;  
    flex-direction: column;
    line-height: 24px; 
    h2{
        width: 95%;
        font-size: 20px;
        margin: 10px 0;
        font-weight: 600;
        text-align: justify;
    }
`
const Descricoes = styled.div`
    flex-direction: column;
    width: 95%;
    font-size: 18px;
    line-height: 24px;
`

const Perguntas = styled.div`
    width: 95%;
    justify-content: space-between;
    color: #555;
    padding: 15px;
    border: 1px solid #555;
    border-radius: 30px;
    margin: 15px 0;
`

const Respostas = styled.div`
    width: 95%;
    flex-direction: column;
    padding: 0 15px 15px 15px;
    text-align: justify;
    span{
        text-align: left;
        padding: 0;
        margin: 0;
    }
    img {
        width: 95%;
        margin: 0 auto;
    }
`
