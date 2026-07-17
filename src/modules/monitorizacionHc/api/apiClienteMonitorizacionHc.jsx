import { createApiClient } from "../../../shared/api/apiClientFactory";

const ruta = (window.API_URL && !window.API_URL.startsWith("__")) ? window.API_URL : "http://dev.soluciones:8100";;

const apiClienteMonitorizacionHc = createApiClient(`${ruta}/api-monitorizacion/`);

export default apiClienteMonitorizacionHc;