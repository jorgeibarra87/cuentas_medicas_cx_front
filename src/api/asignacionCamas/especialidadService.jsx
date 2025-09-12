import apiClienteAsignacionCamas from "./apiClienteAsignacionCamas";

export const obtenerEspecialidades = async () => {
    try {
        const response = await apiClienteAsignacionCamas.get('titulosFormacionAcademica/especialidad');
        return response.data;
    }catch(error) {
        console.error('Error al obtener las especialidades', error);
        throw error;
    }
}