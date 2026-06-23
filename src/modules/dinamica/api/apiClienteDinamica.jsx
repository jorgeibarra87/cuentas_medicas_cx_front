import { createApiClient } from "../../../shared/api/apiClientFactory";

 const ruta = import.meta.envVITE_URL_API_GATEWAY
 const rutamicroservicioDinamica = import.meta.envVITE_URL_DINAMICA

const apiClienteDinamica = createApiClient(`${ruta}${rutamicroservicioDinamica}/`)

export default apiClienteDinamica;