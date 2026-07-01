import axios from "axios";
import { createApiClient } from "../../../shared/api/apiClientFactory";

const ruta = (window.API_URL && !window.API_URL.startsWith("__")) ? window.API_URL : "http://localhost:8100";;
const rutaMicroservicioRehabilitacion = import.meta.env.VITE_URL_REHABILITACION;

const apiClientRehabilitacion = createApiClient(`${ruta}${rutaMicroservicioRehabilitacion}`);

export default apiClientRehabilitacion;