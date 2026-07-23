import axios from "axios";
// IMPORTAR CLAVES ENV DE VITE 
 const ruta = (window.API_URL && !window.API_URL.startsWith("__")) ? window.API_URL : "http://localhost:8100";

 const apiClientAuthServicePublic = axios.create({
    baseURL: `${ruta}api/proxy/`,
    headers: {
        'X-Public-Route': 'true',
    },
 });

 export default apiClientAuthServicePublic;