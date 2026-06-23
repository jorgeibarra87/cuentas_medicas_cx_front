import { createApiClient } from "../../../shared/api/apiClientFactory";

const ruta = import.meta.envVITE_URL_API_GATEWAY;
const micro = import.meta.envVITE_URL_REFERENCIA_CONTRAREFERENCIA;

const apiClientReferenciaContrareferencia = createApiClient(`${ruta}${micro}/`);

export default apiClientReferenciaContrareferencia;