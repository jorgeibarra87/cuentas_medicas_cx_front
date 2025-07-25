import apiClienteDinamicados from "./apiClienteDinamicados";

export const obtenerInformacionPacienteHospitalizadoByIdentificacion = async (identificacion) => {
    try {
        const response = await apiClienteDinamicados.get(`/pacienteHospitalizado/infoIngresoServicioCama/${identificacion}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}