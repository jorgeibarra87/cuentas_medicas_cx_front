import { createApiClient } from "../../../shared/api/apiClientFactory";

 const ruta = (window.API_URL && !window.API_URL.startsWith("__")) ? window.API_URL : "http://localhost:8100";
 const rutamicroservicioSistemas = import.meta.env.VITE_URL_SISTEMAS

const apiClienteSistemas = createApiClient(`${ruta}${rutamicroservicioSistemas}/`)

export default apiClienteSistemas;