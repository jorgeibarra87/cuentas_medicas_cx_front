import axios from "axios";
import attachInterceptors, { configureAuthCallbacks } from "../../api/authservice/attachInterceptors";
import { clearTokens } from "../../api/tokenStorage";
// IMPORTAR CLAVES ENV DE VITE 
 const ruta = window.env.VITE_URL_API_GATEWAY
 const rutamicroservicioauth = window.env.VITE_URL_AUTH

//const apiClientAuthService = createApiClient(`${ruta}${rutamicroservicioauth}/`);

const apiClientAuthService = axios.create({
    baseURL: ruta,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

configureAuthCallbacks({
    logout: () => {
        clearTokens();
        window.location.hash = "#/login";
    },
});

attachInterceptors(apiClientAuthService);

export default apiClientAuthService;