import apiClient from './apiClienteReferenciaContrareferencia';
import { obtenerTraslados, obtenerTrasladoPorId, guardarTraslado, actualizarTraslado } from './trasladosService';
import { obtenerCuentasMedicas, guardarCuentaMedica, actualizarCuentaMedica } from './cuentasMedicasService';
import { obtenerFacturas, guardarFactura, actualizarFactura } from './facturacionService';

export const trasladoService = {
  listarTodos: obtenerTraslados,
  obtenerPorId: obtenerTrasladoPorId,
  crear: guardarTraslado,
  actualizar: actualizarTraslado,
  eliminar: (id) => apiClient.delete(`/traslados/${id}`),
};

export const cuentaMedicaService = {
  listarTodos: obtenerCuentasMedicas,
  obtenerPorId: (id) => apiClient.get(`/cuentas-medicas/${id}`).then(r => r.data),
  crear: guardarCuentaMedica,
  actualizar: actualizarCuentaMedica,
  eliminar: (id) => apiClient.delete(`/cuentas-medicas/${id}`),
};

export const facturacionService = {
  listarTodos: obtenerFacturas,
  obtenerPorId: (id) => apiClient.get(`/facturaciones/${id}`).then(r => r.data),
  crear: guardarFactura,
  actualizar: actualizarFactura,
  eliminar: (id) => apiClient.delete(`/facturaciones/${id}`),
};
