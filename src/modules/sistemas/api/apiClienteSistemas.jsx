import { createApiClient } from "../../../shared/api/apiClientFactory";

 const ruta = import.meta.envVITE_URL_API_GATEWAY
 const rutamicroservicioSistemas = import.meta.envVITE_URL_SISTEMAS

const apiClienteSistemas = createApiClient(`${ruta}${rutamicroservicioSistemas}/`)

export default apiClienteSistemas;