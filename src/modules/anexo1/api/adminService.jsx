import apiClienteAnexo1 from './apiClienteAnexo1';
import { listarPacientes, obtenerPacientePorId, crearPaciente, actualizarPaciente, eliminarPaciente } from './pacienteService';
import { listarTramites, obtenerTramitePorId, crearTramite, actualizarTramite, eliminarTramite } from './tramiteService';
import { listarTodos as listarTiposSolicitud } from './tipoSolicitudCatalogoService';
import { listarTodos as listarSeguimientosIntra, obtenerPorId as obtenerSeguimientoIntra, crear as crearSeguimientoIntra, actualizar as actualizarSeguimientoIntra, eliminar as eliminarSeguimientoIntra } from './seguimientoIntrahospitalarioService';
import { listarTodos as listarSeguimientosAmb, obtenerPorId as obtenerSeguimientoAmb, crear as crearSeguimientoAmb, actualizar as actualizarSeguimientoAmb, eliminar as eliminarSeguimientoAmb } from './seguimientoAmbulatorioService';
import { listarTodos as listarEgresos, crear as crearEgreso, actualizar as actualizarEgreso } from './egresoService';

export const pacienteService = {
  listarTodos: listarPacientes,
  obtenerPorId: obtenerPacientePorId,
  crear: crearPaciente,
  actualizar: actualizarPaciente,
  eliminar: eliminarPaciente,
};

export const tramiteService = {
  listarTodos: listarTramites,
  obtenerPorId: obtenerTramitePorId,
  crear: crearTramite,
  actualizar: actualizarTramite,
  eliminar: eliminarTramite,
};

export const seguimientoIntraService = {
  listarTodos: listarSeguimientosIntra,
  obtenerPorId: obtenerSeguimientoIntra,
  crear: crearSeguimientoIntra,
  actualizar: actualizarSeguimientoIntra,
  eliminar: eliminarSeguimientoIntra,
};

export const seguimientoAmbService = {
  listarTodos: listarSeguimientosAmb,
  obtenerPorId: obtenerSeguimientoAmb,
  crear: crearSeguimientoAmb,
  actualizar: actualizarSeguimientoAmb,
  eliminar: eliminarSeguimientoAmb,
};

export const egresoService = {
  listarTodos: listarEgresos,
  obtenerPorId: (id) => apiClienteAnexo1.get(`/egresos/${id}`).then(r => r.data),
  crear: crearEgreso,
  actualizar: actualizarEgreso,
  eliminar: (id) => apiClienteAnexo1.delete(`/egresos/${id}`),
};

export const tipoSolicitudService = {
  listarTodos: listarTiposSolicitud,
  obtenerPorId: (id) => apiClienteAnexo1.get(`/tipos-solicitud/${id}`).then(r => r.data),
  crear: (data) => apiClienteAnexo1.post('/tipos-solicitud', data).then(r => r.data),
  actualizar: (id, data) => apiClienteAnexo1.put(`/tipos-solicitud/${id}`, data).then(r => r.data),
  eliminar: (id) => apiClienteAnexo1.delete(`/tipos-solicitud/${id}`),
};
