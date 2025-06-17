import axios from "axios";

const apiClienteDinamicados = axios.create({
    baseURL: `http://optimus:8100/dinamica-microservice/`,
})

apiClienteDinamicados.interceptors.request.use((config) => {
    const token = localStorage.getItem('tokendos');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
export default apiClienteDinamicados;