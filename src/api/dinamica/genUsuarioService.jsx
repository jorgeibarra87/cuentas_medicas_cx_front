import apiClienteDinamica from "./apiClienteDinamica";

export const obtenerInfoGenUsuario = async (username) => {
    try {
        const response = await apiClienteDinamica.get(`/genusuario/info/${username}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener la información del usuario', error);
        throw error;
    }
}