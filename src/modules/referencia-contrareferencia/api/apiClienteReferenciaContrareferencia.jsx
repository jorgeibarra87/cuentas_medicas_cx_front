import { createApiClient } from "../../../shared/api/apiClientFactory";

const ruta = (window.API_URL && !window.API_URL.startsWith("__")) ? window.API_URL : "http://dev.soluciones.local";
const apiClientReferenciaContrareferencia = createApiClient(`${ruta}/api-referencia/`);
//const ruta = window.env.VITE_URL_API_GATEWAY;
//const micro = window.env.VITE_URL_REFERENCIA_CONTRAREFERENCIA;

//const apiClientReferenciaContrareferencia = createApiClient(`${ruta}${micro}/`);

export default apiClientReferenciaContrareferencia;