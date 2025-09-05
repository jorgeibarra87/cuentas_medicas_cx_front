import axios from "axios";

const ruta = window.env.VITE_URL_API_GATEWAY;
const rutaMicroservicioRehabilitacion = window.env.VITE_URL_REHABILITACION;

const apiClientRehabilitacion = axios.create({
  baseURL: ruta + rutaMicroservicioRehabilitacion,
});

export default apiClientRehabilitacion;