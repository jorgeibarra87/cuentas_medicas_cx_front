import apiClienteMonitorizacionHc from "./apiClienteMonitorizacionHc"

export const obtenerPorcentajesPorFechas = async (fechaDesde, fechaHasta) => {
    try {
        const response = await apiClienteMonitorizacionHc.get(`/porcentajes/byFechas`,{
            params: {
                fechaInicio: fechaDesde,
                fechaFin: fechaHasta,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error obteniendo porcentajes por fechas:", error);
        throw error;
    }
}
