import apiClienteAnexo1 from "./apiClienteAnexo1";

export const listarTodos = async () => {
  const res = await apiClienteAnexo1.get("/egresos");
  return res.data;
};

export const obtenerPorTramiteId = async (tramiteId) => {
  const res = await apiClienteAnexo1.get(`/egresos/tramite/${tramiteId}`);
  return res.data;
};

export const crear = async (data) => {
  const res = await apiClienteAnexo1.post("/egresos", data);
  return res.data;
};

export const actualizar = async (id, data) => {
  const res = await apiClienteAnexo1.put(`/egresos/${id}`, data);
  return res.data;
};
