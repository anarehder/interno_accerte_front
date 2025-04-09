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

const apiService = { getPosts, createUser, editUser, getVacation}

export default apiService;