import axios from "axios";

const apiClientAuthService = axios.create({
    baseURL: `http://optimus:8100/api-auth-service/`,
})

apiClientAuthService.interceptors.request.use((config) => {
    const token = localStorage.getItem('tokendos');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}
, (error) => {
    return Promise.reject(error);
});

export default apiClientAuthService;