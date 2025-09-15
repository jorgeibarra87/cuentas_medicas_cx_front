import apiClienteAsignacionCamas from "./apiClienteAsignacionCamas";

export const obtenerMedidasAislamiento = async () => {
    try {
        const response = await apiClienteAsignacionCamas.get('medidasAislamiento');
        return response.data;
    } catch (error) {
        console.error('Error al obtener las medidas de aislamiento', error);
        throw error;
    }
}