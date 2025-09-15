import { createApiClient } from "../apiClientFactory";

const ruta = window.env.VITE_URL_API_GATEWAY;
const rutamicroservicioasignacioncamas = window.env.VITE_URL_ASIGNACION_CAMAS;

const apiClienteAsignacionCamas = createApiClient(`${ruta}${rutamicroservicioasignacioncamas}/`);

export default apiClienteAsignacionCamas;