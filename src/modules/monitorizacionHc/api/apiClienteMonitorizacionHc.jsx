import { createApiClient } from "../../../shared/api/apiClientFactory";

const ruta = import.meta.envVITE_URL_API_GATEWAY;
const micro = import.meta.envVITE_URL_MONITORIZACION;

const apiClienteMonitorizacionHc = createApiClient(`${ruta}${micro}/`);

export default apiClienteMonitorizacionHc;