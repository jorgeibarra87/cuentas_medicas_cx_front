import { createApiClient } from "../../../shared/api/apiClientFactory";

const ruta = (window.API_URL && !window.API_URL.startsWith("__")) ? window.API_URL : "http://localhost:8100";;
const rutamicroservicionutricion = import.meta.env.VITE_URL_NUTRICION;

const apiClientNutricion = createApiClient(`${ruta}${rutamicroservicionutricion}/`);

export default apiClientNutricion;