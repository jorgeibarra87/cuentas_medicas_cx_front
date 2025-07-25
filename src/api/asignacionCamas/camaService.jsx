import apiClienteAsignacionCamas from "./apiClienteAsignacionCamas";

export const obtenerCamasPorServicio = async (servicioId) => {
    try {
        const response = await apiClienteAsignacionCamas.get(`/cama/${servicioId}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener las camas por servicio:", error);
        throw error;
    }
}