import { RUTA_BACK_PRODUCCION } from "../../types";

const apiClienteMonitorizacionHc = axios.create({
    baseURL: `${RUTA_BACK_PRODUCCION}`,
});

apiClienteMonitorizacionHc.interceptors.request.use((config) =>{
    const token = localStorage.getItem('tokenhusjp');
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default apiClienteMonitorizacionHc;