import { useEffect, useState } from 'react'
import { obtenerCitasConsolidadas, registrarFinalizacionCitaAmbulatoria, registrarllegadaCitaAmbulatoria, registrarNoLLegadaCitaAmbulatoria } from '../../api/rehabilitacion/registroCitasAmbulatorias'

function RegistroAsistenciaAmbulatoria() {

  const [citas, setCitas] = useState([])
  const [verTodo, setVerTodo] = useState(false)

  // ============================
  // Fetch agenda
  // ============================
  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const response = await obtenerCitasConsolidadas(verTodo) // Pasamos true para ver todas las citas, false para solo las del médico logueado
        setCitas(response)
      } catch (error) {
        console.error('Error al obtener las citas de rehabilitación', error)
      }
    }
    fetchCitas()
  }, [verTodo])

  // ============================
  // Utils
  // ============================
  const yaPasoHora = (fechaHoraCita) => {
    return new Date() > new Date(fechaHoraCita)
  }

  const obtenerHora = (fechaHora) => {
    return new Date(fechaHora).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const badgeEstado = (estado) => {
    switch (estado) {
      case 'EN_PROGRESO':
        return 'bg-blue-100 text-blue-700'
      case 'FINALIZADA':
        return 'bg-gray-200 text-gray-700'
      case 'NO_LLEGO':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-500'
    }
  }

  // ============================
  // Acciones
  // ============================
  const iniciarAtencion = async (cita) => {
    try {
      const body = {
        nombreCompletoPaciente: cita.patientName,
        documentoPaciente: cita.patientId,
        fechaProgramada: cita.appoinmentDate.split('T')[0],
        horaProgramada: cita.appoinmentDate.split('T')[1].substring(0, 8),
        especialidad: cita.speciality,
        profesional: cita.doctor
      }

      const response = await registrarllegadaCitaAmbulatoria(body)

      setCitas(prev =>
        prev.map(c =>
          c.patientId === cita.patientId
            ? { ...c, estadoSesion: 'EN_PROGRESO', id: response.id }
            : c
        )
      )
    } catch (error) {
      console.error('Error al iniciar atención', error)
    }
  }

  const finalizarAtencion = async (id) => {
    await registrarFinalizacionCitaAmbulatoria(id)

    setCitas(prev =>
      prev.map(c =>
        c.id === id ? { ...c, estadoSesion: 'FINALIZADA' } : c
      )
    )
  }

  const marcarNoLlegado = async (cita) => {
    const body = {
      nombreCompletoPaciente: cita.patientName,
      documentoPaciente: cita.patientId,
      fechaProgramada: cita.appoinmentDate.split('T')[0],
      horaProgramada: cita.appoinmentDate.split('T')[1].substring(0, 8),
      especialidad: cita.speciality,
      profesional: cita.doctor
    }

    await registrarNoLLegadaCitaAmbulatoria(body)

    setCitas(prev =>
      prev.map(c =>
        c.id === cita.id ? { ...c, estadoSesion: 'NO_LLEGO' } : c
      )
    )
  }

  // ============================
  // Render
  // ============================
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">
        Registro de Asistencia Ambulatoria
      </h2>

      <div className="overflow-x-auto rounded-lg shadow">
        <select className="mb-4 p-2 border rounded" value={verTodo} onChange={(e) => setVerTodo(e.target.value === 'true')}>
          <option value={false}>Ver mis citas</option>
          <option value={true}>Ver todas las citas</option>
        </select>
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Hora</th>
              <th className="px-4 py-3 text-left">Paciente</th>
              <th className="px-4 py-3 text-left">Especialidad</th>
              <th className="px-4 py-3 text-left">EPS</th>
              <th className="px-4 py-3 text-center">Estado</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {citas.map(cita => (
              <tr key={cita.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{obtenerHora(cita.appoinmentDate)}</td>
                <td className="px-4 py-3 font-medium">{cita.patientName}</td>
                <td className="px-4 py-3">{cita.speciality}</td>
                <td className="px-4 py-3 text-sm">{cita.eps}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeEstado(cita.estadoSesion)}`}>
                    {cita.estadoSesion}
                  </span>
                </td>
                <td className="px-4 py-3 text-center space-x-2">
                  <button onClick={() => iniciarAtencion(cita)} disabled={cita.estadoSesion !== 'PENDIENTE_DE_LLEGADA'}
                    className={`px-3 py-1 rounded text-white text-sm 
                      ${cita.estadoSesion === 'PENDIENTE_DE_LLEGADA' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'}`} >
                    Iniciar
                  </button>

                  {cita.estadoSesion === 'EN_PROGRESO' && (
                    <button onClick={() => finalizarAtencion(cita.id)} className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-800 text-white text-sm" >
                      Finalizar
                    </button>
                  )}

                  {cita.estadoSesion === 'PENDIENTE_DE_LLEGADA' &&
                    yaPasoHora(cita.appoinmentDate) && (
                      <button onClick={() => marcarNoLlegado(cita)} className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-sm" >
                        No llegó
                      </button>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RegistroAsistenciaAmbulatoria