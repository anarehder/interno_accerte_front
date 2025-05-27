function gerarFerias(admissao) {
        // Transformar a data de admissão em um objeto Date
    const [dia, mes, ano] = admissao.split('/');
    const dataAdmissao = new Date(mes + '/' + dia + '/' + ano);
    
        // Obter a data atual
    const dataAtual = new Date();
    
        // Calcular o próximo ano (ano seguinte)
    const ferias = [];
    
        // Gerar período de férias até o ano atual
    while (dataAdmissao <= dataAtual) {
        let fimFerias = new Date(dataAdmissao);
        fimFerias.setFullYear(fimFerias.getFullYear() + 1);
        fimFerias.setDate(fimFerias.getDate() - 1);
        let limiteFerias = new Date(dataAdmissao);
        limiteFerias.setFullYear(limiteFerias.getFullYear() + 2);
        limiteFerias.setDate(limiteFerias.getDate() - 45);
    
        ferias.push({
            inicio: dataAdmissao.toLocaleDateString(),
            fim: fimFerias.toLocaleDateString(),
            limite: limiteFerias.toLocaleDateString(),
        });
    
        // Incrementar a data de admissão para o próximo período
        dataAdmissao.setFullYear(dataAdmissao.getFullYear() + 1);
    }
    
    return ferias;
}

export default gerarFerias;