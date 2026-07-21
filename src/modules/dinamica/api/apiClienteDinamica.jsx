import { createApiClient } from "../../../shared/api/apiClientFactory";
window.API_URL= "http://soluciones.local";
//const ruta = (window.API_URL && !window.API_URL.startsWith("__")) ? window.API_URL : "http://dev.soluciones.local";
const ruta = (window.API_URL && !window.API_URL.startsWith("__")) ? window.API_URL : "http://soluciones.local";

const apiClienteDinamica = createApiClient(`${ruta}/api-dinamica/`)

export default apiClienteDinamica;