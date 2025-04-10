import { useEffect, useState } from "react";
import { guardarRespuestas } from "../../api/monitorizacionHc/respuestasService";
import Swal from "sweetalert2";

const useSaveRespuestas = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);

    // Manejo del estado de error
    useEffect(() => {
        if (error?.response?.data.codigoError === "MHCP-0014") {
            Swal.fire({
                icon: 'warning',
                title: 'Guradando respuestas...',
                text: 'El ingreso ya tiene respuestas registradas',

            });
            setError(null);
        }
    }, [error]);

    // Manejo del estado de respuesta exitosa
    useEffect(() => {
        if (response) {
            Swal.fire({
                icon: 'success',
                title: 'Información',
                text: 'Respuestas registradas correctamente'
            });
            setResponse(null);
        }
    }, [response]);

    const fetchRespuestas = async (objIngresoConRespuestas) => {
        setLoading(true);
        setError(null);
        try {
            const respuestasData = await guardarRespuestas(objIngresoConRespuestas);
            setResponse(respuestasData);
        } catch (error) {
            setError(error);
        }finally{
            setLoading(false);
        }
    }
    return { loadingRes: loading, fetchRespuestas };
}

export default useSaveRespuestas;