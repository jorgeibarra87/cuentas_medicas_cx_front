import apiClienteDinamicados from "./apiClienteDinamicados"

export const obtenerTamizajes = async (fechas) => {
    try {
        const response = await apiClienteDinamicados.get(`/nutricion/tamizaje/patients?${fechas}`)
        return response.data;
    }
    catch (error) {
        console.error('Error al obtener los tamizajes:', error);
        throw error;
    }
};