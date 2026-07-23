import axios from "axios";

const rutaDinamica = (window.env?.VITE_URL_DINAMICA_BASE) ? window.env.VITE_URL_DINAMICA_BASE : "http://dev.soluciones.local/api-dinamica/";

const apiClienteDinamicaPublica = axios.create({
  baseURL: rutaDinamica,
  headers: {
    'X-Public-Route': 'true',
  }
});

export default apiClienteDinamicaPublica;
