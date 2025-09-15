import apiClienteAsignacionCamas from "./apiClienteAsignacionCamas";

export const guardarVersionSolucitudCama = async (data) => {
    try {
        const response = await apiClienteAsignacionCamas.post('asignacionVersionSolicitudCama', data);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const obtenerVersionSolicitudCamaByIdBloque = async (idBloque) => {
    try {
        const response = await apiClienteAsignacionCamas.get(`asignacionVersionSolicitudCama/active/${idBloque}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const modificarVersionAginacionSolicitudCama = async (idVerAsigSolCama, data) => {
    try {
        const response = await apiClienteAsignacionCamas.put(`asignacionVersionSolicitudCama/${idVerAsigSolCama}`, data);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};