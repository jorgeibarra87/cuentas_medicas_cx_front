import { useEffect, useState } from "react";
import { obtenerProcesosServiciosQueTienenPreguntas } from "../../api/monitorizacionHc/preguntasService";

const useFetchProcesoServicioConPreguntas = () => {
     const [procesosServicios, setProcesosServicios] = useState([]);
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState(null);

     useEffect(() => {
        if(procesosServicios.length === 0){
            fetchProcesosUsuariosConPreguntas();
        }
    }, []);

     const fetchProcesosUsuariosConPreguntas = async () => {
         setLoading(true);
         setError(null);
         try {
             const procesosServiciosData = await obtenerProcesosServiciosQueTienenPreguntas();
             setProcesosServicios(procesosServiciosData.map(ps => ({ value: ps.id, label: ps.nombre, tipo: ps.tipo })));
         } catch (error) {
             setError('Error al obtener los procesos y servicios que tienen preguntas de monitorizacion microservice', error);
         } finally {
             setLoading(false);
         }
     }

     return { procesosServicios, loadingPs: loading, error, fetchProcesosUsuariosConPreguntas };
}

export default useFetchProcesoServicioConPreguntas;