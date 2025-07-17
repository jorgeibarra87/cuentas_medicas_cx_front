import Ingreso from "../../models/monitorizacionHc/Ingreso";
import apiClienteMonitorizacionHc from "./apiClienteMonitorizacionHc";

export const guardarRespuestas = async (respuestas) => {
    try {
        const response = await apiClienteMonitorizacionHc.post('/respuestas', respuestas);
        return response.data;
    }catch(error){
        console.error('Error al guardar las respuestas de monitorizacion microservice',error);
        throw error;
    }
}

export const obtenerRespuestasByIngresoId = async (ingreso) => {
    try {
        const response = await apiClienteMonitorizacionHc.get(`/respuestas/obtener/${ingreso}`);
        return new Ingreso(response.data.ingreso);
    }catch(error){
        console.error('Error al obtener las respuestas de monitorizacion microservice',error);
        throw error;
    }
}

export const obtenerInfoRespuestasPorFechaYTipoPregunta = async (fechaInicio, fechaFin, tipoPregunta) => {
    try {
        const response = await apiClienteMonitorizacionHc.get('/respuestas/resumen-mensual', {
            params: {
                fechaInicio,
                fechaFin,
                tipoPregunta
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener las respuestas por fecha y tipo de pregunta', error);
        throw error;
    }
}

export const obtenerInfoPorRangoFechaPorProcesoServicioYTipoPregunta = async (fechaInicio, fechaFin, procesoId, servicioId, tipoPregunta) => {
    try {
        const response = await apiClienteMonitorizacionHc.get('/respuestas/porcentaje-por-grupo', {
            params: {
                fechaInicio,
                fechaFin,
                procesoId,
                servicioId,
                tipoPregunta
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener el porcentaje por grupo', error);
        throw error;
    }   
}

export const obtenerInfoCantidadesPorGrupoPorMes = async (fechaInicio, fechaFin, procesoId, servicioId, tipoPregunta) => {
    try {
        const response =  await apiClienteMonitorizacionHc.get(`/respuestas/resumen-mensual-grupo`, {
            params: {
                fechaInicio,
                fechaFin,
                procesoId,
                servicioId,
                tipoPregunta
            }
        }) 
        return response.data;     
    } catch (error) {
        console.error('Error al obtener las cantidades por grupo por mes', error);
        throw error;
    }
}

export const obtenerInfocanteidadesPorPreguntas = async (fechaInicio, fechaFin, procesoId, servicioId, tipoPregunta) => {
    try {
        const response = await apiClienteMonitorizacionHc.get('/respuestas/resumen-cantidad-si-no-noaplica-conpregunta', {
            params: {
                fechaInicio,
                fechaFin,
                procesoId,
                servicioId,
                tipoPregunta
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener las cantidades por preguntas', error);
        throw error;
    }
}