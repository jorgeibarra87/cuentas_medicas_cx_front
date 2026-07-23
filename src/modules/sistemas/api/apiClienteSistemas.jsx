import { createApiClient } from "../../../shared/api/apiClientFactory";

const ruta = (window.API_URL && !window.API_URL.startsWith("__")) ? window.API_URL : "http://dev.soluciones.local";

const apiClienteSistemas = createApiClient(`${ruta}/api-sistemas/`);

export default apiClienteSistemas;