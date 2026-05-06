import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookMedical, faPencilAlt, faSearch, faCalendarAlt, faDatabase } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import Pagination from '../../Pagination';
import { importarCirugias, obtenerCirugiasPageable, actualizarCirugia } from '../../../api/auditoria_cuentas_medicas/cirugiasService';
import { toast } from 'react-toastify';

const PAGE_SIZE = 50;

const INPUT_CLASS = "border-2 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
const INPUT_READONLY = "border-2 border-gray-200 rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed text-gray-500";

export default function CirugiasTable({ onEdit = () => { }, reloadFlag }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElementos, setTotalElementos] = useState(0);
    const [fontSize, setFontSize] = useState(10);

    const [fecha, setFecha] = useState('');
    const [importando, setImportando] = useState(false);
    const [buscando, setBuscando] = useState(false);
    const [importResult, setImportResult] = useState(null);

    const [busqueda, setBusqueda] = useState('');

    const aumentarTexto = () => setFontSize(prev => Math.min(prev + 1, 16));
    const reducirTexto = () => setFontSize(prev => Math.max(prev - 1, 8));

    const validarFecha = () => {
        if (!fecha) {
            toast.error('Debes seleccionar una fecha');
            return false;
        }
        return true;
    };

    const loadData = async (pagina = page) => {
        setLoading(true);
        setError('');
        try {
            const response = await obtenerCirugiasPageable(fecha || null, busqueda || null, pagina, PAGE_SIZE);
            setData(response.contenido || []);
            setTotalPages(response.totalPaginas || 0);
            setTotalElementos(response.totalElementos || 0);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const loadDataSinFiltro = async (pagina = 0) => {
        setLoading(true);
        setError('');
        try {
            const response = await obtenerCirugiasPageable(null, busqueda || null, pagina, PAGE_SIZE);
            setData(response.contenido || []);
            setTotalPages(response.totalPaginas || 0);
            setTotalElementos(response.totalElementos || 0);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBuscar = async (e) => {
        e.preventDefault();
        if (!validarFecha()) return;
        setBuscando(true);
        setPage(0);
        await loadData(0);
        setBuscando(false);
    };

    const handleImportar = async (e) => {
        e.preventDefault();
        if (!validarFecha()) return;

        setImportando(true);
        setError('');
        setImportResult(null);

        try {
            const result = await importarCirugias(fecha);
            setImportResult(result);
            setPage(0);
            await loadDataSinFiltro(0);
            toast.success('Importación completada');
        } catch (err) {
            setError(err.message);
            toast.error('Error en la importación');
        } finally {
            setImportando(false);
        }
    };

    const handleActualizarCampo = async (id, campo, valor) => {
        try {
            await actualizarCirugia(id, { [campo]: valor });
            await loadDataSinFiltro(page);
            toast.success('Campo actualizado');
        } catch (err) {
            toast.error('Error al actualizar: ' + err.message);
        }
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        loadDataSinFiltro(newPage);
    };

    const handleBusquedaSubmit = (e) => {
        e.preventDefault();
        setPage(0);
        loadDataSinFiltro(0);
    };

    const handleLimpiarBusqueda = () => {
        setBusqueda('');
        setPage(0);
        loadDataSinFiltro(0);
    };

    useEffect(() => { loadDataSinFiltro(page); }, [reloadFlag]);

    if (loading) return <p className="text-center py-4">Cargando...</p>;
    if (error) return <p className="text-red-600 text-center py-4">Error: {error}</p>;

    return (
        <div className="bg-white shadow-md rounded-lg p-2 w-full max-w-none">
            <form onSubmit={handleBuscar} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex flex-wrap items-end gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                            Fecha
                        </label>
                        <input
                            type="date"
                            value={fecha}
                            onChange={e => setFecha(e.target.value)}
                            className={INPUT_CLASS}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={buscando}
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-all shadow-md disabled:opacity-50"
                    >
                        <FontAwesomeIcon icon={faSearch} className="mr-2" />
                        {buscando ? 'Buscando...' : 'Buscar'}
                    </button>
                    <button
                        type="button"
                        onClick={handleImportar}
                        disabled={importando}
                        className="px-6 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition-all shadow-md disabled:opacity-50"
                    >
                        <FontAwesomeIcon icon={faDatabase} className="mr-2" />
                        {importando ? 'Cargando...' : 'Cargar'}
                    </button>
                </div>

                {importResult && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                        <p className="text-sm font-medium text-blue-800">
                            {importResult.mensajes?.join(' | ') || 'Proceso completado'}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                            Total: {importResult.totalRegistros} | Exitosos: {importResult.exitosos} | Errores: {importResult.errores}
                        </p>
                    </div>
                )}
            </form>

            <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
                <form onSubmit={handleBusquedaSubmit} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                        placeholder="Paciente, ingreso, CUPS o médico..."
                        className="border-2 border-gray-300 rounded-md px-3 py-1.5 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button type="submit" className="px-3 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700 transition-all">
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
                    {busqueda && (
                        <button type="button" onClick={handleLimpiarBusqueda} className="px-3 py-1.5 bg-gray-300 text-gray-700 text-sm font-semibold rounded hover:bg-gray-400 transition-all">
                            Limpiar
                        </button>
                    )}
                </form>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{totalElementos} registro(s)</span>
                    <button onClick={reducirTexto} className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-bold">A-</button>
                    <button onClick={aumentarTexto} className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-bold">A+</button>
                </div>
            </div>

            <div style={{ height: 'calc(100vh - 400px)', overflow: 'scroll', scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 #f1f5f9' }}>
                <table className="w-full min-w-full table-auto text-gray-700" style={{ fontSize: `${fontSize}px` }}>
                    <thead>
                        <tr className="sticky top-0 z-20 bg-gray-800 text-white">
                            <th className="px-2 py-0.5 font-semibold">ID</th>
                            <th className="px-2 py-0.5 font-semibold">Tipo</th>
                            <th className="px-2 py-0.5 font-semibold">Paciente</th>
                            <th className="px-2 py-0.5 font-semibold">Ingreso</th>
                            <th className="px-2 py-0.5 font-semibold">Cups</th>
                            <th className="px-2 py-0.5 font-semibold">Proced.Cod</th>
                            <th className="px-2 py-0.5 font-semibold">Intervención</th>
                            <th className="px-2 py-0.5 font-semibold">Especialidad</th>
                            <th className="px-2 py-0.5 font-semibold">Médico</th>
                            <th className="px-2 py-0.5 font-semibold">Fecha Solicitud</th>
                            <th className="px-2 py-0.5 font-semibold">Fecha Cargue</th>
                            <th className="px-2 py-0.5 font-semibold">Hora Cargue</th>
                            <th className="px-2 py-0.5 font-semibold">Régimen</th>
                            <th className="px-2 py-0.5 font-semibold">Entidad</th>
                            <th className="px-2 py-0.5 font-semibold">GQX</th>
                            <th className="px-2 py-0.5 font-semibold">Anestesiólogo</th>
                            <th className="px-2 py-0.5 font-semibold">Ayudante 1</th>
                            <th className="px-2 py-0.5 font-semibold">Ayudante 2</th>
                            <th className="px-2 py-0.5 font-semibold">Auditoría %</th>
                            <th className="px-2 py-0.5 font-semibold">Novedad</th>
                            <th className="px-2 py-0.5 font-semibold">Autorización</th>
                            <th className="px-2 py-0.5 font-semibold">Imágenes Dx</th>
                            <th className="px-2 py-0.5 font-semibold">Estado</th>
                            <th className="px-2 py-0.5 font-semibold">Causa Objeción</th>
                            <th className="px-2 py-0.5 font-semibold">Rev Supervision</th>
                            <th className="px-2 py-0.5 font-semibold">Observación</th>
                            <th className="px-2 py-0.5 font-semibold">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(t => (
                            <tr key={t.id} className="border-b hover:bg-gray-50">
                                <td className="border-r px-1 py-0.5">{t.id}</td>
                                <td className="border-r px-1 py-0.5">{t.tipoProcedimiento}</td>
                                <td className="border-r px-1 py-0.5">{t.pacienteNumeroIdentificacion}</td>
                                <td className="border-r px-1 py-0.5">{t.ingresoNumero}</td>
                                <td className="border-r px-1 py-0.5">{t.cupsCodigo}</td>
                                <td className="border-r px-1 py-0.5">{t.procedCod}</td>
                                <td className="border-r px-1 py-0.5">{t.intervencion}</td>
                                <td className="border-r px-1 py-0.5">{t.especialidadNombre}</td>
                                <td className="border-r px-1 py-0.5">{t.medicoNombre}</td>
                                <td className="border-r px-1 py-0.5">{t.fechaSolicitud}</td>
                                <td className="border-r px-1 py-0.5">{t.fechaCargue}</td>
                                <td className="border-r px-1 py-0.5">{t.horaCargue}</td>
                                <td className="border-r px-1 py-0.5">{t.regimen}</td>
                                <td className="border-r px-1 py-0.5">{t.entidadSaludNombre}</td>
                                <td className="border-r px-1 py-0.5">{t.gqx}</td>
                                <td className="border-r px-1 py-0.5">{t.anestesiologoNombre}</td>
                                <td className="border-r px-1 py-0.5">{t.ayudante1}</td>
                                <td className="border-r px-1 py-0.5">{t.ayudante2}</td>
                                <td className="border-r px-1 py-0.5">{t.auditoriaPorcentaje}</td>
                                <td className="border-r px-1 py-0.5">{t.novedadDesc}</td>
                                <td className="border-r px-1 py-0.5">{t.autorizacion}</td>
                                <td className="border-r px-1 py-0.5">{t.imagenesDx}</td>
                                <td className="border-r px-1 py-0.5">{t.estadoAuditoria}</td>
                                <td className="border-r px-1 py-0.5">{t.causaObjecion}</td>
                                <td className="border-r px-1 py-0.5">{t.revSupervision}</td>
                                <td className="border-r px-1 py-0.5">{t.observacionAuditoria}</td>
                                <td className="px-3 py-2">
                                    <button onClick={() => onEdit(t)}>
                                        <FontAwesomeIcon icon={faPencilAlt} className="w-4 h-4 text-blue-600 cursor-pointer hover:-translate-y-1 transition duration-300" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={27} className="text-center py-4 text-gray-500">
                                    {busqueda ? 'No se encontraron resultados para "' + busqueda + '".' : 'No hay procedimientos registrados.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="p-2 border-t bg-gray-50">
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
        </div>
    );
}
