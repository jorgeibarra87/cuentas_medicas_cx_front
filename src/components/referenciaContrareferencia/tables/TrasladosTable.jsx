import { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:8082';

export default function TrasladosTable({ onEdit, reloadFlag }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const loadData = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_BASE}/traslados`);
            if (!res.ok) throw new Error(`Error ${res.status}`);
            const json = await res.json();
            setData(json);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [reloadFlag]);

    if (loading) return <p>Cargando traslados...</p>;
    if (error) return <p className="text-red-600">Error: {error}</p>;

    return (
        <div className="bg-white shadow-md rounded-lg p-2">
            <button
                className="font-bold mx-2 my-6 px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 disabled:opacity-50"
            >Traslados
            </button>
            <button
                className="font-bold mx-2 my-6 px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 disabled:opacity-50"
            >Referencia
            </button>
            <button
                className="font-bold mx-2 my-6 px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 disabled:opacity-50"
            >Facturación
            </button>
            <button
                className="font-bold mx-2 my-6 px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 disabled:opacity-50"
            >Cuentas Medicas
            </button>
            <h3 className="text-4xl font-bold mb-2">Gestión de Referencia</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full text-gray-700" style={{ fontSize: '10px' }}>
                    <thead>
                        <tr className="bg-gray-800 text-white">
                            <th className="px-2 py-0.5 font-semibold">ID</th>
                            <th className="px-2 py-0.5 font-semibold">Fecha</th>
                            <th className="px-2 py-0.5 font-semibold">Paciente</th>
                            <th className="px-2 py-0.5 font-semibold">Documento</th>
                            <th className="px-2 py-0.5 font-semibold">Ingreso</th>
                            <th className="px-2 py-0.5 font-semibold">EPS</th>
                            <th className="px-2 py-0.5 font-semibold">Tipo Traslado</th>
                            <th className="px-2 py-0.5 font-semibold">Servicio</th>
                            <th className="px-2 py-0.5 font-semibold">Destino</th>
                            <th className="px-2 py-0.5 font-semibold">Ciudad</th>
                            <th className="px-2 py-0.5 font-semibold">Autorización</th>
                            <th className="px-2 py-0.5 font-semibold">Auxiliar Referencia</th>
                            <th className="px-2 py-0.5 font-semibold">Auxiliar Ambulancia</th>
                            <th className="px-2 py-0.5 font-semibold">Medicamentos</th>
                            <th className="px-2 py-0.5 font-semibold">Archivo</th>
                            <th className="px-2 py-0.5 font-semibold">Observación</th>
                            <th className="px-2 py-0.5 font-semibold">Estado</th>
                            <th className="px-2 py-0.5 font-semibold">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(t => (
                            <tr key={t.id} className="border-b hover:bg-gray-50">
                                <td className="border-r px-1 py-0.5">{t.id}</td>
                                <td className="border-r px-1 py-0.5">{t.fechaTraslado?.replace('T', ' ').slice(0, 16)}</td>
                                <td className="border-r px-1 py-0.5">{t.nomPaciente}</td>
                                <td className="border-r px-1 py-0.5">{t.documento}</td>
                                <td className="border-r px-1 py-0.5">{t.ingreso}</td>
                                <td className="border-r px-1 py-0.5">{t.eps}</td>
                                <td className="border-r px-1 py-0.5">{t.tipoTraslado}</td>
                                <td className="border-r px-1 py-0.5">{t.servicio}</td>
                                <td className="border-r px-1 py-0.5">{t.destino}</td>
                                <td className="border-r px-1 py-0.5">{t.ciudad}</td>
                                <td className="border-r px-1 py-0.5">{t.autorizacion}</td>
                                <td className="border-r px-1 py-0.5">{t.auxiliarReferencia}</td>
                                <td className="border-r px-1 py-0.5">{t.auxiliarAmbulancia}</td>
                                <td className="border-r px-1 py-0.5">{t.medicamentos?.join(', ') || ''}</td>
                                <td className="border-r px-1 py-0.5">{t.archivo}</td>
                                <td className="border-r px-1 py-0.5">{t.observaciones}</td>
                                <td className="border-r px-1 py-0.5">{t.estado}</td>
                                <td className="px-3 py-2 space-x-2">
                                    <button
                                        onClick={() => onEdit(t)}
                                        className="text-blue-600 hover:underline text-xs"
                                    >
                                        Editar
                                    </button>
                                    {/* <button
                                        onClick={() => handleDelete(t.id)}
                                        className="text-red-600 hover:underline text-xs"
                                    >
                                        Eliminar
                                    </button> */}
                                </td>
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={8} className="text-center py-4 text-gray-500">
                                    No hay traslados registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
