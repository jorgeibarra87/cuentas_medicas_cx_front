import React, { useEffect, useRef, useState } from 'react'
import SignatureCanvas from 'react-signature-canvas';
import useFetchPreguntasCheqMan from '../../hooks/sistemas/useFetchPreguntasCheqMan';
import Loader from '../Loader';
import useSaveRespuestasCheqMan from '../../hooks/sistemas/useSaveRespuestasCheqMan';
import useFetchGenUsuarioInfo from '../../hooks/dinamicados/useFetchGenUsuarioInfo';

export default function FormManteEquipos() {

  const { preguntas, loading: loadingPr, error: errorPr, fetchPreguntas } = useFetchPreguntasCheqMan();
  const { loading: loadingR, error: errorR, saveRespuestas } = useSaveRespuestasCheqMan();
  const {data: dataGenUsuario, loading: loadingGenUsuario, error: errorGenUsuario, fetchGenUsuarioInfo} = useFetchGenUsuarioInfo();

  const groupDataByType = (data) => {
    return data.reduce((acc, item) => {
      const { tipo } = item;
      if (!acc[tipo]) {
        acc[tipo] = [];
      }
      acc[tipo].push(item);
      return acc;
    }, {});
  };

  const groupedData = groupDataByType(preguntas);

  useEffect(() => {
    fetchPreguntas();
  }, []);

  const firmaClienteRef = useRef();
  const firmaTecnicoRef = useRef();

  const [datos, setDatos] = useState({
    placa: "",
    cliente: {
      documento: "",
      nombreCompleto: "",
    },
    firmaUsuario: "",
    firmaCliente: "",
    respuestas: {}
  });

  useEffect(() => {
    if(dataGenUsuario?.oid) {
      setDatos((prev) => ({
        ...prev,
        cliente: {
          ...prev.cliente,
          documento: dataGenUsuario.usunombre,
          nombreCompleto: dataGenUsuario.usudescri
        }
      }));
    }else if(dataGenUsuario === null) {
      setDatos((prev) => ({
        ...prev,
        cliente: {
          ...prev.cliente,
          documento: "",
          nombreCompleto: ""
        }
      }));
    }

  },[dataGenUsuario]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === "radio") {
      setDatos(prev => ({
        ...prev,
        respuestas: {
          ...prev.respuestas,
          [name]: value === "true"
        }
      }));
    } else {
      if (name === "placa") {
      setDatos(prev => ({ ...prev, placa: value }));
    } else if (name === "documento") {
      setDatos(prev => ({
        ...prev,
        cliente: {
          ...prev.cliente,  // Mantenemos los otros datos del cliente
          documento: value  // Solo actualizamos el documento
        }
      }));
    }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const firmaUsuario = firmaClienteRef.current.toDataURL();
    const firmaCliente = firmaTecnicoRef.current.toDataURL();

    const formData = {
      ...datos,
      firmaUsuario,
      firmaCliente,
      respuestas: Object.entries(datos.respuestas).map(([id, valor]) => ({
        pregunta: { id: parseInt(id) },
        respuesta: valor
      }))
    };
    saveRespuestas(formData);
  };

  const limpiarFirma = (ref) => {
    ref.current.clear();
  }

  if( errorPr || errorR || errorGenUsuario) {
    return (
      <div className="alert alert-danger">
        <p>Error al cargar los datos: {errorPr?.message || errorR?.message || errorGenUsuario?.message}</p>
      </div>
    );
  }

  return (
    <>
      {loadingPr || loadingR ?  <Loader /> : (
        <form onSubmit={handleSubmit} className="p-4">
          <table className='table table-bordered'>
            <thead>
              <tr>
                <th className="border p-2">Pregunta</th>
                <th className="border p-2">Sí</th>
                <th className="border p-2">No</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(groupedData).map((tipo) => (
                <React.Fragment key={tipo}>
                  {/* Fila para mostrar el tipo */}
                  <tr>
                    <td colSpan="3" className='font-bold text-center'>
                      {tipo.toUpperCase()}
                    </td>
                  </tr>
                  {/* Filas para las preguntas de ese tipo */}
                  {groupedData[tipo].map((item) => (
                    <tr key={item.id} className='table'>
                      <td >{item.pregunta}</td>
                      <td >
                        <input type="radio" name={`${item.id}`} value={true} onChange={handleChange} required />
                      </td>
                      <td>
                        <input type="radio" name={`${item.id}`} value={false} onChange={handleChange}  required/>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          <div className="mb-4">
            <h2>Firma del Técnico</h2>
            <SignatureCanvas penColor="black" canvasProps={{ width: 300, height: 150, className: "border" }} ref={firmaTecnicoRef} />
            <button type="button" className='btn btn-secondary' onClick={() => limpiarFirma(firmaTecnicoRef)}>Limpiar</button>
          </div>
          <label>Placa</label>
          <input type="text" name="placa" className="border p-2 mb-4 w-full" onChange={handleChange} required />
          <label>Documento</label>
          <input type="text" name="documento" className="border p-2 mb-4 w-full" onChange={handleChange} required />
          <button type="button" className='btn btn-primary'  onClick={() => fetchGenUsuarioInfo(datos.cliente.documento)}>Buscar</button>          
          <div className="mb-4">
            <h2>Firma del Cliente</h2>
            <SignatureCanvas penColor="black" canvasProps={{ width: 300, height: 150, className: "border" }} ref={firmaClienteRef} />
            <button type="button" className='btn btn-secondary' onClick={() => limpiarFirma(firmaClienteRef)}>Limpiar</button>
          </div>

          <button type="submit" className="btn btn-primary">
            Enviar
          </button>
        </form>
      )}
    </>
  )
}
