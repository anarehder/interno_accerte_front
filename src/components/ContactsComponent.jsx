import React from "react";
import styled from "styled-components";

function ContactsComponent({dados, contatos}){
    const listaContatos = contatos ?? dados?.funcionarios ?? [];
    const listaGestores = dados?.gestores ?? [];

    // Quantas áreas esse funcionário gerencia (ao todo, em listaGestores).
    const areasGeridasPor = (funcionarioId) =>
        listaGestores.filter(g => g.funcionarioId === funcionarioId).length;

    // Quando uma área tem mais de um gestor cadastrado, prioriza o que é gestor
    // exclusivamente dela (ex: Josue, que só gerencia essa área). O gestor que
    // acumula várias áreas (ex: Ronildo) só aparece quando for a única opção.
    function gestorDaArea(areaId){
        const candidatos = listaGestores.filter(g => g.areaId === areaId);
        if (candidatos.length <= 1) return candidatos[0];
        return candidatos.find(g => areasGeridasPor(g.funcionarioId) === 1)
            ?? candidatos[0];
    }

    return (
        <Container>
            <List>
                <ContactCard>
                    <Info><span>Nome</span></Info>
                    <Info><span>E-mail</span></Info>
                    <Info><span>Telefone</span></Info>
                    <Info><span>Cargo</span></Info>
                    <Info><span>Local</span></Info>
                    <Info><span>Gestor</span></Info>
                </ContactCard>
                {listaContatos.length > 0 && listaContatos
                // .filter(contato => contato.officeLocation !== "NA" && contato.officeLocation !== "OFF")
                .map((contato, index) => {
                    // Se a pessoa é gestor, exibe o gestor superior dela (registrado no
                    // próprio cadastro de gestor). Caso contrário, exibe o gestor da área.
                    const gestorProprio = listaGestores.find(g => g.funcionarioId === contato.id);
                    const gestorSuperior = gestorProprio
                        ? { funcionarioId: gestorProprio.gestorSuperiorId }
                        : gestorDaArea(contato.areaId);
                    const gestorFuncionario = dados?.funcionarios?.find(f => f.id === gestorSuperior?.funcionarioId);

                    return (
                        <ContactCard key={index}>
                            <Info>{contato.nome} {contato.sobrenome}</Info>
                            <Info>{contato.email}</Info>
                            <Info>{contato.telefone}</Info>
                            <Info>{contato.cargo}</Info>
                            <Info>{contato.localizacao}</Info>
                            <Info>{gestorFuncionario ? `${gestorFuncionario.nome} ${gestorFuncionario.sobrenome}` : "-"}</Info>
                        </ContactCard>
                    );
                })}
            </List>
        </Container>
    );
}

export default ContactsComponent;
  

const Container = styled.div`
    flex-direction: column;
    border-radius: 8px;
    align-items: center;
`;
  
const List = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin: 30px 0;
    
`;

const ContactCard = styled.div`
    background: white;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 98%;
    max-width: 1550px;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    &:nth-of-type(1) {
        background-color: #003591;
    }
`;

const Info = styled.p`
    color: #555;
    text-align: center;
    word-break: break-word;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 12px;
    font-size: 15px;
    height: 60px;
    border-radius: 8px;
    line-height: 22px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1); // sombra suave
    &:nth-of-type(1) {
        width: 220px;
    }
    &:nth-of-type(2) {
        width: 300px;
    }
    &:nth-of-type(3) {
        width: 140px;
    }
    &:nth-of-type(4) {
        width: 200px;
    }
    &:nth-of-type(5) {
        width: 130px;
    }
    &:nth-of-type(6) {
        width: 220px;
    }
    span{
        width: 100%;
        height: 100%;
        font-weight: bold;
        background-color: #003591;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.8); 
    }
`;
  