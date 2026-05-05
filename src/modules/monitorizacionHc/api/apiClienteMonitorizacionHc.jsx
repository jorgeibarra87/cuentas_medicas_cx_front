import { createApiClient } from "../../../shared/api/apiClientFactory";

const ruta = window.env.VITE_URL_API_GATEWAY;
const micro = window.env.VITE_URL_MONITORIZACION;

const apiClienteMonitorizacionHc = createApiClient(`${ruta}${micro}/`);

export default apiClienteMonitorizacionHc;