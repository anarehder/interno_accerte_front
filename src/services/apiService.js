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

function getVacationAreaByPeriod(inicio, fim, body){
    return axios.post(`${BASE_URL}/ferias/filtros/periodo?inicio=${inicio}&fim=${fim}`, body)
}

function getVacationAreaByEmail(email, body){
    return axios.post(`${BASE_URL}/ferias/filtros/email?email=${email}`, body)
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

function editarVagaStatus(body){
    return axios.post(`${BASE_URL}/vagas/editar/status`, body)
}

function getSugestoes(){
    return axios.get(`${BASE_URL}/sugestoes`)
}

function criarSugestoes(body){
    return axios.post(`${BASE_URL}/sugestoes/criar`, body)
}

function getOnCallsPagerDuty(){
    return axios.get(`${BASE_URL}/pagerduty/oncalls`)
}

function getEscalaPagerDuty(params){
    return axios.get(`${BASE_URL}/pagerduty/escala?${params}`)
}

function getAniversariosDia(){
    return axios.get(`${BASE_URL}/funcionarios/aniversarios`);
}

function criarHumor(body){
    return axios.post(`${BASE_URL}/humor/`, body)
}

function buscarHumorArea(body){
    return axios.post(`${BASE_URL}/humor/area`, body)
}

function buscarHumorFuncionario(body){
    return axios.post(`${BASE_URL}/humor/funcionario`, body)
}

function buscarGestoresInfo(){
    return axios.get(`${BASE_URL}/funcionarios/gestores`)
}

function buscarInfoCriarFunc(){
    return axios.get(`${BASE_URL}/funcionarios/criarinfo`)
}

function editarVacation(body){
    return axios.post(`${BASE_URL}/ferias/editar`, body)
}

function approveVacation(body){
    return axios.post(`${BASE_URL}/ferias/aprovar`, body)
}

function deleteVacation(body){
    return axios.post(`${BASE_URL}/ferias/delete`, body)
}

function buscarFeriasGestor(body){
    return axios.post(`${BASE_URL}/ferias/analise/gestor`, body)
}

function buscarFeriasRH(body){
    return axios.post(`${BASE_URL}/ferias/analise/rh`, body)
}

function concluirFerias(id){
    return axios.get(`${BASE_URL}/ferias/concluir/${id}`)
}

function buscarNotificacoes(body){
    return axios.post(`${BASE_URL}/notificacoes`, body)
}

function buscarComunicadosHoje(body){
    return axios.post(`${BASE_URL}/comunicados/hoje`, body)
}

function buscarComunicadosEmail(body){
    return axios.post(`${BASE_URL}/comunicados`, body)
}

function criarComunicados(body){
    return axios.post(`${BASE_URL}/comunicados/criar`, body)
}

function confirmarLeituraComunicado(body){
    return axios.post(`${BASE_URL}/comunicados/confirmar/`, body)
}

function buscarFuncionarioPorArea(body){
    return axios.post(`${BASE_URL}/funcionarios/atuais/area`, body)
}

function buscarFuncionarioAtivo(){
    return axios.get(`${BASE_URL}/funcionarios/atuais`, )
}

const apiService = { getPosts, createUser, editUser, getVacation, getEscala, createEscala, editScale, createVacation, createLicense, getVacationByPeriod, getVacationByEmail, getVacationByContract, getVagasInfo, createVagas, getVagas, getFullVagas, getSugestoes, criarSugestoes, getOnCallsPagerDuty, getEscalaPagerDuty, editarVagaStatus, getAniversariosDia, criarHumor, buscarHumorArea, buscarHumorFuncionario, buscarGestoresInfo, buscarInfoCriarFunc, editarVacation, approveVacation, deleteVacation, buscarFeriasGestor, buscarFeriasRH, concluirFerias, buscarNotificacoes, buscarComunicadosHoje, buscarComunicadosEmail, criarComunicados, confirmarLeituraComunicado, buscarFuncionarioPorArea, getVacationAreaByPeriod,getVacationAreaByEmail, buscarFuncionarioAtivo }

export default apiService;