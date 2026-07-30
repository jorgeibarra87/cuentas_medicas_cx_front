import axios from "axios";

const ruta = (window.API_URL && !window.API_URL.startsWith("__")) ? window.API_URL : "http://localhost:8100";;

const apiClienteDinamicaPublica = axios.create({
  baseURL: `${ruta}/api-dinamica/`,
  headers: {
    'X-Public-Route': 'true',
  }
});

export default apiClienteDinamicaPublica;