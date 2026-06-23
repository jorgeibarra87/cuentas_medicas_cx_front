import axios from 'axios';

const ruta = import.meta.envVITE_URL_API_GATEWAY;
const rutamicroservicioSistemas = import.meta.envVITE_URL_SISTEMAS;

const apiClienteSistemasPublic = axios.create({
  baseURL: `${ruta}${rutamicroservicioSistemas}/`,
  headers: {
    'X-Public-Route': 'true',
  },
});

export default apiClienteSistemasPublic;
