import apiClientCirugias from "./apiClienteCirugias";

export const importarCirugias = async (fechaInicio, fechaFin) => {
    try {
        const response = await apiClientCirugias.post('/cirugias/importar/bd', null, {
            params: { fechaInicio, fechaFin }
        });
        return response.data;
    } catch (error) {
        console.error('Error al importar cirugías', error);
        throw error;
    }
}

export const obtenerCirugiasPageable = async (fechaInicio, fechaFin, busqueda, tipo, entidadId, page, size) => {
    try {
        const params = { page, size };
        if (fechaInicio) params.fechaInicio = fechaInicio;
        if (fechaFin) params.fechaFin = fechaFin;
        if (busqueda) params.busqueda = busqueda;
        if (tipo) params.tipo = tipo;
        if (entidadId) params.entidadId = entidadId;
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