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

export const obtenerCirugiasPageable = async (fechaInicio, fechaFin, busqueda, tipo, entidadIds, especialidadId, page, size) => {
    try {
        const params = { page, size };
        if (fechaInicio) params.fechaInicio = fechaInicio;
        if (fechaFin) params.fechaFin = fechaFin;
        if (busqueda) params.busqueda = busqueda;
        if (tipo) params.tipo = tipo;
        if (entidadIds && entidadIds.length > 0) params.entidadIds = entidadIds.join(',');
        if (especialidadId) params.especialidadId = especialidadId;
        const response = await apiClientCirugias.get('/cirugias', { params });
        return response.data;
    } catch (error) {
        console.error('Error al obtener cirugías', error);
        throw error;
    }
}

export const exportarCirugias = async (fechaInicio, fechaFin) => {
    try {
        const params = {};
        if (fechaInicio) params.fechaInicio = fechaInicio;
        if (fechaFin) params.fechaFin = fechaFin;
        const response = await apiClientCirugias.get('/cirugias/exportar', { params });
        return response.data;
    } catch (error) {
        console.error('Error al exportar cirugías', error);
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

export const crearCirugia = async (cirugiaData) => {
    try {
        const response = await apiClientCirugias.post('/cirugias/desde-nombres', cirugiaData);
        return response.data;
    } catch (error) {
        console.error('Error al crear la cirugía', error);
        throw error;
    }
}

export const duplicarCirugia = async (id, cirugiaData) => {
    try {
        const response = await apiClientCirugias.post(`/cirugias/${id}/duplicar`, cirugiaData);
        return response.data;
    } catch (error) {
        console.error('Error al duplicar la cirugía', error);
        throw error;
    }
}
