import apiClientCirugias from "./apiClienteCirugias";

const convertirFechaAFechaCargue = (fecha) => {
    if (!fecha) return fecha;
    if (fecha.includes('/')) return fecha;
    try {
        const parts = fecha.split('-');
        if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
    } catch (e) {}
    return fecha;
};

export const importarCirugias = async (rangoFechas) => {
    try {
        const response = await apiClientCirugias.post('/cirugias/importar/bd', null, {
            params: { fechaInicio: rangoFechas.split(' - ')[0], fechaFin: rangoFechas.split(' - ')[1] }
        });
        return response.data;
    } catch (error) {
        console.error('Error al importar cirugías', error);
        throw error;
    }
}

export const obtenerCirugiasPageable = async (fechaInicio, fechaFin, page, size) => {
    try {
        const params = { page, size };
        if (fechaInicio) params.fechaInicio = convertirFechaAFechaCargue(fechaInicio);
        if (fechaFin) params.fechaFin = convertirFechaAFechaCargue(fechaFin);
        const response = await apiClientCirugias.get('/cirugias', { params });
        return response.data;
    } catch (error) {
        console.error('Error al obtener cirugías', error);
        throw error;
    }
}

export const obtenerCirugias = async () => {
    try {
        const response = await apiClientCirugias.get('/cirugias');
        return response.data;
    } catch (error) {
        console.error('Error al obtener cirugías', error);
        throw error;
    }
}

export const actualizarCirugia = async (id, cirugiaData) => {
    try {
        const response = await apiClientCirugias.put(`/cirugias/${id}`, cirugiaData);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar la cirugía', error);
        throw error;
    }
}

export const obtenerCirugiaPorId = async (id) => {
    try {
        const response = await apiClientCirugias.get(`/cirugias/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener la cirugía', error);
        throw error;
    }
}