import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookMedical, faDollar, faFileEdit, faPencilAlt, faTruckMedical } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:8082';

export default function CuentasMedicasTable({ onEdit = () => { }, reloadFlag }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [seleccionados, setSeleccionados] = useState(new Set());

    const navigate = useNavigate();

    const loadData = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_BASE}/cuentas-medicas`);
            if (!res.ok) throw new Error(`Error ${res.status}`);
            setData(await res.json());
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, [reloadFlag]);

    if (loading) return <p>Cargando cuentas medicas...</p>;
    if (error) return <p className="text-red-600">Error: {error}</p>;

    return (
        <div className="bg-white shadow-md rounded-lg p-2">

            {/* ✅ Botones con navegación */}
            <button
                onClick={() => navigate('/referenciacontrareferencia/traslados')}
                className="font-bold mx-2 my-6 px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
            >
                <FontAwesomeIcon icon={faTruckMedical} className="w-4 h-4 text-white pr-2" />Traslados
            </button>
            <button
                onClick={() => navigate('/referenciacontrareferencia/traslados')}
                className="font-bold mx-2 my-6 px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
            >
                <FontAwesomeIcon icon={faFileEdit} className="w-4 h-4 text-white pr-2" />Referencia
            </button>
            <button
                onClick={() => navigate('/referenciacontrareferencia/facturaciones')}
                className="font-bold mx-2 my-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                <FontAwesomeIcon icon={faDollar} className="w-4 h-4 text-white pr-2" />Facturación
            </button>
            <button
                onClick={() => navigate('/referenciacontrareferencia/cuentas-medicas')}
                className="font-bold mx-2 my-6 px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
            >
                <FontAwesomeIcon icon={faBookMedical} className="w-4 h-4 text-white pr-2" />Cuentas Medicas
            </button>

            <div className="overflow-x-auto">
                <table className="min-w-full text-gray-700" style={{ fontSize: '10px' }}>
                    <thead>
                        <tr className="bg-gray-800 text-white">
                            <th className="px-2 py-0.5 font-semibold">Traslado ID</th>
                            <th className="px-2 py-0.5 font-semibold">Documento</th>
                            <th className="px-2 py-0.5 font-semibold">Paciente</th>
                            <th className="px-2 py-0.5 font-semibold">Fecha Cuenta</th>
                            <th className="px-2 py-0.5 font-semibold">Servicio Egreso</th>
                            <th className="px-2 py-0.5 font-semibold">Responsable Auditoria</th>
                            <th className="px-2 py-0.5 font-semibold">Observaciones</th>
                            <th className="px-2 py-0.5 font-semibold">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(t => (
                            <tr
                                key={t.id}
                                className={`border-b hover:bg-gray-50 ${seleccionados.has(t.id) ? 'bg-blue-50' : ''}`}
                            >
                                <td className="border-r px-1 py-0.5">{t.trasladoId}</td>
                                <td className="border-r px-1 py-0.5">{t.documento}</td>
                                <td className="border-r px-1 py-0.5">{t.nomPaciente}</td>
                                <td className="border-r px-1 py-0.5">
                                    {t.fechaCuenta?.replace('T', ' ').slice(0, 16)}
                                </td>
                                <td className="border-r px-1 py-0.5">{t.servicioEgreso}</td>
                                <td className="border-r px-1 py-0.5">{t.responsableAuditoria}</td>
                                <td className="border-r px-1 py-0.5">{t.observaciones}</td>
                                <td className="px-3 py-2">
                                    <button onClick={() => onEdit(t)}>
                                        <FontAwesomeIcon
                                            icon={faPencilAlt}
                                            className="w-4 h-4 text-blue-600 cursor-pointer hover:-translate-y-1 transition duration-300"
                                        />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={12} className="text-center py-4 text-gray-500">
                                    No hay Cuentas Medicas registradas.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
