import axios from "axios";

 const ruta = window.env.VITE_URL_API_GATEWAY
 const rutamicroservicioDinamica = window.env.VITE_URL_DINAMICA

const apiClienteDinamicados = axios.create({
    baseURL: `${ruta}${rutamicroservicioDinamica}/`,
})

apiClienteDinamicados.interceptors.request.use((config) => {
    const token = localStorage.getItem('tokenhusjp');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
export default apiClienteDinamicados;