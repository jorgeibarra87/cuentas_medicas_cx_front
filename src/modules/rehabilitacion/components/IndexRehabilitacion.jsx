import { useState } from 'react';
import * as XLSX from 'xlsx';
import useFetchIndicadoresFinalizados from '../../../modules/rehabilitacion/hooks/useFetchIndicadoresFinalizados';
import useFetchEspecialidadReh from '../../../modules/rehabilitacion/hooks/useFetchEspecialidadReh';
import Loader from '../../../shared/components/Loader';

function IndexRehabilitacion() {
  const { data: dataI, loading: loadingI, error: errorI, fetchIndicadoresFinalizados } = useFetchIndicadoresFinalizados();
  const { data: dataE, loading: loadingE, error: errorE } = useFetchEspecialidadReh();

  const [form, setForm] = useState({
    fechaInicio: '',
    fechaFin: '',
    especialidad: 'TERAPIA_FISICA',
  });
  
  const handleExport = () => {
    if (!dataI || dataI.items.length === 0) return;

    // 1. Mapeamos y formateamos los datos explícitamente
    const formattedRows = dataI.items.map(item => {
      return {
        'ID': item.id,
        'Fecha Programada': item.fechaProgramada,
        'Hora Programada': item.horaProgramada,
        'Documento': item.documentoPaciente,
        'Paciente': item.nombreCompletoPaciente,
        'Especialidad': item.especialidad?.replace('_', ' '),
        'Profesional': item.profesional,
        'Hora Llegada': item.tiempoLlegada ? item.tiempoLlegada.split('.')[0] : '', // Quita milisegundos incomodos
        'Inicio Atención': item.inicioAtencion ? item.inicioAtencion.split('.')[0] : '',
        'Fin Atención': item.finAtencion ? item.finAtencion.split('.')[0] : '',

        // Enviamos el String de duración de forma normal
        'Duración Atención': item.duracionAtencion || '00:00:00',
        'Tiempo Espera': item.tiempoEsperaAtencion || '00:00:00',

        'Estado': item.estadoSesion,
        'Llegada Tardía': item.llegadaTardia ? 'SÍ' : 'NO' // Más estético que VERDADERO/FALSO
      };
    });

    // 2. Crear la hoja con los encabezados limpios
    const worksheet = XLSX.utils.json_to_sheet(formattedRows);

    // 3. TRUCO DE MAGIA: Forzar a Excel a interpretar las duraciones como TIEMPO numérico
    const range = XLSX.utils.decode_range(worksheet['!ref']);

    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
      // Columnas 10 y 11 correspondientes a 'Duración Atención' y 'Tiempo Espera' (Base 0: K y L)
      [7, 8, 9, 10, 11].forEach(colIdx => {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: colIdx });
        const cell = worksheet[cellRef];

        if (cell && cell.v && typeof cell.v === 'string' && cell.v.includes(':')) {
          const parts = cell.v.split(':');
          const hours = parseInt(parts[0], 10);
          const minutes = parseInt(parts[1], 10);
          const seconds = parseInt(parts[2], 10);

          // Convertir la hora a la fracción de día que usa Excel internamente (N)
          const excelTimeFraction = (hours * 3600 + minutes * 60 + seconds) / 86400;

          cell.t = 'n'; // Tipo numérico
          cell.v = excelTimeFraction; // Valor puro para cálculo
          cell.z = 'hh:mm:ss'; // Formato visual de hora en Excel
        }
      });
    }

    // 4. Construir y guardar el archivo
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte');

    const timestamp = new Date().toISOString().replace(/[:.-]/g, '').slice(0, 14);
    XLSX.writeFile(workbook, `reporte_rehabilitacion_${timestamp}.xlsx`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    fetchIndicadoresFinalizados(form);
  };

  if (loadingE) return <Loader />;
  if (errorE) return <p className="text-center text-lg text-red-500 mt-8">Error al cargar las especialidades: {errorE}</p>;

  return (
    <div className="container mx-auto p-2 sm:p-6 bg-gray-50 ">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Reporte de Rehabilitación</h1>

      {/* Formulario de filtros */}
      <div className="bg-white p-3 rounded-lg shadow-md mb-8">
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Campo Fecha de Inicio */}
          <div>
            <label htmlFor="fechaInicio" className="block text-sm font-medium text-gray-700">
              Fecha de Inicio
            </label>
            <input type="date" id="fechaInicio" name="fechaInicio" value={form.fechaInicio} onChange={(e) => handleChange(e)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2" required />
          </div>

          {/* Campo Fecha de Fin */}
          <div>
            <label htmlFor="fechaFin" className="block text-sm font-medium text-gray-700">
              Fecha de Fin
            </label>
            <input type="date" id="fechaFin" name="fechaFin" value={form.fechaFin} onChange={(e) => handleChange(e)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2" required
            />
          </div>

          {/* Campo Select */}
          <div>
            <label htmlFor="especialidad" className="block text-sm font-medium text-gray-700">
              Opciones
            </label>
            <select id="especialidad" name='especialidad' value={form.especialidad} onChange={(e) => handleChange(e)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              required>
              {dataE.map((especialidad, index) => (
                <option key={index} value={especialidad.nombre}>
                  {especialidad.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Botón Obtener Información */}
          <div className="flex justify-start md:justify-end">
            <button
              type="submit"
              className="w-full md:w-auto px-2 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-50">
              Obtener Información
            </button>
          </div>
        </form>
      </div>

      {/* Sección de resultados */}
      {loadingI && <Loader />}
      {errorI && <p className="text-center text-lg text-red-500 mt-8">Error: {errorI}</p>}

      {dataI.items && (
        <div className="bg-white p-3 rounded-lg shadow-md flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Resultados de la búsqueda</h2>
            <button
              onClick={handleExport}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out">
              Exportar a XLSX
            </button>
          </div>

          {/* Contenedor de la tabla con scroll */}
          <div className="overflow-y-auto max-h-[400px] border border-gray-200 rounded-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Especialidad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profesional</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Agendada</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora Agendada</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora llegada</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inicio Atención</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Finalización Atención</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duración Atención</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiempo Espera</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dataI?.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{item.especialidad}</td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{item.profesional}</td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{item.fechaProgramada}</td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{item.horaProgramada}</td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{item.tiempoLlegada}</td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{item.inicioAtencion}</td>
                    <td className='px-6 py-2 whitespace-nowrap text-sm text-gray-500'>{item.finAtencion}</td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{item.duracionAtencion}</td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{item.tiempoEsperaAtencion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        
        <table className="min-w-full divide-y divide-gray-200 mt-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Duración Atención</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Promedio Duración Atención</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Registros</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{dataI.resumen.totalDuracionAtencion}</td>
              <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{dataI.resumen.promedioDuracionAtencion}</td>
              <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{dataI.resumen.cantidad}</td>
            </tr>
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
}

export default IndexRehabilitacion;
