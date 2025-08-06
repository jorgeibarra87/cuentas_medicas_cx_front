import axios from "axios";

const ruta = window.env.VITE_URL_API_GATEWAY;
const rutamicroservicionutricion = window.env.VITE_URL_NUTRICION;

const apiClientNutricion = axios.create({
    baseURL: `${ruta}${rutamicroservicionutricion}/`,
});

apiClientNutricion.interceptors.request.use((config) => {
    const token = localStorage.getItem('tokendos');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default apiClientNutricion;
