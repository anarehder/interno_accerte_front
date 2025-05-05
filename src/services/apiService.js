import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
// console.log(BASE_URL);

function getPosts() {
    return axios.get(`${BASE_URL}/linkedin/posts`);
}

function createUser(body) {
    return axios.post(`${BASE_URL}/funcionarios/criar`, body);
}

function editUser(body) {
    return axios.post(`${BASE_URL}/funcionarios/editar`, body);
}

function getVacation(email) {
    return axios.get(`${BASE_URL}/ferias/filtros/email?email=${email}`);
}

function getEscala(){
    return axios.get(`${BASE_URL}/escala`)
}

function createEscala(body){
    return axios.post(`${BASE_URL}/escala/criar`, body)
}

function editScale(body){
    return axios.post(`${BASE_URL}/escala/editar`, body)
}

function createVacation(body){
    return axios.post(`${BASE_URL}/ferias/criar`, body)
}

function createLicense(body){
    return axios.post(`${BASE_URL}/escala/licencas`, body)
}

function getVacationByPeriod(inicio, fim){
    return axios.get(`${BASE_URL}/ferias/filtros/periodo?inicio=${inicio}&fim=${fim}`)
}

function getVacationByEmail(email){
    return axios.get(`${BASE_URL}/ferias/filtros/email?email=${email}`)
}

function getVacationByContract(tipoContrato){
    return axios.get(`${BASE_URL}/ferias/filtros/contrato?contrato=${tipoContrato}`)
}

function getVagasInfo(){
    return axios.get(`${BASE_URL}/vagas`)
}

function createVagas(body){
    return axios.post(`${BASE_URL}/vagas/criar`, body)
}

function getVagas(body){
    return axios.post(`${BASE_URL}/vagas/buscar`, body)
}

function getFullVagas(body){
    return axios.post(`${BASE_URL}/vagas/buscar/completo`, body)
}

const apiService = { getPosts, createUser, editUser, getVacation, getEscala, createEscala, editScale, createVacation, createLicense, getVacationByPeriod, getVacationByEmail, getVacationByContract, getVagasInfo, createVagas, getVagas, getFullVagas}

export default apiService;