import axios from "axios";
import { RUTA_BACK_PRODUCCION } from "../../types";

const apiClienteMonitorizacionHc = axios.create({
    baseURL: `http://optimus:8100/api-monitorizacionhc/`,
});

apiClienteMonitorizacionHc.interceptors.request.use((config) =>{
    const token = localStorage.getItem('tokendos');
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default apiClienteMonitorizacionHc;