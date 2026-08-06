import apiClientCirugias from "./apiClienteCirugias";

export const obtenerReporteAnual = async (anio = '2026') => {
    try {
        const response = await apiClientCirugias.get('/cirugias/reporte', {
            params: { anio }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener reporte', error);
        throw error;
    }
}
