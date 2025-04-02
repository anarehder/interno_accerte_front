import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
console.log(BASE_URL);
function getPosts() {
    // console.log(`${BASE_URL}/linkedin/posts`);
    return axios.get(`${BASE_URL}/linkedin/posts`);
}

const apiService = { getPosts }

export default apiService;