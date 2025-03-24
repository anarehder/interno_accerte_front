import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function getPosts() {
    return axios.get(`${BASE_URL}/linkedin/posts`);
}

const apiService = { getPosts }

export default apiService;