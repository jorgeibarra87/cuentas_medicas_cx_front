import axios from "axios";

const apiClienteSistemas = axios.create({
    baseURL: `http://optimus:8100/microservice-sistemas/`,
});

apiClienteSistemas.interceptors.request.use((config) => {
    const token = localStorage.getItem('tokendos');
    if (token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default apiClienteSistemas;