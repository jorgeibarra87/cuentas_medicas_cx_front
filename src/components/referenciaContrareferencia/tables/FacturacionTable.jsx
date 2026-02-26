import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookMedical, faDollar, faFileEdit, faPencilAlt, faTruckMedical, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../Pagination';

const API_BASE = 'http://localhost:8082';
const PAGE_SIZE = 2; // máximo por página

export default function FacturacionTable({ onEdit = () => { }, reloadFlag }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [seleccionados, setSeleccionados] = useState(new Set());
    // Lee los roles del token directamente
    const token = localStorage.getItem('tokenhusjp');
    const payload = token ? JSON.parse(atob(token.split('.')[1])) : {};
    // authorities: "ROLE_X" (string) o ["ROLE_X", "ROLE_Y"]
    const roles = Array.isArray(payload.authorities)
        ? payload.authorities
        : payload.authorities?.split(',').map(r => r.trim()) || [];

    const tieneRol = (rol) => roles.includes(rol);

    // Estado de busqueda
    const [busqueda, setBusqueda] = useState('');

    //estados paginacion y tamaño texto
    const [page, setPage] = useState(0);
    const [fontSize, setFontSize] = useState(10);
    const aumentarTexto = () => setFontSize(prev => Math.min(prev + 1, 16));
    const reducirTexto = () => setFontSize(prev => Math.max(prev - 1, 8));

    const navigate = useNavigate();

    const loadData = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_BASE}/facturaciones`);
            if (!res.ok) throw new Error(`Error ${res.status}`);
            setData(await res.json());
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, [reloadFlag]);

    const dataFiltrada = busqueda.trim() === ''
        ? data
        : data.filter(t =>
            t.documento?.toLowerCase().includes(busqueda.toLowerCase()) ||
            t.nomPaciente?.toLowerCase().includes(busqueda.toLowerCase())
        );

    const totalPages = Math.ceil(dataFiltrada.length / PAGE_SIZE);
    const paginatedData = dataFiltrada.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

    if (loading) return <p>Cargando facturas...</p>;
    if (error) return <p className="text-red-600">Error: {error}</p>;

    return (
        <div className="bg-white shadow-md rounded-lg p-2">

            {/* ✅ Botones con navegación */}
            <button
                onClick={() => navigate('/referenciacontrareferencia/totaltraslados')}
                className="font-bold mx-2 my-6 px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
            >
                <FontAwesomeIcon icon={faTruckMedical} className="w-4 h-4 text-white pr-2" />Traslados
            </button>
            {tieneRol('ROLE_ADMINISTRADOR') && (<button
                onClick={() => navigate('/referenciacontrareferencia/traslados')}
                className="font-bold mx-2 my-6 px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
            >
                <FontAwesomeIcon icon={faFileEdit} className="w-4 h-4 text-white pr-2" />Referencia
            </button>)}
            {tieneRol('ROLE_ADMINISTRADO') && (<button
                onClick={() => navigate('/referenciacontrareferencia/facturaciones')}
                className="font-bold mx-2 my-6 px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
                <FontAwesomeIcon icon={faDollar} className="w-4 h-4 text-white pr-2" />Facturación
            </button>)}
            {tieneRol('ROLE_ADMINISTRADO') && (<button
                onClick={() => navigate('/referenciacontrareferencia/cuentas-medicas')}
                className="font-bold mx-2 my-6 px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
            >
                <FontAwesomeIcon icon={faBookMedical} className="w-4 h-4 text-white pr-2" />Cuentas Medicas
            </button>)}

            <div className="flex justify-between items-center mb-2 text-xs text-gray-600">
                {/* Buscador */}
                <div className="flex items-center space-x-2">
                    <span className="font-medium"><FontAwesomeIcon icon={faSearch} className="w-4 h-4" /> Buscar:</span>
                    <input
                        type="text"
                        value={busqueda}
                        onChange={e => {
                            setBusqueda(e.target.value);
                            setPage(0); // resetea a página 1 al buscar
                        }}
                        placeholder="Documento o paciente..."
                        className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
                        style={{ width: '200px' }}
                    />
                    {busqueda && (
                        <button
                            onClick={() => { setBusqueda(''); setPage(0); }}
                            className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs"
                        >
                            ✕ Limpiar
                        </button>
                    )}
                </div>

                {/* ✅ Control tamaño texto */}
                <div className="flex justify-end items-center mb-2 space-x-2 text-xs text-gray-600">
                    <span>Tamaño texto:</span>
                    <button onClick={reducirTexto} className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-bold">A–</button>
                    <button onClick={aumentarTexto} className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-bold">A+</button>
                </div>
            </div>

            {/* ✅ Contenedor con scroll */}
            <div className="relative mb-8 border border-gray-300 rounded-lg shadow-md bg-white flex flex-col"
                style={{ minHeight: '400px', maxHeight: '900px' }}>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-gray-700" style={{ fontSize: `${fontSize}px` }}>
                        <thead>
                            <tr className="bg-gray-800 text-white">
                                <th className="px-2 py-0.5 font-semibold">Traslado ID</th>
                                <th className="px-2 py-0.5 font-semibold">Documento</th>
                                <th className="px-2 py-0.5 font-semibold">Paciente</th>
                                <th className="px-2 py-0.5 font-semibold">Fecha Prefactura</th>
                                <th className="px-2 py-0.5 font-semibold">Prefactura</th>
                                <th className="px-2 py-0.5 font-semibold">Producción</th>
                                <th className="px-2 py-0.5 font-semibold">Fecha Factura</th>
                                <th className="px-2 py-0.5 font-semibold">Factura</th>
                                <th className="px-2 py-0.5 font-semibold">Valor</th>
                                <th className="px-2 py-0.5 font-semibold">Facturador</th>
                                {tieneRol('ROLE_ADMINISTRADO') && (
                                    <th className="px-2 py-0.5 font-semibold">Acciones</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map(t => (
                                <tr
                                    key={t.id}
                                    className={`border-b hover:bg-gray-50 ${seleccionados.has(t.id) ? 'bg-blue-50' : ''}`}
                                >
                                    <td className="border-r px-1 py-0.5">{t.trasladoId}</td>
                                    <td className="border-r px-1 py-0.5">{t.documento}</td>
                                    <td className="border-r px-1 py-0.5">{t.nomPaciente}</td>
                                    <td className="border-r px-1 py-0.5">
                                        {t.fechaPrefactura?.replace('T', ' ').slice(0, 16)}
                                    </td>
                                    <td className="border-r px-1 py-0.5">{t.prefactura}</td>
                                    <td className="border-r px-1 py-0.5">{t.produccion}</td>
                                    <td className="border-r px-1 py-0.5">
                                        {t.fechaFactura?.replace('T', ' ').slice(0, 16)}
                                    </td>
                                    <td className="border-r px-1 py-0.5">{t.factura}</td>
                                    <td className="border-r px-1 py-0.5">
                                        {t.valor?.toLocaleString('es-CO', {
                                            style: 'currency',
                                            currency: 'COP',
                                            minimumFractionDigits: 0
                                        })}
                                    </td>
                                    <td className="border-r px-1 py-0.5">{t.nombreFacturador}</td>
                                    {tieneRol('ROLE_ADMINISTRADO') && (
                                        <td className="px-3 py-2">
                                            <button onClick={() => onEdit(t)}>
                                                <FontAwesomeIcon
                                                    icon={faPencilAlt}
                                                    className="w-4 h-4 text-blue-600 cursor-pointer hover:-translate-y-1 transition duration-300"
                                                />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {data.length === 0 && (
                                <tr>
                                    <td colSpan={12} className="text-center py-4 text-gray-500">
                                        No hay facturas registradas.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* ✅ Paginación al fondo */}
                <div className="flex-shrink-0 p-2 border-t bg-gray-50">
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={(newPage) => setPage(newPage)}
                    />
                </div>
            </div>
        </div>
    );
}
