import axios from "axios";

 const ruta = window.env.VITE_URL_API_GATEWAY
 const rutamicroservicioSistemas = window.env.VITE_URL_SISTEMAS

const apiClienteSistemas = axios.create({
    baseURL: `${ruta}${rutamicroservicioSistemas}/`,
});

apiClienteSistemas.interceptors.request.use((config) => {
    const token = localStorage.getItem('tokenhusjp');
    if (token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default apiClienteSistemas;