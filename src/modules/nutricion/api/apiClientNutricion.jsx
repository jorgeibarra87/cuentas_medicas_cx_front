import { createApiClient } from "../../../shared/api/apiClientFactory";

const ruta = (window.API_URL && !window.API_URL.startsWith("__")) ? window.API_URL : "http://localhost:8100";;

const apiClientNutricion = createApiClient(`${ruta}/api-nutricion/`);

export default apiClientNutricion;