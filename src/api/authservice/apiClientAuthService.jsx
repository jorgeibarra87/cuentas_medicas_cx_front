import axios from "axios";
// IMPORTAR CLAVES ENV DE VITE 
 const ruta = window.env.VITE_URL_API_GATEWAY
 const rutamicroservicioauth = window.env.VITE_URL_AUTH

const apiClientAuthService = axios.create({
    baseURL: `${ruta}${rutamicroservicioauth}/`,
})

apiClientAuthService.interceptors.request.use((config) => {
    const token = localStorage.getItem('tokenhusjp');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}
, (error) => {
    return Promise.reject(error);
});

export default apiClientAuthService;