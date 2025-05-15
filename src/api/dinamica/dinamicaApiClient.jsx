import axios from "axios";

import { RUTA_BACK_PRODUCCION } from "../../types";

const dinamicaApiClient = axios.create({
    baseURL: `${RUTA_BACK_PRODUCCION}`,
});

dinamicaApiClient.interceptors.request.use((config) =>{
    const token = localStorage.getItem('tokenhusjp');
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default dinamicaApiClient;