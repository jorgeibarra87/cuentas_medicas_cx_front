import dinamicaApiClient from './dinamicaApiClient';
import AdnIngreso from '../../models/dinamica/AdnIngreso';

export const obtenerAdnIngreso = async (idAdnIngreso) => {
    try {
        const response = await dinamicaApiClient.get(`/dinamica/api/adnIngreso/GenPacien/${idAdnIngreso}`);
        return new AdnIngreso(response.data);
    }catch (error) {
        console.error('Error al obtener el adnIngreso',error);
        throw error;
    }
}