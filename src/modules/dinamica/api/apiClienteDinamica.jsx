import { createApiClient } from "../../../shared/api/apiClientFactory";

const ruta = (window.API_URL && !window.API_URL.startsWith("__")) ? window.API_URL : "http://localhost:8100";

const apiClienteDinamica = createApiClient(`${ruta}/api-dinamica/`);

export default apiClienteDinamica;