import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function criarEmissor(body){
    return axios.post(`${BASE_URL}/certificados/criar/emissor`, body)
}

function criarNivel(body){
    return axios.post(`${BASE_URL}/certificados/criar/niveis`, body)
}

function criarCertificacao(body){
    return axios.post(`${BASE_URL}/certificados/criar/certificacao`, body)
}

function criarVersao(body){
    return axios.post(`${BASE_URL}/certificados/criar/versao`, body)
}

const apiServiceCertificacoes = { criarEmissor, criarNivel, criarCertificacao, criarVersao }

export default apiServiceCertificacoes;