import axios from "axios";
// IMPORTAR CLAVES ENV DE VITE 
 const ruta = import.meta.envVITE_URL_API_GATEWAY
 const rutamicroservicioauth = import.meta.envVITE_URL_AUTH

 const apiClientAuthServicePublic = axios.create({
    baseURL: `${ruta}${rutamicroservicioauth}/`,
    headers: {
        'X-Public-Route': 'true',
    },
 });

 export default apiClientAuthServicePublic;