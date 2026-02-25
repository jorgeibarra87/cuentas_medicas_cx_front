import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight, faAmbulance, faTruckMedical, faFileEdit, faDollar, faBookMedical } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:8082';

export default function TrasladosTotalPage() {
    const [datos, setDatos] = useState([]);
    const [expandido, setExpandido] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${API_BASE}/traslados-completos`)
            .then(res => res.json())
            .then(data => setDatos(data))
            .finally(() => setLoading(false));
    }, []);

    const toggleFila = (id) =>
        setExpandido(prev => ({ ...prev, [id]: !prev[id] }));

    if (loading) return <p className="text-center py-8 text-gray-500">Cargando...</p>;

    return (
        <div className="min-h-screen bg-white p-4">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
                <FontAwesomeIcon icon={faAmbulance} className="mr-2 text-blue-600" />
                Traslados Vista Completa
            </h1>

            {/* ✅ Botones con navegación */}
            <button
                onClick={() => navigate('/referenciacontrareferencia/totaltraslados')}
                className="font-bold mx-2 my-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
                className="font-bold mx-2 my-6 px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
                <FontAwesomeIcon icon={faDollar} className="w-4 h-4 text-white pr-2" />Facturación
            </button>
            <button
                onClick={() => navigate('/referenciacontrareferencia/cuentas-medicas')}
                className="font-bold mx-2 my-6 px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
            >
                <FontAwesomeIcon icon={faBookMedical} className="w-4 h-4 text-white pr-2" />Cuentas Medicas
            </button>

            <div className="overflow-x-auto shadow border border-gray-200">
                <table className="min-w-full text-xs text-gray-700">
                    <thead className=" bg-gray-800 text-white uppercase text-xs">
                        <tr>
                            <th className="px-2 py-2"></th>
                            <th className="px-2 py-2 text-left">ID</th>
                            <th className="px-2 py-2 text-left">Documento</th>
                            <th className="px-2 py-2 text-left">Paciente</th>
                            <th className="px-2 py-2 text-left">EPS</th>
                            <th className="px-2 py-2 text-left">Ingreso</th>
                            <th className="px-2 py-2 text-left">Fecha Traslado</th>
                            <th className="px-2 py-2 text-left">Facturaciones</th>
                            <th className="px-2 py-2 text-left">Cuentas Médicas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datos.map(({ traslado, facturaciones, cuentasMedicas }) => (
                            <>
                                {/* ── Fila principal del traslado ── */}
                                <tr
                                    key={traslado.id}
                                    className="border-t hover:bg-blue-50 cursor-pointer"
                                    onClick={() => toggleFila(traslado.id)}
                                >
                                    <td className="px-2 py-2 text-gray-400">
                                        <FontAwesomeIcon icon={expandido[traslado.id] ? faChevronDown : faChevronRight} />
                                    </td>
                                    <td className="px-2 py-2 font-semibold text-blue-700">{traslado.id}</td>
                                    <td className="px-2 py-2">{traslado.documento}</td>
                                    <td className="px-2 py-2">{traslado.nomPaciente}</td>
                                    <td className="px-2 py-2">{traslado.eps}</td>
                                    <td className="px-2 py-2">{traslado.ingreso}</td>
                                    <td className="px-2 py-2">{traslado.fechaTraslado?.slice(0, 10)}</td>
                                    <td className="px-2 py-2">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${facturaciones.length > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                                            {facturaciones.length}
                                        </span>
                                    </td>
                                    <td className="px-2 py-2">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${cuentasMedicas.length > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'}`}>
                                            {cuentasMedicas.length}
                                        </span>
                                    </td>
                                </tr>

                                {/* ── Fila expandida ── */}
                                {expandido[traslado.id] && (
                                    <tr key={`exp-${traslado.id}`}>
                                        <td colSpan={9} className="bg-gray-50 px-6 py-3 border-t">

                                            {/* Facturaciones */}
                                            <p className="text-xs font-bold text-green-700 uppercase mb-1"><FontAwesomeIcon icon={faDollar} className="w-4 h-4" />Facturación</p>
                                            {facturaciones.length === 0 ? (
                                                <p className="text-xs text-gray-400 mb-3">Sin facturación</p>
                                            ) : (
                                                <table className="w-full text-xs mb-3 border rounded">
                                                    <thead className="bg-green-50 text-green-800">
                                                        <tr>
                                                            <th className="px-2 py-1 text-left">ID</th>
                                                            <th className="px-2 py-1 text-left">Prefactura</th>
                                                            <th className="px-2 py-1 text-left">Factura</th>
                                                            <th className="px-2 py-1 text-left">Valor</th>
                                                            <th className="px-2 py-1 text-left">Facturador</th>
                                                            <th className="px-2 py-1 text-left">F. Factura</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {facturaciones.map(f => (
                                                            <tr key={f.id} className="border-t">
                                                                <td className="px-2 py-1">{f.id}</td>
                                                                <td className="px-2 py-1">{f.prefactura}</td>
                                                                <td className="px-2 py-1">{f.factura}</td>
                                                                <td className="px-2 py-1">${f.valor?.toLocaleString()}</td>
                                                                <td className="px-2 py-1">{f.nombreFacturador}</td>
                                                                <td className="px-2 py-1">{f.fechaFactura?.slice(0, 10)}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            )}

                                            {/* Cuentas Médicas */}
                                            <p className="text-xs font-bold text-blue-700 uppercase mb-1"><FontAwesomeIcon icon={faBookMedical} className="w-4 h-4" />Cuentas Médicas</p>
                                            {cuentasMedicas.length === 0 ? (
                                                <p className="text-xs text-gray-400">Sin cuentas médicas</p>
                                            ) : (
                                                <table className="w-full text-xs border rounded">
                                                    <thead className="bg-blue-50 text-blue-800">
                                                        <tr>
                                                            <th className="px-2 py-1 text-left">ID</th>
                                                            <th className="px-2 py-1 text-left">Fecha Cuenta</th>
                                                            <th className="px-2 py-1 text-left">Servicio Egreso</th>
                                                            <th className="px-2 py-1 text-left">Responsable</th>
                                                            <th className="px-2 py-1 text-left">Observaciones</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {cuentasMedicas.map(c => (
                                                            <tr key={c.id} className="border-t">
                                                                <td className="px-2 py-1">{c.id}</td>
                                                                <td className="px-2 py-1">{c.fechaCuenta?.slice(0, 10)}</td>
                                                                <td className="px-2 py-1">{c.servicioEgreso}</td>
                                                                <td className="px-2 py-1">{c.responsableAuditoria}</td>
                                                                <td className="px-2 py-1">{c.observaciones}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
