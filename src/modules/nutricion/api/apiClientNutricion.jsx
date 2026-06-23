import { createApiClient } from "../../../shared/api/apiClientFactory";

const ruta = import.meta.envVITE_URL_API_GATEWAY;
const rutamicroservicionutricion = import.meta.envVITE_URL_NUTRICION;

const apiClientNutricion = createApiClient(`${ruta}${rutamicroservicionutricion}/`);

export default apiClientNutricion;