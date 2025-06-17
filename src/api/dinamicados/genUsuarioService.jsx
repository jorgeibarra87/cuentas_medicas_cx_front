import apiClienteDinamicados from "./apiClienteDinamicados";

export const obtenerInfoGenUsuario = async (username) => {
    try {
        const response = await apiClienteDinamicados.get(`/genusuario/info/${username}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener la información del usuario', error);
        throw error;
    }
}