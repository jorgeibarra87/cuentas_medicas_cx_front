import apiClientNutricion from "./apiClientNutricion"

export const primeraEvaluacion = async (arrPatients, status) => {
  try {
    const response = await apiClientNutricion.post('tamizaje/evaluate', {
      arrPatients,
      status,
    });
    return response.data;
  } catch (error) {
    console.error('Error en primeraEvaluacion:', error);
    throw error;
  }
};

export const finalizarTamizaje = async (arrPatients, status) => {
  try {
    const response = await apiClientNutricion.post('tamizaje/evaluate2', {
      arrPatients,
      status,
    });
    return response.data;
  }
  catch (error) {
    console.error('Error en finalizarTamizaje:', error);
    throw error;
  }
};

export const eliminarTamizaje = async (incomeId) => {
  try {
    const response = await apiClientNutricion.delete('tamizaje/delete', {
      data: { incomeId },
    });
    return response.data;
  } catch (error) {
    console.error('Error en eliminarTamizaje:', error);
    throw error;
  }
};

export const obtenerEvaluacionesTamizajes = async (ingresosIds) => {
  try {
    const searchParams = new URLSearchParams();
    ingresosIds.forEach(id => searchParams.append('ingresosIds', id));

    const url = `/tamizaje/obtenerTamizajes?${searchParams.toString()}`;
    const response = await apiClientNutricion.get(url);
    return response.data;
  } catch (error) {
    console.error('Error al obtener evaluaciones de tamizajes:', error);
    throw error;
  }
};