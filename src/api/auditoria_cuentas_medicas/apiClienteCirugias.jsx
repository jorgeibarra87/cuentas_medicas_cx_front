import { createApiClient } from "../apiClientFactory";

const ruta = window.env.VITE_URL_API_GATEWAY;
const micro = window.env.VITE_URL_CIRCUGIAS;

const apiClientCirugias = createApiClient(`${ruta}${micro}/`);

export default apiClientCirugias;