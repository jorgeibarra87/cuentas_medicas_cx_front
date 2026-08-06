import apiClientCirugias from "./apiClienteCirugias";

export const obtenerEntidadesSalud = async () => {
    try {
        const response = await apiClientCirugias.get('/entidades-salud');
        return response.data;
    } catch (error) {
        console.error('Error al obtener entidades de salud', error);
        throw error;
    }
}
