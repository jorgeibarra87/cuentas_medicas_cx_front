import axios from 'axios';

const ruta = (window.API_URL && !window.API_URL.startsWith("__")) ? window.API_URL : "http://dev.soluciones:8100";;

const apiClienteSistemasPublic = axios.create({
  baseURL: `${ruta}/api-sistemas/`,
  headers: {
    'X-Public-Route': 'true',
  },
});

export default apiClienteSistemasPublic;
