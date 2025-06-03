import apiClientAuthService from "./apiClientAuthService";

export const sincronizarUsuario = async (documento) => {
    try {
        const response = await apiClientAuthService.post(`usuario/sincronizar/${documento}`);
        return response.data;
    } catch (error) {
        console.error('Error al sincronizar usuario', error);
        throw error;
    }
}