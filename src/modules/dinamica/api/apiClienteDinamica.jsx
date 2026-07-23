import { createApiClient } from "../../../shared/api/apiClientFactory";

const rutaDinamica = (window.env?.VITE_URL_DINAMICA_BASE) ? window.env.VITE_URL_DINAMICA_BASE : "http://dev.soluciones.local/api-dinamica/";

const apiClienteDinamica = createApiClient(rutaDinamica)

export default apiClienteDinamica;