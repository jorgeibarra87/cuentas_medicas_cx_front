import AdnIngreso from '../../models/dinamica/AdnIngreso';
import apiClienteDinamica from './apiClienteDinamicados';

export const obtenerAdnIngreso = async (idAdnIngreso) => {
    try {
        const response = await apiClienteDinamica.get(`adnIngreso/GenPacien/${idAdnIngreso}`);
        return new AdnIngreso(response.data);
    }catch (error) {
        console.error('Error al obtener el adnIngreso',error);
        throw error;
    }
}