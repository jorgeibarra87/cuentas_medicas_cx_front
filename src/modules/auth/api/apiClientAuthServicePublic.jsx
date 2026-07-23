import axios from "axios";
// IMPORTAR CLAVES ENV DE VITE 
const ruta = (window.API_URL && !window.API_URL.startsWith("__")) ? window.API_URL : "http://dev.soluciones.local";

 const apiClientAuthServicePublic = axios.create({
    baseURL: `${ruta}/api-auth/`,
    headers: {
        'X-Public-Route': 'true',
    },
 });

 export default apiClientAuthServicePublic;