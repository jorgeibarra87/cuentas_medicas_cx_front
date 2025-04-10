import { useEffect, useState } from "react";
import { obtenerRespuestasByIngresoId } from "../../api/monitorizacionHc/respuestasService";
import Ingreso from "../../models/monitorizacionHc/Ingreso";
import Swal from "sweetalert2";

const useFetchRespuestasByIngreso = () => {

    const [ingreso, setIngreso] = useState(new Ingreso());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() =>{
        if(ingreso.id != null){
            Swal.fire({
                title: 'Buscando respuestas...',
                text: 'El ingreso ya tiene respuestas registradas',
                icon: 'warning',
                confirmButtonText: 'Entendido'
            });
        }
    },[ingreso]);

    const fetchRespuestasByIngreso = async (idIngreso) => {
        setLoading(true);
        setError(null);
        try {
            const ingresoData = await obtenerRespuestasByIngresoId(idIngreso);
            setIngreso(new Ingreso(ingresoData));
        } catch (error) {
            setError('Error al obtener las respuestas', error);
        } finally {
            setLoading(false);
        }
    }

    return { ingreso, loadingI: loading, fetchRespuestasByIngreso };
}

export default useFetchRespuestasByIngreso;