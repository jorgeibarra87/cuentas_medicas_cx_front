import apiClienteAsignacionCamas from "./apiClienteAsignacionCamas";

export const finalizarAsignacionVersionSolicitudCama = async (idVerAsigSolCama) => {
    try {
        const response = await apiClienteAsignacionCamas.put(`asignacionSolicitudCama/${idVerAsigSolCama}/estadoFinalizado`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const cancelarAsignacionVersionSolicitudCama = async (idAsigSolCama, idVersAsigCama, motivo) => {
    try {
        const response = await apiClienteAsignacionCamas.put(`asignacionSolicitudCama/${idAsigSolCama}/cancelar/motivo/${idVersAsigCama}`, null, { params: { motivo } });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};