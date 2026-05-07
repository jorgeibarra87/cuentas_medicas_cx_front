import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faSearch, faCalendarAlt, faDatabase } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState, useCallback } from 'react';
import Pagination from '../../Pagination';
import { importarCirugias, obtenerCirugiasPageable, actualizarCirugia } from '../../../api/auditoria_cuentas_medicas/cirugiasService';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const PAGE_SIZE = 50;

const INPUT_CLASS = "border-2 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
const INPUT_READONLY = "border-2 border-gray-200 rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed text-gray-500";
const INPUT_INLINE = "border border-blue-400 bg-white px-1 py-0.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500";
const SELECT_INLINE = "border border-blue-400 bg-white px-1 py-0.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500";

const OPCIONES_AUTORIZACION = ['', 'Sí', 'No', 'Pendiente'];
const OPCIONES_ESTADO = ['', 'Pendiente', 'Hecho', 'Ok', 'No facturable', 'Adición', 'Nulo', 'Facturable', 'Revisión', 'Hecho pendiente', 'Adición pendiente'];

export default function CirugiasTable({ onEdit = () => { }, reloadFlag }) {
    const statelogin = useSelector((state) => state.login);
    const usuario = statelogin.decodeToken;

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElementos, setTotalElementos] = useState(0);
    const [fontSize, setFontSize] = useState(10);

    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [importando, setImportando] = useState(false);
    const [buscando, setBuscando] = useState(false);
    const [importResult, setImportResult] = useState(null);

    const [busqueda, setBusqueda] = useState('');
    const [filtroTipo, setFiltroTipo] = useState('');
    const [filtroEntidad, setFiltroEntidad] = useState('');

    const [editId, setEditId] = useState(null);
    const [editData, setEditData] = useState({});

    const aumentarTexto = () => setFontSize(prev => Math.min(prev + 1, 16));
    const reducirTexto = () => setFontSize(prev => Math.max(prev - 1, 8));

    const obtenerNombreUsuario = () => usuario?.name_user || '';

    const validarFechas = (mesesMax) => {
        if (!fechaInicio || !fechaFin) {
            toast.error('Debes seleccionar fecha de inicio y fecha fin');
            return false;
        }
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        const diffMeses = (fin.getFullYear() - inicio.getFullYear()) * 12 + (fin.getMonth() - inicio.getMonth());
        if (diffMeses > mesesMax) {
            toast.error(`El rango máximo permitido es de ${mesesMax} mes${mesesMax > 1 ? 'es' : ''}`);
            return false;
        }
        if (fin < inicio) {
            toast.error('La fecha fin debe ser mayor o igual a la fecha inicio');
            return false;
        }
        return true;
    };

    const loadData = async (pagina = page) => {
        setLoading(true);
        setError('');
        try {
            const response = await obtenerCirugiasPageable(fechaInicio || null, fechaFin || null, busqueda || null, filtroTipo || null, filtroEntidad || null, pagina, PAGE_SIZE);
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
            const response = await obtenerCirugiasPageable(null, null, busqueda || null, filtroTipo || null, filtroEntidad || null, pagina, PAGE_SIZE);
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
        if (!validarFechas(3)) return;
        setBuscando(true);
        setPage(0);
        await loadData(0);
        setBuscando(false);
    };

    const handleImportar = async (e) => {
        e.preventDefault();
        if (!validarFechas(1)) return;

        setImportando(true);
        setError('');
        setImportResult(null);

        try {
            const result = await importarCirugias(fechaInicio, fechaFin);
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

    const startEdit = useCallback((id, row) => {
        setEditId(id);
        setEditData({
            liquidacion: row.liquidacion || '',
            novedadDesc: row.novedadDesc || '',
            autorizacion: row.autorizacion || '',
            imagenesDx: row.imagenesDx || '',
            estadoAuditoria: row.estadoAuditoria || '',
            causaObjecion: row.causaObjecion || '',
        });
    }, []);

    const cancelEdit = useCallback(() => {
        setEditId(null);
        setEditData({});
    }, []);

    const updateCell = useCallback((campo, valor) => {
        setEditData(prev => {
            const nuevo = { ...prev, [campo]: valor };
            if (campo === 'liquidacion' && valor) {
                nuevo.revSupervision = obtenerNombreUsuario();
            }
            return nuevo;
        });
    }, []);

    const saveEdit = useCallback(async (id) => {
        if (!editId) return;
        try {
            const payload = {
                liquidacion: editData.liquidacion,
                novedadDesc: editData.novedadDesc,
                autorizacion: editData.autorizacion,
                imagenesDx: editData.imagenesDx,
                estadoAuditoria: editData.estadoAuditoria,
                causaObjecion: editData.causaObjecion,
            };
            if (editData.revSupervision) {
                payload.revSupervision = editData.revSupervision;
            }
            await actualizarCirugia(id, payload);
            toast.success('Registro actualizado');
            cancelEdit();
            await loadDataSinFiltro(page);
        } catch (err) {
            toast.error('Error al actualizar: ' + err.message);
        }
    }, [editId, editData, page]);

    const handleKeyDown = useCallback((e, id) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveEdit(id);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            cancelEdit();
        }
    }, [saveEdit, cancelEdit]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
        loadData(newPage);
    };

    const handleBusquedaSubmit = (e) => {
        e.preventDefault();
        setPage(0);
        loadData(0);
    };

    const handleLimpiarBusqueda = () => {
        setBusqueda('');
        setPage(0);
        loadData(0);
    };

    const handleFiltroChange = (filtro, valor) => {
        if (filtro === 'tipo') {
            setFiltroTipo(valor);
        } else if (filtro === 'entidad') {
            setFiltroEntidad(valor);
        }
        setPage(0);
        loadData(0);
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
                            Fecha Inicio
                        </label>
                        <input
                            type="date"
                            value={fechaInicio}
                            onChange={e => setFechaInicio(e.target.value)}
                            className={INPUT_CLASS}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                            Fecha Fin
                        </label>
                        <input
                            type="date"
                            value={fechaFin}
                            onChange={e => setFechaFin(e.target.value)}
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
                <form onSubmit={handleBusquedaSubmit} className="flex items-center gap-2 flex-wrap">
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
                    <div className="flex items-center gap-2 ml-4">
                        <select value={filtroTipo} onChange={e => handleFiltroChange('tipo', e.target.value)} className="border-2 border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="">Todos los tipos</option>
                            <option value="CIRUGIA">Cirugía</option>
                            <option value="ENDOSCOPIA">Endoscopía</option>
                        </select>
                        <select value={filtroEntidad} onChange={e => handleFiltroChange('entidad', e.target.value)} className="border-2 border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="">Todas las entidades</option>
                            <option value="1">Nueva EPS</option>
                            <option value="2">FAMISANAR</option>
                            <option value="3">COOSALUD</option>
                            <option value="4">SALUD TOTAL</option>
                            <option value="5">EMSSANAR</option>
                            <option value="6">MALLARCO</option>
                        </select>
                    </div>
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
                            <th className="px-2 py-0.5 font-semibold">Liquidación</th>
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
                        {data.map(t => {
                            const isEditing = editId === t.id;
                            return (
                                <tr key={t.id} className={`border-b hover:bg-gray-50 ${isEditing ? 'bg-yellow-50' : ''}`}>
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
                                    <td className="border-r px-1 py-0.5" onDoubleClick={() => startEdit(t.id, t)}>
                                        {isEditing ? (
                                            <input value={editData.liquidacion} onChange={e => updateCell('liquidacion', e.target.value)} onKeyDown={e => handleKeyDown(e, t.id)} className={INPUT_INLINE} placeholder="100%, 75%..." autoFocus />
                                        ) : (t.liquidacion || '')}
                                    </td>
                                    <td className="border-r px-1 py-0.5" onDoubleClick={() => startEdit(t.id, t)}>
                                        {isEditing ? (
                                            <input value={editData.novedadDesc} onChange={e => updateCell('novedadDesc', e.target.value)} onKeyDown={e => handleKeyDown(e, t.id)} className={INPUT_INLINE} placeholder="cx, anes..." autoFocus />
                                        ) : (t.novedadDesc || '')}
                                    </td>
                                    <td className="border-r px-1 py-0.5" onDoubleClick={(e) => { e.preventDefault(); startEdit(t.id, t); }}>
                                        {isEditing ? (
                                            <select value={editData.autorizacion} onChange={e => updateCell('autorizacion', e.target.value)} onKeyDown={e => handleKeyDown(e, t.id)} className={SELECT_INLINE} autoFocus>
                                                {OPCIONES_AUTORIZACION.map(op => <option key={op} value={op}>{op || ''}</option>)}
                                            </select>
                                        ) : (t.autorizacion || '')}
                                    </td>
                                    <td className="border-r px-1 py-0.5" onDoubleClick={() => startEdit(t.id, t)}>
                                        {isEditing ? (
                                            <input value={editData.imagenesDx} onChange={e => updateCell('imagenesDx', e.target.value)} onKeyDown={e => handleKeyDown(e, t.id)} className={INPUT_INLINE} autoFocus />
                                        ) : (t.imagenesDx || '')}
                                    </td>
                                    <td className="border-r px-1 py-0.5" onDoubleClick={(e) => { e.preventDefault(); startEdit(t.id, t); }}>
                                        {isEditing ? (
                                            <select value={editData.estadoAuditoria} onChange={e => updateCell('estadoAuditoria', e.target.value)} onKeyDown={e => handleKeyDown(e, t.id)} className={SELECT_INLINE} autoFocus>
                                                {OPCIONES_ESTADO.map(op => <option key={op} value={op}>{op || ''}</option>)}
                                            </select>
                                        ) : (t.estadoAuditoria || '')}
                                    </td>
                                    <td className="border-r px-1 py-0.5" onDoubleClick={() => startEdit(t.id, t)}>
                                        {isEditing ? (
                                            <input value={editData.causaObjecion} onChange={e => updateCell('causaObjecion', e.target.value)} onKeyDown={e => handleKeyDown(e, t.id)} className={INPUT_INLINE} autoFocus />
                                        ) : (t.causaObjecion || '')}
                                    </td>
                                    <td className="border-r px-1 py-0.5">{t.revSupervision || ''}</td>
                                    <td className="border-r px-1 py-0.5">{t.observacionAuditoria || ''}</td>
                                    <td className="px-3 py-2">
                                        <button onClick={() => onEdit(t)}>
                                            <FontAwesomeIcon icon={faPencilAlt} className="w-4 h-4 text-blue-600 cursor-pointer hover:-translate-y-1 transition duration-300" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
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
