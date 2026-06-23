import axios from "axios";
import { createApiClient } from "../../../shared/api/apiClientFactory";

const ruta = import.meta.envVITE_URL_API_GATEWAY;
const rutaMicroservicioRehabilitacion = import.meta.envVITE_URL_REHABILITACION;

const apiClientRehabilitacion = createApiClient(`${ruta}${rutaMicroservicioRehabilitacion}`);

export default apiClientRehabilitacion;