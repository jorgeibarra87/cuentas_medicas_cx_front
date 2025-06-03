import useAdnIngreso from "../../hooks/monitorizacionHC/useAdnIngreso";
import SearchIngreso from "./SearchIngreso";
import useFetchPreguntas from "../../hooks/monitorizacionHC/useFetchPreguntas";
import { useEffect, useState } from "react";
import useSaveRespuestas from "../../hooks/monitorizacionHC/useSaveRespuestas";
import Ingreso from "../../models/monitorizacionHc/Ingreso";
import Loader from "../Loader";
import useFetchRespuestasByIngreso from "../../hooks/monitorizacionHC/useFetchRespuestasByIngreso";

function FormPreguntas() {
    const { adnIngreso, setAdnIngreso, loadingAdnI, fetchAdnIngreso} = useAdnIngreso();
    const { preguntas, setPreguntas, loadingP, fetchPreguntas } = useFetchPreguntas();
    const { loadingRes, responseSr, saveRespuestas } = useSaveRespuestas();
    const { ingreso, loadingI, fetchRespuestasByIngreso } = useFetchRespuestasByIngreso();
    
    const [respuestas, setRespuestas] = useState([]);
    const [servicio, setServicio] = useState(null);
    const todasRespondidas = preguntas.length === respuestas.length;

    const handleChange = (id, preguntaTexto, respuesta) => {
        setRespuestas((prev) => {
            const respuestasActualizadas = prev.filter((r) => r.pregunta.id !== id);// Eliminamos la respuesta previa de la misma pregunta (si existía)
            return [...respuestasActualizadas, { pregunta: { id, pregunta: preguntaTexto }, respuesta }];// Agregamos la nueva respuesta
        });
    };

    useEffect(() => {
        document.title = "Monitorición HC - Formulario de Preguntas";
    }, []);

    useEffect(() => {
        setPreguntas([]);
        setRespuestas([]);
    },[adnIngreso]);
    
    const handleSubmit = (e) => {
        const ingreso = {
            ...adnIngreso,
            respuestas: respuestas
        };
        const op = new Ingreso(ingreso);
        const form = {
            ingreso: op,
            procesoServicio : servicio
        };
        saveRespuestas(form); 
    };

    // al recibir respuestas limpiamos el ingreso.
    useEffect(() => {
        if(responseSr){
            setAdnIngreso([]);
        }
    },[responseSr]);
    
    useEffect(() => {// si el ingreso es null muestra el select de preguntas.
        if(ingreso?.respuestas?.length > 0){// si el ingreso no es null no muestra el select de preguntas.
            setAdnIngreso([]);
        }
    },[ingreso]);

    return (
        <div className="container">
            {(loadingRes || loadingAdnI || loadingP || loadingI ) && <Loader />}
          <div className="row">
            {/* <SearchIngreso fetchAdnIngreso={fetchAdnIngreso} setAdnIngreso={setAdnIngreso} fetchPreguntas={fetchPreguntas} adnIngreso={adnIngreso} fetchRespuestasByIngreso={fetchRespuestasByIngreso} setServicio={setServicio}/> */}
            <SearchIngreso {...{fetchAdnIngreso,setAdnIngreso,fetchPreguntas,adnIngreso,setServicio}}/>

            {preguntas.length == 0 ? (
              <></>
            ) : (
              <div className="col-md-12">
                <div className="p-4 border rounded-lg shadow-lg">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2">Pregunta</th>
                                <th className="border p-2">Sí</th>
                                <th className="border p-2">No</th>
                                <th className="border p-2">No Aplica</th>
                            </tr>
                        </thead>
                        <tbody>
                            {preguntas.map(({id, pregunta}) => (
                                <tr key={id}>
                                    <td className="border p-2">{pregunta}</td>
                                    {["Sí","No","No Aplica"].map((opcion) => (
                                        <td key={opcion} className="border text-center">
                                            <input type="radio" name={`pregunta-${id}`} value={opcion} checked={!!respuestas.find((r) => r.pregunta.id === id && r.respuesta === opcion)} onChange={() => handleChange(id, pregunta, opcion)}/>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className={`mt-4 px-4 py-2 rounded ${todasRespondidas ? "btn-primary" : "btn-secondary disabled"}`} disabled={!todasRespondidas} onClick={handleSubmit}>Enviar</button>
                </div>
              </div>
            )}
          </div>
        </div>
      );  
}

export default FormPreguntas;