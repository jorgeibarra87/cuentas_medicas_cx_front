import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookMedical, faCheck, faDollar, faEdit, faFileEdit, faPencilAlt, faTruckMedical, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:8082';

export default function TrasladosTable({ onEdit = () => { }, reloadFlag }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [seleccionados, setSeleccionados] = useState(new Set());
    const [procesando, setProcesando] = useState(false);
    const navigate = useNavigate();

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

    // Toggle individual
    const toggleCheck = (id) => {
        setSeleccionados(prev => {
            const nuevo = new Set(prev);
            nuevo.has(id) ? nuevo.delete(id) : nuevo.add(id);
            return nuevo;
        });
    };

    // Cambiar estado
    const cambiarEstado = async (nuevoEstado) => {
        if (seleccionados.size === 0) {
            alert('Selecciona al menos un traslado');
            return;
        }

        // ✅ Confirmación antes de proceder
        const confirmacion = window.confirm(
            `¿Estás seguro de que deseas ${nuevoEstado === 'VALIDADO' ? 'VALIDAR' : 'INVALIDAR'} 
${seleccionados.size} traslado(s)?`
        );

        if (!confirmacion) return; // ← Si cancela, no hace nada

        setProcesando(true);
        try {
            await Promise.all(
                [...seleccionados].map(id =>
                    fetch(`${API_BASE}/traslados/${id}/estado?estado=${nuevoEstado}`, {
                        method: 'PATCH'
                    })
                )
            );
            setSeleccionados(new Set());
            loadData();
            alert(`✅ ${seleccionados.size} traslado(s) ${nuevoEstado === 'VALIDADO' ? 'validado(s)' : 'invalidado(s)'} correctamente`);
        } catch (err) {
            alert('❌ Error al cambiar estado: ' + err.message);
        } finally {
            setProcesando(false);
        }
    };


    useEffect(() => {
        loadData();
    }, [reloadFlag]);

    if (loading) return <p>Cargando traslados...</p>;
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
                className="font-bold mx-2 my-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                <FontAwesomeIcon icon={faFileEdit} className="w-4 h-4 text-white pr-2" />Referencia
            </button>
            <button
                onClick={() => navigate('/referenciacontrareferencia/facturaciones')}
                className="font-bold mx-2 my-6 px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
            >
                <FontAwesomeIcon icon={faDollar} className="w-4 h-4 text-white pr-2" />Facturación
            </button>
            <button
                onClick={() => navigate('/referenciacontrareferencia/cuentas-medicas')}
                className="font-bold mx-2 my-6 px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
            >
                <FontAwesomeIcon icon={faBookMedical} className="w-4 h-4 text-white pr-2" />Cuentas Medicas
            </button>
            <div className="flex justify-end">
                <span className="text-sm text-gray-500 my-auto mr-2">
                    {seleccionados.size > 0 && `${seleccionados.size} seleccionado(s)`}
                </span>
                <button
                    onClick={() => cambiarEstado('VALIDADO')}
                    disabled={procesando || seleccionados.size === 0}
                    className="hover:cursor-pointer text-xs font-semibold mx-1 my-2 px-1 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                    <FontAwesomeIcon icon={faCheck} className="w-4 h-4 text-white" /> Validar
                </button>
                <button
                    onClick={() => cambiarEstado('PENDIENTE')}
                    disabled={procesando || seleccionados.size === 0}
                    className="hover:cursor-pointer text-xs font-semibold mx-1 my-2 px-1 py-1 bg-red-500 text-white rounded hover:bg-red-700 disabled:opacity-50"
                >
                    <FontAwesomeIcon icon={faXmark} className="w-4 h-4 text-white font-bold" /> Invalidar
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full text-gray-700" style={{ fontSize: '10px' }}>
                    <thead>
                        <tr className="bg-gray-800 text-white">
                            {/* <th className="px-2 py-0.5 font-semibold">ID</th> */}
                            <th className="hover:cursor-pointer px-2 py-0.5">
                                {/* Seleccionar todos */}
                                <input
                                    type="checkbox"
                                    className="hover:cursor-pointer"
                                    onChange={e => {
                                        if (e.target.checked) setSeleccionados(new Set(data.map(t => t.id)));
                                        else setSeleccionados(new Set());
                                    }}
                                    checked={seleccionados.size === data.length && data.length > 0}
                                />
                            </th>
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
                                {/* <td className="border-r px-1 py-0.5">{t.id}</td> */}
                                {/* Checkbox */}
                                <td className="px-2 py-0.5 text-center">
                                    <input
                                        type="checkbox"
                                        checked={seleccionados.has(t.id)}
                                        onChange={() => toggleCheck(t.id)}
                                        className="hover:cursor-pointer"
                                    />
                                </td>
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
                                <td className={`border-r px-1 py-0.5 font-semibold ${t.estado === "PENDIENTE" ? "bg-yellow-300" : ""} ${t.estado === "VALIDADO" ? "bg-green-400" : ""}`}
                                >
                                    {t.estado}
                                </td>
                                <td className="px-3 py-2 space-x-2">
                                    <button
                                        onClick={() => {
                                            console.log('🔥 Click Editar, onEdit:', onEdit);
                                            onEdit?.(t);
                                        }}
                                        className="text-blue-600 hover:underline text-sm"
                                    >
                                        <FontAwesomeIcon icon={faPencilAlt} className="w-10 h-10 text-blue-600 pr-2 hover:cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y-1" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={19} className="text-center py-4 text-gray-500">
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
