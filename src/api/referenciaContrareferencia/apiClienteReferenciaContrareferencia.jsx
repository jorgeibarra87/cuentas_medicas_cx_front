import { createApiClient } from "../apiClientFactory";

//const ruta = window.env.VITE_URL_API_GATEWAY;
//const micro = window.env.VITE_URL_REFERENCIA_CONTRAREFERENCIA;
const ruta = "http://localhost:8082";
const micro = "";

const apiClientReferenciaContrareferencia = createApiClient(`${ruta}${micro}/`);

export default apiClientReferenciaContrareferencia;