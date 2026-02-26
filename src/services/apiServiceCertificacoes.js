import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function criarEmissor(body){
    return axios.post(`${BASE_URL}/certificados/criar/emissor`, body)
}

function buscarEmissor(body){
    return axios.post(`${BASE_URL}/certificados/buscar/emissor`, body)
}

function criarNivel(body){
    return axios.post(`${BASE_URL}/certificados/criar/niveis`, body)
}

function buscarNivel(body){
    return axios.post(`${BASE_URL}/certificados/buscar/niveis`, body)
}

function criarCertificacao(body){
    return axios.post(`${BASE_URL}/certificados/criar/certificacao`, body)
}

function buscarCertificacao(body){
    return axios.post(`${BASE_URL}/certificados/buscar/certificacao`, body)
}

function buscarCertificacaoPorEmissor(emissorId, body){
    return axios.post(`${BASE_URL}/certificados/buscar/certificacao/${emissorId}`, body)
}

function criarCertFunc(body){
    return axios.post(`${BASE_URL}/certificados/criar/funcionariocert`, body)
}

function buscarListaCertsNiveis(body){
    return axios.post(`${BASE_URL}/certificados/lista/niveis`, body)
}

function buscarListaCertsNiveisEmissor(body, emissorId){
    return axios.post(`${BASE_URL}/certificados/lista/niveis/emissor/${emissorId}`, body)
}

function buscarTop3Geral(body){
    return axios.post(`${BASE_URL}/certificados/top3/all`, body)
}

function buscarListaFuncCerts(body){
    return axios.post(`${BASE_URL}/certificados/lista/funcionarios`, body)
}

function editarStatus(body){
    return axios.post(`${BASE_URL}/certificados/editar/certificacao/status`, body)
}

function buscarListaValores(body){
    return axios.post(`${BASE_URL}/certificados/lista/agrupada`, body)
}

function editarCertificacao(body, id){
    return axios.post(`${BASE_URL}/certificados/editar/certificacao/id/${id}`, body)
}

function buscarCertificacaoPorId(id){
    return axios.get(`${BASE_URL}/certificados/buscar/certificacao/id/${id}`)
}

function editarCertificacaoFuncionario(body, id){
    return axios.post(`${BASE_URL}/certificados/editar/funcionariocert/id/${id}`, body)
}

function buscarCertificacaoFuncionarioPorId(id){
    return axios.get(`${BASE_URL}/certificados/buscar/funcionariocert/id/${id}`)
}

const apiServiceCertificacoes = { criarEmissor, buscarEmissor, criarNivel, buscarNivel, criarCertificacao, buscarCertificacao, buscarCertificacaoPorEmissor, criarCertFunc, buscarListaCertsNiveis, buscarListaCertsNiveisEmissor, buscarTop3Geral, buscarListaFuncCerts, editarStatus, buscarListaValores, editarCertificacao, editarCertificacaoFuncionario, buscarCertificacaoPorId, buscarCertificacaoFuncionarioPorId }

export default apiServiceCertificacoes;