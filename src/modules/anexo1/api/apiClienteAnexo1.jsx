import axios from "axios";

const ruta = (window.API_URL && !window.API_URL.startsWith("__")) ? window.API_URL : "http://dev.soluciones.local";

const apiClienteAnexo1 = axios.create({
  baseURL: `${ruta}/api-referencia/`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClienteAnexo1.interceptors.request.use((config) => {
  const token = localStorage.getItem("tokenhusjp");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let refreshQueue = [];

apiClienteAnexo1.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error?.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({
          resolve: (newToken) => {
            original._retry = true;
            original.headers.Authorization = `Bearer ${newToken}`;
            resolve(apiClienteAnexo1(original));
          },
          reject,
        });
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem("tokenhusjp_refresh");
      if (!refreshToken) {
        localStorage.removeItem("tokenhusjp");
        localStorage.removeItem("tokenhusjp_refresh");
        window.location.hash = "#/login";
        return Promise.reject(error);
      }

      const { data } = await axios.post(`${ruta}api/proxy/refresh`, { refreshToken });

      const newToken = data?.jwt;
      if (!newToken) throw new Error("No se recibió nuevo token");

      localStorage.setItem("tokenhusjp", newToken);
      if (data?.refreshToken) {
        localStorage.setItem("tokenhusjp_refresh", data.refreshToken);
      }

      refreshQueue.forEach(({ resolve }) => resolve(newToken));
      refreshQueue = [];

      original.headers.Authorization = `Bearer ${newToken}`;
      return apiClienteAnexo1(original);
    } catch (refreshErr) {
      refreshQueue.forEach(({ reject }) => reject(refreshErr));
      refreshQueue = [];
      localStorage.removeItem("tokenhusjp");
      localStorage.removeItem("tokenhusjp_refresh");
      window.location.hash = "#/login";
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClienteAnexo1;
