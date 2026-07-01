import axios from 'axios';

const ruta = (window.API_URL && !window.API_URL.startsWith("__")) ? window.API_URL : "http://localhost:8100";;
const rutamicroservicioSistemas = import.meta.env.VITE_URL_SISTEMAS;

const apiClienteSistemasPublic = axios.create({
  baseURL: `${ruta}${rutamicroservicioSistemas}/`,
  headers: {
    'X-Public-Route': 'true',
  },
});

export default apiClienteSistemasPublic;
