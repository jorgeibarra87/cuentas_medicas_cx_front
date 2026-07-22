import { createApiClient } from "../../../shared/api/apiClientFactory";
// IMPORTAR CLAVES ENV DE VITE 
const ruta = (window.API_URL && !window.API_URL.startsWith("__")) ? window.API_URL : "http://localhost:8100";

const apiClientAuthService = createApiClient(`${ruta}/api-auth/`);

export default apiClientAuthService;