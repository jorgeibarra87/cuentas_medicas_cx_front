import { useState } from 'react';
import GraficasPorcentajes from './GraficasPorcentajes';
import ReporteIndividual from './ReporteIndividual';
import useFetchProcesoServicioConPreguntas from '../../hooks/monitorizacionHC/useFetchProcesoServicioConPreguntas';
import Loader from '../Loader';

function ReportesIndex() {
  const [activeTab, setActiveTab] = useState('opcion1');
  const { procesosServicios, loadingPs: loadingProServ, error: errorProServ } = useFetchProcesoServicioConPreguntas();

  if (loadingProServ) return <Loader />;
  if (errorProServ) return <div className="alert alert-danger">Error al cargar los procesos y servicios: {errorProServ.message}</div>;

  return (
    <div className="container">
      <div className="flex space-x-4 mb-4">
        <button onClick={() => setActiveTab('opcion1')}
          className={`px-4 py-1 text-white rounded focus:outline-none focus:ring-2 transition-colors duration-200 ${activeTab === 'opcion1' ? 'bg-blue-600' : 'bg-blue-500 hover:bg-blue-600'}`}>
          Reporte General
        </button>
        <button onClick={() => setActiveTab('opcion2')}
          className={`px-4 py-1 text-white rounded focus:outline-none focus:ring-2 transition-colors duration-200 ${activeTab === 'opcion2' ? 'bg-green-600' : 'bg-green-500 hover:bg-green-600'}`}>
          Reporte Individual
        </button>
      </div>

      {activeTab === 'opcion1' && (
        <div className="p-4 bg-gray-100 rounded shadow border border-gray-300">
          <GraficasPorcentajes  procesosServicios={procesosServicios}/>
        </div>
      )}
      {activeTab === 'opcion2' && (
        <div className="p-4 bg-gray-100 rounded shadow border border-gray-300">
          <ReporteIndividual procesosServicios={procesosServicios}/>
        </div>
      )}
    </div>
  );
}

export default ReportesIndex;
