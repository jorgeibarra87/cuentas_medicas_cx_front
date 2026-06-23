import { createApiClient } from "../../../shared/api/apiClientFactory";
// IMPORTAR CLAVES ENV DE VITE 
 const ruta = import.meta.envVITE_URL_API_GATEWAY
 const rutamicroservicioauth = import.meta.envVITE_URL_AUTH

const apiClientAuthService = createApiClient(`${ruta}${rutamicroservicioauth}/`);

export default apiClientAuthService;