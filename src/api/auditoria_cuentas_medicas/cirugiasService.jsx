import apiClientCirugias from "./apiClienteCirugias";

export const importarCirugias = async (fecha) => {
    try {
        const response = await apiClientCirugias.post('/cirugias/importar/bd', null, {
            params: { fecha }
        });
        return response.data;
    } catch (error) {
        console.error('Error al importar cirugías', error);
        throw error;
    }
}

export const obtenerCirugiasPageable = async (fecha, busqueda, page, size) => {
    try {
        const params = { page, size };
        if (fecha) params.fecha = fecha;
        if (busqueda) params.busqueda = busqueda;
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