import Ingreso from "../../models/monitorizacionHc/Ingreso";
import apiClienteMonitorizacionHc from "./apiClienteMonitorizacionHc";

export const guardarRespuestas = async (respuestas) => {
    try {
        const response = await apiClienteMonitorizacionHc.post('/api/monitorizacionhc/respuestas', respuestas);
        return response.data;
    }catch(error){
        console.error('Error al guardar las respuestas de monitorizacion microservice',error);
        throw error;
    }
}

export const obtenerRespuestasByIngresoId = async (ingreso) => {
    try {
        const response = await apiClienteMonitorizacionHc.get(`/api/monitorizacionhc/respuestas/obtener/${ingreso}`);
        return new Ingreso(response.data.ingreso);
    }catch(error){
        console.error('Error al obtener las respuestas de monitorizacion microservice',error);
        throw error;
    }
}