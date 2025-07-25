import apiClienteDinamicados from "./apiClienteDinamicados";

export const obtenerEstadoDeCamas = async (codigosCamas) => {
    try {
        const response = await apiClienteDinamicados.post(`hpndefcam/obetenerEstadoCamaPorCodigos`, codigosCamas);
        return response.data;
    } catch (error) {
        console.error('Error al obtener el estado de las camas:', error);
        throw error;
    }
};