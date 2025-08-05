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

const apiServiceCertificacoes = { criarEmissor, buscarEmissor, criarNivel, buscarNivel, criarCertificacao, buscarCertificacao, buscarCertificacaoPorEmissor, criarCertFunc, buscarListaCertsNiveis, buscarListaCertsNiveisEmissor, buscarTop3Geral }

export default apiServiceCertificacoes;