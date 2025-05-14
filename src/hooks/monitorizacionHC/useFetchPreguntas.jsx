import { useState } from "react";
import { obtenerPreguntasServicio } from "../../api/monitorizacionHc/preguntasService";

const useFetchPreguntas = () =>{
    const [preguntas, setPreguntas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPreguntas = async (id, tipo) =>{
        setLoading(true);
        setError(null);
        try {
            const preguntasData = await obtenerPreguntasServicio(id, tipo);
            setPreguntas(preguntasData);
        } catch (error) {
            setError('Error al obtener las preguntas',error);
        } finally {
            setLoading(false);
        }
    }

    return {preguntas, setPreguntas, loadingP: loading, fetchPreguntas};
}

export default useFetchPreguntas;