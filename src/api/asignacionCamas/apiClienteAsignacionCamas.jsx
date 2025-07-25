import axios from "axios";

const ruta = window.env.VITE_URL_API_GATEWAY;
const rutamicroservicioasignacioncamas = window.env.VITE_URL_ASIGNACION_CAMAS;

const apiClienteAsignacionCamas = axios.create({
    baseURL: `${ruta}${rutamicroservicioasignacioncamas}/`,
});

apiClienteAsignacionCamas.interceptors.request.use((config) => {
    const token = localStorage.getItem('tokendos');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default apiClienteAsignacionCamas;