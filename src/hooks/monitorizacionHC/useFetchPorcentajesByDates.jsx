import { useState } from "react";
import { obtenerPorcentajesPorFechas } from "../../api/monitorizacionHc/porcentajesService";

const useFetchPorcentajesByDates = () => {

    const [porcentajes, setPorcentajes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPorcentajesByDates = async (fechaDesde, fechaHasta) => {
        setLoading(true);
        setError(null);
        try {
            const porcentajesData = await obtenerPorcentajesPorFechas(fechaDesde, fechaHasta);
            setPorcentajes(porcentajesData);
        } catch (error) {
            setError('Error al obtener los porcentajes por fechas',error);
        } finally {
            setLoading(false);
        }
    }

    return { porcentajes, loading, error, fetchPorcentajesByDates };
}

export default useFetchPorcentajesByDates;