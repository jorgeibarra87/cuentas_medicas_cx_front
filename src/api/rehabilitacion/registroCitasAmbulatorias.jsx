import { obtenerCitasRehabilitacionPorMedico } from "../dinamica/citasRehabilitacion";
import apiClientRehabilitacion from "./apiClientRehabilitacion";

export const registrarllegadaCitaAmbulatoria = async (body) => {
    try {
        const response = await apiClientRehabilitacion.post(`llegada`, body);
        return response.data;
    } catch (error) {
        console.error('Error al registrar la llegada de la cita ambulatoria', error);
        throw error;
    }
}

export const registrarFinalizacionCitaAmbulatoria = async (id) => {
    try {
        const response = await apiClientRehabilitacion.patch(`${id}/finalizar`);
        return response.data;
    } catch (error) {
        console.error('Error al registrar la finalización de la cita ambulatoria', error);
        throw error;
    }
}

export const registrarNoLLegadaCitaAmbulatoria = async (body) => {
    try {
        const response = await apiClientRehabilitacion.post(`nollegada`, body);
        return response.data;
    } catch (error) {
        console.error('Error al registrar la no llegada de la cita ambulatoria', error);
        throw error;
    }
}

export const obtenerCitasAmbulatoriasHoy = async () => {
    try {
        const response = await apiClientRehabilitacion.get(`hoy`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener las citas ambulatorias de hoy', error);
        throw error;
    }
}

export const obtenerCitasConsolidadas = async (verTodo = false) => {
  try {
    // 1. Llamada en paralelo a ambas fuentes
    const [citasRehab, citasAmbulatorias] = await Promise.all([
      obtenerCitasRehabilitacionPorMedico(verTodo),
      obtenerCitasAmbulatoriasHoy()
    ]);

    // 2. Creamos un Mapa de estados usando el documento como clave
    // NOTA: Si el campo en la segunda API no se llama 'documentoPaciente', cámbialo aquí.
    const mapaAmbulatorias = new Map();
    
    if (citasAmbulatorias && citasAmbulatorias.length > 0) {
      citasAmbulatorias.forEach(amb => {
        // Guardamos el estado asociado al documento
        // Si un paciente tiene varias citas, aquí se guardaría la última procesada
        mapaAmbulatorias.set(amb.documentoPaciente, amb);
      });
    }

    // 3. Cruzamos los datos con la petición principal
    const resultadoFinal = citasRehab.map(cita => {
      // Buscamos si el paciente (patientId) existe en nuestro mapa de estados
      const datosAmbulatorios = mapaAmbulatorias.get(cita.patientId);

      return {
        ...cita,
        // Prioridad: Estado de la 2da petición > "PENDIENTE_DE_LLEGADA"
        id: datosAmbulatorios ? datosAmbulatorios.id : cita.id,
        estadoSesion: datosAmbulatorios?.estadoSesion || 'PENDIENTE_DE_LLEGADA'
      };
    });

    return resultadoFinal;

  } catch (error) {
    console.error("Error al cruzar las citas:", error);
    throw error;
  }
};