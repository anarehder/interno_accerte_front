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

function criarVersao(body){
    return axios.post(`${BASE_URL}/certificados/criar/versao`, body)
}

const apiServiceCertificacoes = { criarEmissor, buscarEmissor, criarNivel, buscarNivel, criarCertificacao, buscarCertificacao, criarVersao }

export default apiServiceCertificacoes;