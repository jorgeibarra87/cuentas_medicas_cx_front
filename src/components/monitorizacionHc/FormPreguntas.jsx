import useAdnIngreso from "../../hooks/monitorizacionHC/useAdnIngreso";
import SearchIngreso from "./SearchIngreso";
import useFetchPreguntas from "../../hooks/monitorizacionHC/useFetchPreguntas";
import React, { useEffect, useState } from "react";
import useSaveRespuestas from "../../hooks/monitorizacionHC/useSaveRespuestas";
import Ingreso from "../../models/monitorizacionHc/Ingreso";
import Loader from "../Loader";
import AdnIngreso from "../../models/dinamica/AdnIngreso";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

function FormPreguntas() {

    const { adnIngreso, setAdnIngreso, loadingAdnI, fetchAdnIngreso } = useAdnIngreso();
    const { preguntas: grupoPreguntas, setPreguntas, loadingP, fetchPreguntas } = useFetchPreguntas();
    const { loadingRes, responseSr, saveRespuestas, error } = useSaveRespuestas();

    const { tipo: tipoPregunta } = useParams(); // Medico, Enfermeria
    const [respuestas, setRespuestas] = useState([]);
    const [servicio, setServicio] = useState(null);
    const todasRespondidas = grupoPreguntas.reduce((sum, grupo) => { return sum + grupo.preguntas.length }, 0) === respuestas.length;

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
    }, [adnIngreso]);

    // manejo de errores
    useEffect(() => {
        if (error?.response?.data.codigoError === "MHC-0014") {
            toast.warning(error.response.data.mensaje.split('|')[1]);
        } else if (error) {
            toast.error("se presento un error al guardar las respuestas");
        }
    }, [error]);

    const handleSubmit = (e) => {
        const ingreso = {
            ...adnIngreso,
            respuestas: respuestas
        };
        const op = new Ingreso(ingreso);
        const form = {
            ingreso: op,
            procesoServicio: servicio
        };
        saveRespuestas(form, tipoPregunta.toUpperCase());
    };

    // al recibir respuestas limpiamos el ingreso.
    useEffect(() => {
        if (responseSr || tipoPregunta) {
            setAdnIngreso(new AdnIngreso());
            if (responseSr) toast.success("Respuestas guardadas correctamente");
        }
    }, [responseSr, tipoPregunta]);

    return (
        <div className="px-4 py-2">
            {(loadingRes || loadingAdnI || loadingP) && <Loader />}
            <div className="row">
                {/* <SearchIngreso fetchAdnIngreso={fetchAdnIngreso} setAdnIngreso={setAdnIngreso} fetchPreguntas={fetchPreguntas} adnIngreso={adnIngreso} fetchRespuestasByIngreso={fetchRespuestasByIngreso} setServicio={setServicio}/> */}
                <SearchIngreso {...{ fetchAdnIngreso, setAdnIngreso, fetchPreguntas, adnIngreso, setServicio }} />
                {grupoPreguntas.length == 0 ? (
                    adnIngreso.id ? (
                        <div className="mt-4">
                            <div className="p-6 border rounded-lg shadow-lg bg-white">
                                <h2 className="text-center text-gray-700 text-xl">Esta selección no cuenta con preguntas.</h2>
                            </div>
                        </div>
                    ) : (<></>)
                ) : (
                    <div className="mt-4">
                        <div className="p-6 border rounded-lg shadow-lg bg-white">
                            <table className="w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-200 text-gray-800">
                                        <th className="border p-2 text-left">Grupo</th>
                                        <th className="border p-2 text-left">Pregunta para {tipoPregunta.toUpperCase()}</th>
                                        <th className="border p-2 text-left">Sí</th>
                                        <th className="border p-2 text-left">No</th>
                                        <th className="border p-2 text-left">No Aplica</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {grupoPreguntas.map((grupo, grupoIndex) => (
                                        <React.Fragment key={grupo.nombre}>
                                            {grupo.preguntas.map((preguntaItem, preguntaIndex) => (
                                                <tr key={preguntaItem.id} className="hover:bg-gray-50">
                                                    {preguntaIndex === 0 && (
                                                        <td rowSpan={grupo.preguntas.length} className="border p-2 align-top font-semibold text-sm text-gray-700">
                                                            {grupo.nombre}
                                                        </td>
                                                    )}
                                                    <td className="border p-2 text-sm">{preguntaItem.pregunta}</td>
                                                    {["SI", "NO", "NO_APLICA"].map((opcion) => (
                                                        <td key={opcion} className="border text-center">
                                                            <input type="radio" name={`pregunta-${preguntaItem.id}`} value={opcion} checked={!!respuestas.find((r) => r.pregunta.id === preguntaItem.id && r.respuesta === opcion)} onChange={() => handleChange(preguntaItem.id, preguntaIndex.pregunta, opcion)} />
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                            <button className={`mt-6 px-4 py-2 rounded text-white ${todasRespondidas
                                ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
                                }`} disabled={!todasRespondidas} onClick={handleSubmit}>Enviar</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FormPreguntas;