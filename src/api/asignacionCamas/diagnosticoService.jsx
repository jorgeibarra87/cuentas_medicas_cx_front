import apiClienteAsignacionCamas from "./apiClienteAsignacionCamas";

export const obtenerDiagnosticos = async (input) => {
    try {
        const response = await apiClienteAsignacionCamas.get(`diagnostico/${input}`);
        return response.data;
    }catch (error) {
        console.error("Error al obtener los diagnósticos:", error);
        throw error;
    }
};