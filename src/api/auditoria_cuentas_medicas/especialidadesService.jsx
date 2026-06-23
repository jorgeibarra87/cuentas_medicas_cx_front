import apiClientCirugias from "./apiClienteCirugias";

export const obtenerEspecialidades = async () => {
    try {
        const response = await apiClientCirugias.get('/especialidades');
        return response.data;
    } catch (error) {
        console.error('Error al obtener especialidades', error);
        throw error;
    }
}
