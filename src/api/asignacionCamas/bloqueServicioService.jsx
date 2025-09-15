import apiClienteAsignacionCamas from "./apiClienteAsignacionCamas";

export const obtenerBloquesServicio = async () => {
    try {
        const response = await apiClienteAsignacionCamas.get('bloque-servicio');
        return response.data;
    } catch (error) {
        console.error('Error al obtener los bloques de servicio', error);
        throw error;
    }
}