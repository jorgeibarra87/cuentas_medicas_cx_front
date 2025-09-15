import apiClienteAsignacionCamas from "./apiClienteAsignacionCamas";

export const cancelarSolicitudCama = async (idSolicitudCama, motivo) => {
    try {
        const response = await apiClienteAsignacionCamas.put(`/solicitudCama/cancelar/${idSolicitudCama}`,  null, { params: { motivo } });
        return response.data;
    } catch (error) {
        console.error("Error al cancelar la solicitud de cama:", error);
        throw error;
    }
}

export const obtenerServiciosByBloqueId = async (bloqueId) => {
    try {
        const response = await apiClienteAsignacionCamas.get(`/servicio/${bloqueId}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener los servicios por bloque:", error);
        throw error;
    }
} 