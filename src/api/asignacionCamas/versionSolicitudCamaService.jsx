import apiClienteAsignacionCamas from "./apiClienteAsignacionCamas";

export const guardarVersionSolicitudCama = async (versionSolicitudCama) => {
    try {
        const response = await apiClienteAsignacionCamas.post('versionSolicitudCama', versionSolicitudCama);
        return response.data;
    } catch (error) {
        console.error("Error al guardar la versión de solicitud de cama:", error);
        throw error;
    }
}

export const obtenerVersionesSolicitudCamaActivasByIdBloque = async (idBloque) => {
    try {
        const response = await apiClienteAsignacionCamas.get(`versionSolicitudCama/active/${idBloque}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener las versiones de solicitud de cama por ID de bloque:", error);
        throw error;
    }
}

export const cambiarEstadoFacturacionVersionSolicitudCama = async (idVersion) => {
    try {
        const response = await apiClienteAsignacionCamas.put(`versionSolicitudCama/${idVersion}/estadoAutorizacionFacturacion`);
        return response.data;
    } catch (error) {
        console.error("Error al cambiar el estado de facturación de la versión de solicitud de cama:", error);
        throw error;
    }
}

export const modificarVersionSolicitudCama = async (versionSolicitudCamaId, versionSolicitudCama) => {
    try {
        const response = await apiClienteAsignacionCamas.put(`versionSolicitudCama/${versionSolicitudCamaId}`, versionSolicitudCama);
        return response.data;
    } catch (error) {
        console.error("Error al modificar la versión de solicitud de cama:", error);
        throw error;
    }
}