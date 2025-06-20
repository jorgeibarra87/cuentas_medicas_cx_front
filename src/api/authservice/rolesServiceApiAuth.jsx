import apiClientAuthService from "./apiClientAuthService";

export const obtenerRolesPorMicroservicio = async (nameMicroservice) => {
    try {
        const response = await apiClientAuthService.get(`rol/microservicio/${nameMicroservice}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener roles por microservicio', error);
        throw error;
    }
}