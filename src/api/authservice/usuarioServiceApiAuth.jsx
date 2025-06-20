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

export const obtenerUsuarioPorMicroservicioPageable = async (nameMicroservice, page, size) => {
    try {
        const response = await apiClientAuthService.get(`usuario/microservicio/${nameMicroservice}`,{
            params: {
                page: page,
                size: size
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener usuario por microservicio', error);
        throw error;
    }
}

export const actualizarRolesDeUsuario = async (documento, roles) => {
    try {
        const response = await apiClientAuthService.put(`usuario/roles/${documento}`,
            {roles: roles}
        );
        return response.data;
    } catch (error) {
        console.error('Error al obtener todos los usuarios', error);
        throw error;
    }
}