/** 

const url_base = "http://192.168.16.160:8050";

const apiClienteMonitorizacionHc = axios.create({
    baseURL: `${url_base}`,
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
*/

import axios from "axios";

const url_base = "http://optimus:8009";

const username = "1061784598";
const password = "x9yclFFw8Elj3SR4AsEWmA==";

const basicAuth = `Basic ${btoa(`${username}:${password}`)}`;

const apiClienteMonitorizacionHc = axios.create({
    baseURL: url_base,
    headers: {
        Authorization: basicAuth,
    },
});


export default apiClienteMonitorizacionHc;