import Pregunta from "../../models/monitorizacionHc/Pregunta";
import apiClienteMonitorizacionHc from "./apiClienteMonitorizacionHc";

export const obtenerPreguntasServicio = async (idServicio) => {
    try {
        const response = await apiClienteMonitorizacionHc.get(`/api/monitorizacionhc/preguntas/${idServicio}`)
        const preguntas = response.data.preguntas.map(pregunta => new Pregunta(pregunta));
        return preguntas;
    } catch (error) {
        console.error('Error al obtener las preguntas de monitorizacion microservice',error);
        throw error;
    }
}