import axios from "axios";

 const ruta = window.env.VITE_URL_API_GATEWAY
 const rutamicroserviciomonitorizacionhc = window.env.VITE_URL_MONITORIZACION


const apiClienteMonitorizacionHc = axios.create({
    baseURL: `${ruta}${rutamicroserviciomonitorizacionhc}/`,
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