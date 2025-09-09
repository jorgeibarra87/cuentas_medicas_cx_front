import Select from 'react-select';
import useFetchRespuestaIndividual from '../../hooks/monitorizacionHC/useFetchRespuestaIndividual';
import React, { useState } from 'react';
import Loader from '../Loader';

function ReporteIndividual({ procesosServicios }) {
  
  const { data, loading, error, fetchRespuestasIndividual } = useFetchRespuestaIndividual();

  const [formData, setFormData] = useState({});

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (selectedOption) => {
    if(selectedOption.tipo == 'SERVICIO'){
        setFormData((prevData) => ({
          ...prevData,
          servicioId: selectedOption ? selectedOption.value : null,
          procesoId: null, // Reiniciar procesoId si se selecciona un servicio
        }));
    } else if(selectedOption.tipo == 'PROCESO'){
       setFormData((prevData) => ({
          ...prevData,
          procesoId: selectedOption ? selectedOption.value : null,
          servicioId: null, // Reiniciar servicioId si se selecciona un proceso
        }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Evita que la página se recargue

    if ((formData.servicioId || formData.procesoId) && formData.tipo_pregunta && formData.ingreso) {
      if(formData.servicioId){
            fetchRespuestasIndividual({servicioId: formData.servicioId,tipo_pregunta: formData.tipo_pregunta,ingreso: formData.ingreso,});
      } else if(formData.procesoId){
            fetchRespuestasIndividual({procesoId: formData.procesoId,tipo_pregunta: formData.tipo_pregunta,ingreso: formData.ingreso,});
      }
    } else {
      alert('Por favor, complete todos los campos.');
    }
  };

  return (
    <div>
      <form className="col-md-12 p-2 rounded-lg" onSubmit={handleSubmit}>
        <div className="row gx-3 gy-2 align-items-center">
          <div className="col-auto d-flex align-items-center">
            <label htmlFor="servicioSelect" className="form-label mb-0 me-2">Servicio / Proceso</label>
            <Select options={procesosServicios} className="" placeholder="Seleccione un Proceso/Servicio" required onChange={handleSelectChange} id="servicioSelect" />
          </div>
          <div className="col-auto d-flex align-items-center">
            <label htmlFor="tipoPregunta" className="form-label mb-0 me-2">Tipo pregunta:</label>
            <select className="form-select" name="tipo_pregunta" id="tipoPregunta" required onChange={handleInputChange} value={formData.tipo_pregunta} >
              <option value="">Seleccione una opción</option>
              <option value="MEDICO">MEDICO</option>
              <option value="ENFERMERIA">ENFERMERIA</option>
            </select>
          </div>
          <div className="col-auto d-flex align-items-center">
            <label htmlFor="ingreso" className="form-label mb-0 me-2">Ingreso</label>
            <input type="text" className="form-control" name="ingreso" id="ingreso" required onChange={handleInputChange} value={formData.ingreso} />
          </div>
          <div className="col-auto">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Cargando...' : 'Enviar'}
            </button>
          </div>
        </div>
      </form>

      {loading && <Loader />}
      {error && <p>Error: {error.message || 'Ocurrió un error desconocido.'}</p>}
      <table className='w-full boder-collapse border border-gray-300'>
        <thead>
            <tr className='bg-gray-200 text-gray-800'>
                <th className='border p-2 text-left'>Grupo</th>
                <th className='border p-2 text-left'>Pregunta</th>
                <th className='border p-2 text-left'>Respuesta</th>
            </tr>
        </thead>
        <tbody>
      {data?.length > 0 ? (
          <>
            {data.map((grupo) => (
              <>
                {grupo.pregunta.map((preguntaItem, preguntaIndex) => (
                    <tr key={preguntaItem.id} className='hover:bg-gray-50'>
                        {preguntaIndex === 0 && (
                            <td rowSpan={grupo.pregunta.length} className='border p-2 align-top font-semibold text-sm text-gray-700'>
                                {grupo.nombre}
                            </td>
                        )}
                        <td className='border p-2 text-sm'>{preguntaItem.pregunta}</td>
                        <td className='border p-2 text-sm'>{preguntaItem.respuesta}</td>
                    </tr>
                ))}
              </>
            ))}
          </>
        ) : (
          <tr>
            <td colSpan={3} className='border p-2 text-sm text-center'>No hay datos disponibles</td>
          </tr>
        )}
        </tbody>
        </table>
    </div>
  );
}

export default ReporteIndividual;
