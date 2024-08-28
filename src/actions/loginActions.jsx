import { CERRAR_SESION, INICIAR_SESION, OBTENER_DECODE_TOKEN, OBTENER_TOKEN, OBTENER_USERNAME } from "../types";

export const iniciarSesionAction = (data) => ({type: INICIAR_SESION, payload: data});
export const obtenerToken = () => ({type: OBTENER_TOKEN});
export const obtenerDecodeToken = () => ({type: OBTENER_DECODE_TOKEN});
export const cerrarSesionAction = () => ({type: CERRAR_SESION});
export const obtenerUsername = () => ({type: OBTENER_USERNAME});