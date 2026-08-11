import axios from "axios";

const BUCKET_URL = import.meta.env.VITE_OCI_BUCKET;
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function uploadFile(file, fileName) {
    return axios.put(`${BUCKET_URL}${fileName}`, file, {
        headers: {
            "Content-Type": file.type || "application/octet-stream",
        },
    });
}

function getFileUrl(fileName) {
    return `${BUCKET_URL}${fileName}`;
}

function buscarArquivosCloud(body){
    return axios.post(`${BASE_URL}/arquivos-cloud/buscar`, body)
}

function buscarArquivosCloudPorGrupo(grupo, body){
    return axios.post(`${BASE_URL}/arquivos-cloud/buscar/grupo/${grupo}`, body)
}

function criarArquivoCloud(body){
    return axios.post(`${BASE_URL}/arquivos-cloud/criar`, body)
}

function editarArquivoCloud(id, body){
    return axios.post(`${BASE_URL}/arquivos-cloud/editar/${id}`, body)
}

function deletarArquivoCloud(id, body){
    return axios.delete(`${BASE_URL}/arquivos-cloud/deletar/${id}`, {
        data: body
    })
}

function buscarComunicadosTodos(body){
    return axios.post(`${BASE_URL}/comunicados/todos`, body)
}

const apiServiceBucket = { uploadFile, getFileUrl, buscarArquivosCloud, buscarArquivosCloudPorGrupo, criarArquivoCloud, editarArquivoCloud, deletarArquivoCloud, buscarComunicadosTodos };

export default apiServiceBucket;
