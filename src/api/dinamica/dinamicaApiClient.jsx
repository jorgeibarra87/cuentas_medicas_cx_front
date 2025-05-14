/** 
 * 
 
import axios from "axios";

const url_base = "http://192.168.16.160:8002";

const dinamicaApiClient = axios.create({
    baseURL: `${url_base}`,
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
 */


import axios from "axios";

const url_base = "http://192.168.16.160:8002";

// Credenciales quemadas (solo para pruebas)
const username = "1061784598";
const password = "x9yclFFw8Elj3SR4AsEWmA==";

// Codificar en Base64
const basicAuth = `Basic ${btoa(`${username}:${password}`)}`;

const dinamicaApiClient = axios.create({
    baseURL: `${url_base}`,
    headers: {
        Authorization: basicAuth,
    }
});

export default dinamicaApiClient;
